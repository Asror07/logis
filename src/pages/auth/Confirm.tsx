import {
  useResendCodeMutation,
  useVerifyCodeMutation,
} from "@/app/features/auth/auth.api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Confirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [verifyCode, { isLoading: isVerifyLoading, error }] =
    useVerifyCodeMutation();
  const [resendCode, { isLoading: isResendLoading }] = useResendCodeMutation();

  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(125); // 2:05 minutes in seconds

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleResendCode = async () => {
    if (!email) return;
    try {
      await resendCode({ email }).unwrap();
      toast.success("Code resent successfully");
      setTimeLeft(125); // Reset timer
    } catch {
      toast.error("Failed to resend code");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      console.error("Email is missing");
      return;
    }

    try {
      await verifyCode({
        email,
        code: parseInt(code),
        type: "login",
      }).unwrap();

      // Tokens are saved automatically by the mutation's onQueryStarted
      navigate("/analytics", { replace: true });
    } catch {
      // Error is handled by RTK Query's error state
    }
  };

  const getErrorMessage = (error: unknown): string => {
    if (!error) return "An unexpected error occurred";
    const err = error as { data?: { detail?: string; message?: string } };
    if (err.data?.detail) return err.data.detail;
    if (err.data?.message) return err.data.message;
    return "Invalid verification code. Please try again.";
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              Email not found. Please log in again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/login")}>Back to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
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
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Truck className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Verification</CardTitle>
          <CardDescription>Enter the code sent to {email}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{getErrorMessage(error)}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={(value) => setCode(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isVerifyLoading || code.length < 6}
            >
              {isVerifyLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>

            <div className="text-center space-y-2">
              <div className="text-sm text-muted-foreground">
                Didn't receive code?{" "}
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={timeLeft > 0 || isResendLoading}
                  className="font-medium text-primary hover:underline disabled:text-muted-foreground disabled:no-underline disabled:cursor-not-allowed"
                >
                  {timeLeft > 0
                    ? `Resend in ${formatTime(timeLeft)}`
                    : isResendLoading
                      ? "Sending..."
                      : "Resend Code"}
                </button>
              </div>

              <div>
                <Button
                  variant="link"
                  onClick={() => navigate("/login")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
