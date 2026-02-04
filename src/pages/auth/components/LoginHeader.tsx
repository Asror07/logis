import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";

export function LoginHeader() {
  return (
    <CardHeader className="space-y-1 text-center">
      <div className="flex justify-center mb-4">
        <div className="p-3 rounded-full bg-primary/10">
          <Truck className="h-8 w-8 text-primary" />
        </div>
      </div>
      <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
      <CardDescription>Sign in to your account to continue</CardDescription>
    </CardHeader>
  );
}
