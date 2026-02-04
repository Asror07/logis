import { Card, CardContent } from "@/components/ui/card";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLoginSection } from "./components/GoogleLoginSection";
import { LoginFooter } from "./components/LoginFooter";
import { LoginForm } from "./components/LoginForm";
import { LoginHeader } from "./components/LoginHeader";

export default function Login() {
  // Replace with your actual Google Client ID from Google Cloud Console
  const GOOGLE_CLIENT_ID =
    import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        {/* Background gradient */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-30"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 0%, hsl(0 99% 64% / 0.3) 0%, transparent 70%)",
            }}
          />
        </div>

        <Card className="w-full max-w-md relative">
          <LoginHeader />

          <CardContent className="space-y-4">
            <GoogleLoginSection />
            <LoginForm />
          </CardContent>

          <LoginFooter />
        </Card>
      </div>
    </GoogleOAuthProvider>
  );
}
