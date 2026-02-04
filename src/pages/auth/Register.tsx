import { useRegisterMutation } from "@/app/features/auth/auth.api";
import type { RegisterRequest } from "@/app/features/auth/auth.types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { CheckCircle, Eye, EyeOff, Loader2, Truck } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface ApiErrorResponse {
  message?: string;
  detail?: string;
  errors?: Record<string, string[]>;
  [key: string]: unknown;
}

const getErrorMessage = (error: unknown): string => {
  if (!error) return "An unexpected error occurred";

  const fetchError = error as FetchBaseQueryError;

  if (fetchError.status === "FETCH_ERROR") {
    return "Network error. Please check your connection.";
  }

  if (fetchError.status === "PARSING_ERROR") {
    return "Invalid response from server.";
  }

  if (typeof fetchError.status === "number") {
    const data = fetchError.data as ApiErrorResponse | undefined;

    // Handle field-specific validation errors
    if (data?.errors) {
      const messages = Object.entries(data.errors)
        .map(([field, msgs]) => {
          const fieldName = field.replace(/_/g, " ");
          return `${fieldName}: ${msgs.join(", ")}`;
        })
        .join("; ");
      return messages;
    }

    // Handle DRF field errors (flat structure)
    if (data && typeof data === "object") {
      const fieldErrors: string[] = [];
      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value) && key !== "errors") {
          const fieldName = key.replace(/_/g, " ");
          fieldErrors.push(`${fieldName}: ${value.join(", ")}`);
        }
      }
      if (fieldErrors.length > 0) {
        return fieldErrors.join("; ");
      }
    }

    if (data?.detail) return data.detail;
    if (data?.message) return data.message;

    switch (fetchError.status) {
      case 400:
        return "Please check your information and try again.";
      case 409:
        return "An account with this email already exists.";
      case 422:
        return "Validation failed. Please check your inputs.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return `Request failed with status ${fetchError.status}`;
    }
  }

  return "An unexpected error occurred";
};

const initialFormData: RegisterRequest = {
  email: "",
  first_name: "",
  last_name: "",
  phone: "",
  password: "",
  password_confirm: "",
};

export default function Register() {
  const navigate = useNavigate();
  // Pre-fill email from navigation state (e.g. from Google login)
  const location = useLocation();
  const prefilledEmail = (location.state as { email?: string })?.email || "";

  const [register, { isLoading, error }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterRequest>({
    ...initialFormData,
    email: prefilledEmail,
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    if (formData.password !== formData.password_confirm) {
      setValidationError("Passwords do not match");
      return false;
    }

    if (formData.password.length < 8) {
      setValidationError("Password must be at least 8 characters long");
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await register(formData).unwrap();
      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch {
      // Error handled by RTK Query
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user types
    if (validationError) setValidationError(null);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-green-500/10">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold">Registration Successful!</h2>
              <p className="text-muted-foreground">
                Your account has been created. Redirecting to login...
              </p>
              <Link to="/login">
                <Button className="mt-4">Go to Login</Button>
              </Link>
            </div>
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
          <CardTitle className="text-2xl font-bold">
            Create an account
          </CardTitle>
          <CardDescription>
            Enter your information to get started
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {(error || validationError) && (
              <Alert variant="destructive">
                <AlertDescription>
                  {validationError || getErrorMessage(error)}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  placeholder="John"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                  autoComplete="given-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                autoComplete="tel"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirm">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="password_confirm"
                  name="password_confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.password_confirm}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
