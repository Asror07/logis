import { CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";

export function LoginFooter() {
  return (
    <CardFooter className="flex flex-col space-y-4">
      <p className="text-sm text-center text-muted-foreground">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-primary hover:underline font-medium"
        >
          Create account
        </Link>
      </p>
    </CardFooter>
  );
}
