"use client";
import { LoadingPage } from "@/components/auth/loadingPage";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/context";
import { getValidPath } from "@/lib/utils";
import { SignInFormSchema } from "@/types";
import { GAEvent } from "@/utils/GAEvent";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import GoogleIcon from "/public/google.svg";
import LinkedinIcon from "/public/linkedin.svg";
import { signIn, useSession } from "next-auth/react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isEventeli } from "@/config";
import logo from "/public/croppedlogo.png";
import whr from "/public/whrai.svg";

type SignInData = z.infer<typeof SignInFormSchema>;

export default function SignInForm() {
  const params = useSearchParams();
  const redirectParams = params.get("redirect");
  const redirectPath = redirectParams ? getValidPath(redirectParams) : null;
  const router = useRouter();
  const { signin, error, isLoading, setError, signInSSO, isAuthenticating } =
  useAuthContext();
  const { data: session, status } = useSession();

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
    if (redirectPath) sessionStorage.setItem("redirect", redirectPath);
  }, [redirectPath]);

  useEffect(() => {
    if (
      errors.email?.message &&
      errors.email?.message === "Email is required" &&
      errors.email.type === "invalid_type"
    ) {
      GAEvent("Onboarding", "Onboarding", "Sign In", "Sign In | Email Empty");
    }
  }, [errors.email?.message]);

  useEffect(() => {
    if (status === "authenticated") {
      signInSSO();
    }
  }, [status, session]);

  if (isAuthenticating) {
    return <LoadingPage />;
  }

  return (
    <div>

<div className="flex text-[var(--sidebar-active)] items-center justify-center text-center font-medium text-2xl mb-6 ">
              <Image src={logo} alt="logo" width={45} height={55} />
              <Image src={whr} alt="whr" />
            </div>



    <div className="flex flex-col justify-center items-center w-full space-y-4">

      <p className="font-semibold  md:text-lg leading-6 text-center mb-3">
        Login to your account
      </p>
      <div className="flex gap-4 w-full sm:w-[312px] mx-auto justify-center">
        <Button
          onClick={() => signIn("google")}
          variant={"outline"}
          className="flex items-center h-11 w-auto gap-3 px-8"
        >
          <Image src={GoogleIcon} alt="Google Icon" className="w-5 h-5" />
          <span>Google</span>
        </Button>
        <Button
          onClick={() => signIn("linkedin")}
          variant={"outline"}
          className="flex items-center h-11 w-auto gap-3 px-8"
        >
          <Image src={LinkedinIcon} alt="Google Icon" className="w-5 h-5" />
          <span>LinkedIn</span>
        </Button>
      </div>
      <p className="text-xs text-[var(--tertiary-text-color)]">OR</p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-6 w-full"
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <div className="space-y-2 w-full max-w-[312px] self-center">
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
          className="w-full max-w-[312px] self-center"
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
      <div className="text-center text-sm">
      Don&apos;t have an account? 
            <Link
          href="/signup"
          className="text-primary hover:underline"
          onClick={() =>
            GAEvent("Onboarding", "Onboarding", "Sign In", "Sign Up")
          }
        >
              {" "}
              Sign up
            </Link>
          </div>
    </div>
    </div>

  );
}
