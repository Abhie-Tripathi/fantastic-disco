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
    <div className="flex flex-col justify-center items-center w-full space-y-4 h-[80dvh]">

    {/* Tablist for Industry Insights and Location Insights */}
    <div className="flex w-full justify-center mb-4">
          <div className="w-fit">
            <Tabs defaultValue="location" className="w-full">
              <TabsList className="bg-[#F5F5FA] rounded-md h-14 flex flex-row p-2 gap-2">
                <Link
                  href={`${process.env.NEXT_PUBLIC_GTM_FRONTEND_URL}/signup`}
                >
                  <TabsTrigger
                    value="industry"
                    className="font-semibold px-4 py-2 rounded-md transition-colors duration-200 border-2 border-transparent data-[state=active]:border-[#6750A4] data-[state=active]:text-[#6750A4] data-[state=active]:bg-white data-[state=inactive]:text-[#666]"
                  >
                    Industry Insights
                  </TabsTrigger>
                </Link>
                <Link
                  href={`${process.env.NEXT_PUBLIC_GEO_FRONTEND_URL}/signup`}
                >
                  <TabsTrigger
                    value="location"
                    className="font-semibold px-4 py-2 rounded-md transition-colors duration-200 border-2 border-transparent data-[state=active]:border-[#6750A4] data-[state=active]:text-[#6750A4] data-[state=active]:bg-white data-[state=inactive]:text-[#666]"
                  >
                    Location Insights
                  </TabsTrigger>
                </Link>
              </TabsList>
            </Tabs>
          </div>
        </div>

      <p className="font-semibold  md:text-lg leading-6 text-center mb-3">
        Login to your account
      </p>
      <div className="flex gap-4 w-full sm:w-96 mx-auto mt-6 justify-center">
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
      <p className="text-sm text-[var(--tertiary-text-color)]">OR</p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-6 w-full"
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <div className="space-y-2 w-full max-w-96 self-center">
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
          className="w-40 sm:w-80 self-center"
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
