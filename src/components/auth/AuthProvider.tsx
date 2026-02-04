import { logout, setAccessToken } from "@/app/features/auth/authSlice";
import { useAppDispatch } from "@/app/hooks";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

      // ✅ If we have access token, sync to Redux
      if (accessToken) {
        dispatch(setAccessToken(accessToken));
        setIsChecking(false);
        return;
      }

      // If only refresh token exists, try to get new access token
      if (refreshToken) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/users/token/refresh/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh: refreshToken }),
            },
          );

          if (response.ok) {
            const data = await response.json();
            dispatch(setAccessToken(data.access));
          } else {
            dispatch(logout());
          }
        } catch {
          dispatch(logout());
        }
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [dispatch]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
