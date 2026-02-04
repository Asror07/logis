import { useSocialAuthMutation } from "@/app/features/auth/auth.api";
import { setTokens, setUser } from "@/app/features/auth/authSlice";
import { useAppDispatch } from "@/app/hooks";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useLocation, useNavigate } from "react-router-dom";
import { getErrorMessage } from "./auth-utils";

export function GoogleLoginSection() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [socialAuth, { error: googleError }] = useSocialAuthMutation();

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/analytics";

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    try {
      const googleToken = credentialResponse.credential;

      if (!googleToken) {
        console.error("No credential received from Google");
        return;
      }

      const result = await socialAuth({
        token: googleToken,
        auth_type: "google",
      }).unwrap();

      const res = result as {
        tokens?: { access: string; refresh: string };
        access?: string;
        refresh?: string;
        token?: string;
        key?: string;
        access_token?: string;
        accessToken?: string;
      };

      let accessToken = typeof result === "string" ? result : null;

      if (!accessToken) {
        accessToken =
          res.tokens?.access ||
          res.access ||
          res.token ||
          res.key ||
          res.access_token ||
          res.accessToken;
      }

      const refreshToken = res.tokens?.refresh || res.refresh;

      if (!accessToken) {
        const registerResponse = result as { type?: string; email?: string };
        if (registerResponse.type === "register" && registerResponse.email) {
          navigate("/register", {
            state: {
              email: registerResponse.email,
            },
          });
          return;
        }

        console.warn("Using Google ID token as access token fallback");
        accessToken = googleToken;
      }

      dispatch(
        setTokens({
          accessToken,
          refreshToken: refreshToken || null,
        }),
      );

      console.log("Extracted Access Token:", accessToken);
      console.log(
        "Extracted Refresh Token:",
        refreshToken || "No refresh token provided",
      );

      const responseWithUser = result as {
        user?: unknown;
        data?: { user?: unknown };
      };

      let userToDispatch = responseWithUser.user;
      if (!userToDispatch && responseWithUser.data?.user) {
        userToDispatch = responseWithUser.data.user;
      }

      if (userToDispatch) {
        dispatch(setUser(userToDispatch as any));
      }

      navigate(from, { replace: true });
    } catch (error) {
      console.error("Google authentication failed:", error);
    }
  };

  const handleGoogleError = () => {
    console.error("Google login failed");
  };

  const GOOGLE_CLIENT_ID =
    import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

  const isConfigured = GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID";

  return (
    <>
      {googleError && (
        <Alert variant="destructive">
          <AlertDescription>{getErrorMessage(googleError)}</AlertDescription>
        </Alert>
      )}
      {!isConfigured && (
        <Alert variant="destructive">
          <AlertDescription>
            Configuration Error: VITE_GOOGLE_CLIENT_ID is missing in .env
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
        />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>
    </>
  );
}
