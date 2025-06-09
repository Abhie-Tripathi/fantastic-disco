"use client";

import { LoadingPage } from "@/components/auth/loadingPage";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/context/auth";
import { sessionKeys } from "@/data/onboarding";
import { industryData } from "@/data/onboardingDropdownsData";
import { useToast } from "@/hooks/use-toast";
import { getValidPath } from "@/lib/utils";
import { SignUpDTO } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Loader2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import IndustryCards from "./IndustryCards";

const signUpSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email address"),
  industry: z
    .string({ message: "Industry is required" })
    .min(1, "Industry is required"),
  subIndustry: z.string({ message: "Industry is required" }).optional(),
});

type FormData = z.infer<typeof signUpSchema>;

export default function TeliSignUpForm() {
  const params = useSearchParams();
  const redirectParams = params.get("redirect");
  const redirectPath = redirectParams ? getValidPath(redirectParams) : null;
  const {
    isLoading,
    signup,
    error,
    user,
    setError,
    updateIndustry,
    isAuthenticating,
    userAuthenticated,
    signInSSO,
  } = useAuthContext();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [industry, setIndustry] = useState("");
  const [subIndustry, setSubIndustry] = useState("");
  const selectedIndustry = industryData.find((item) => item.slug === industry);
  const hasSubIndustries =
    selectedIndustry &&
    selectedIndustry.subIndustries &&
    selectedIndustry?.subIndustries?.length > 0;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
  });

  const signUpFlow =
    user && user?.isNewUser && (status === "authenticated" || userAuthenticated)
      ? "sso"
      : "default";

  useEffect(() => {
    if (status === "authenticated") {
      signInSSO();
    }
  }, [status, session]);

  useEffect(() => {
    if (user && user.isNewUser && !isAuthenticating) {
      setValue("email", user.email || "");
      toast({
        description: "Please select your industry",
        variant: "default",
      });
    }
  }, [user]);

  useEffect(() => {
    if (redirectPath) sessionStorage.setItem("redirect", redirectPath);
  }, [redirectPath]);

  const onSubmit = async (data: FormData) => {
    sessionKeys.forEach((key) => sessionStorage.removeItem(key));

    try {
      const cleanedData = { ...data };
      if (
        cleanedData.industry === cleanedData.subIndustry ||
        cleanedData.subIndustry === ""
      ) {
        delete cleanedData.subIndustry;
      }
      const signUpData: SignUpDTO = {
        ...cleanedData,
      };

      if (signUpData && signUpData.industry) {
        sessionStorage.setItem("industry", signUpData.industry);
      }

      if (signUpData && signUpData.subIndustry) {
        sessionStorage.setItem("subIndustry", signUpData.subIndustry);
      }

      sessionStorage.setItem("flow", "signUp");
      redirectParams && sessionStorage.setItem("redirect", redirectParams);
      if (signUpFlow === "sso") {
        await updateIndustry(signUpData);
      } else {
        await signup(signUpData);
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const handleIndustry = (industry: string) => {
    setValue("industry", industry);
    setIndustry(industry);
  };
  const handleSubIndustry = (subIndustry: string) => {
    setValue("subIndustry", subIndustry);
    setSubIndustry(subIndustry);
  };

  const handleBackButton = () => {
    setIndustry("");
    setSubIndustry("");
    setValue("industry", "");
    setValue("subIndustry", "");
  };

  if (isAuthenticating) {
    return <LoadingPage />;
  }

  return (
    <div className="flex flex-col justify-center items-center w-full space-y-4">
      {signUpFlow === "default" && (
        <>
          <p className="font-semibold text-lg leading-6 text-center mb-5">
            Create your account
          </p>
          {/* {status === "unauthenticated" && (
            <>
              <div className="flex gap-4 w-full sm:w-96 mx-auto mt-6 justify-center">
                <Button
                  onClick={() => signIn("google")}
                  variant={"outline"}
                  className="flex items-center h-11 w-auto gap-3 px-8"
                >
                  <Image
                    src={GoogleIcon}
                    alt="Google Icon"
                    className="w-5 h-5"
                  />
                  <span>Google</span>
                </Button>
                <Button
                  onClick={() => signIn("linkedin")}
                  variant={"outline"}
                  className="flex items-center h-11 w-auto gap-3 px-8"
                >
                  <Image
                    src={LinkedinIcon}
                    alt="Google Icon"
                    className="w-5 h-5"
                  />
                  <span>LinkedIn</span>
                </Button>
              </div>
              <p className="text-sm mt-4 text-[var(--tertiary-text-color)]">
                OR
              </p>
            </>
          )} */}
        </>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-6 w-full"
      >
        {signUpFlow === "default" && (
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <div className="space-y-2 w-auto sm:w-96 max-w-3xl self-center border-b pb-6">
                <Input
                  className="rounded-sm bg-white ring-1
                  ring-primary outline outline-[#D2D2F3] outline-offset-2
                  focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:outline-[3px]
                focus-visible:outline-[#D2D2F3] focus-visible:outline-offset-2 "
                  id="email"
                  type="email"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setError(null);
                  }}
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
                {error && (
                  <Alert
                    variant="destructive"
                    className="w-fit self-center border-none p-0"
                  >
                    <AlertDescription className="capitalize flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      {error.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          />
        )}
        {!hasSubIndustries && (
          <p className="text-[var(--secondary-text-color)] text-sm text-center font-semibold">
            Choose an Industry Relevant to You
          </p>
        )}
        <Controller
          name={hasSubIndustries ? "subIndustry" : "industry"}
          control={control}
          render={({ field }) => (
            <>
              <IndustryCards
                hasSubIndustries={hasSubIndustries}
                selectedIndustry={selectedIndustry}
                activeIndustry={industry}
                activeSubIndustry={subIndustry}
                handleIndustry={handleIndustry}
                handleSubIndustry={handleSubIndustry}
                handleBackButton={handleBackButton}
              />
              {errors.industry && (
                <p className="text-red-500 text-sm text-center">
                  {errors.industry.message}
                </p>
              )}
            </>
          )}
        />

        <hr className="w-full sm:w-96 mt-6 self-center" />

        <Button
          type="submit"
          className="w-40 sm:w-80 self-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing up...
            </>
          ) : signUpFlow === "default" ? (
            "Sign Up"
          ) : (
            "Submit"
          )}
        </Button>
      </form>

      {signUpFlow === "default" && (
        <>
          <div className="text-center py-2 text-sm">
            Already have an account?
            <Link
              onClick={() => signOut({ callbackUrl: "/signin" })}
              href="/signin"
              className="text-[#6750a4] cursor-pointer font-medium"
            >
              {" "}
              Log In
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-center text-[#808080] text-[12px]">
              By signing up, you agree to our
              <Link
                target="_blank"
                href={"https://10times.com/terms-of-service"}
                className="text-[#6750a4] font-medium ml-1"
              >
                Terms{" "}
              </Link>
              and
              <Link
                target="_blank"
                href={"https://10times.com/privacy-policy"}
                className="text-[#6750a4] font-medium ml-1"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
