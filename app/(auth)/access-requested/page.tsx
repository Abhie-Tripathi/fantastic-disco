"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default function AccessRequestedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-6 max-w-md">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
        <h1 className="text-2xl font-semibold">Access Requested</h1>
        <p className="text-gray-600">
          Your access request has been sent to the administrators. They will review your request and get back to you soon.
        </p>
        <Button
          onClick={() => router.push("/signin")}
          className="mt-4"
        >
          Return to Sign In
        </Button>
      </div>
    </div>
  );
} 