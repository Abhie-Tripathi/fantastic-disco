"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/context";
import { SignInFormSchema } from "@/types";
import { GAEvent } from "@/utils/GAEvent";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

type SignInData = z.infer<typeof SignInFormSchema>;

export default function SignInForm() {
  const { signin, error, isLoading, setError } = useAuthContext();

  const {
    control,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<SignInData>({
    resolver: zodResolver(SignInFormSchema),
  });

  const onSubmit = async (data: SignInData) => {
    try {
      sessionStorage.setItem("flow", "signIn");
      await signin(data);
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  useEffect(() => {
    if (
      errors.email?.message &&
      errors.email?.message === "Email is required" &&
      errors.email.type === "invalid_type"
    ) {
      GAEvent("Onboarding", "Onboarding", "Sign In", "Sign In | Email Empty");
    }
  }, [errors.email?.message]);

  return (
    <div className="flex flex-col justify-center items-center w-full space-y-4 h-[80dvh]">
      <p className="font-semibold text-lg leading-6 text-center mb-5">
        Login to your account
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-6 w-full"
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <div className="space-y-2 w-96 max-w-3xl self-center">
              <Input
                className="rounded-sm bg-white ring-1
               ring-primary outline outline-[#D2D2F3] outline-offset-2
               focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-[3px] focus-visible:outline-[#D2D2F3] focus-visible:outline-offset-2"
                id="email"
                type="email"
                {...field}
                placeholder="Email"
                value={field.value || ""}
                onChange={(e) => {
                  field.onChange(e);
                  setError(null);
                }}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
              {error && (
                <Alert variant="destructive" className="w-fit p-0 border-none">
                  <AlertDescription className="capitalize flex items-start">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    {error.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        />
        <Button
          type="submit"
          className="w-80 self-center"
          disabled={isLoading}
          onClick={() => clearErrors()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
      <div className="text-center">
        <Link
          href="/signup"
          className="text-primary hover:underline"
          onClick={() =>
            GAEvent("Onboarding", "Onboarding", "Sign In", "Sign Up")
          }
        >
          Don&apos;t have an account? Sign up
        </Link>
      </div>
    </div>
  );
}
