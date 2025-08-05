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
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import IndustryCards from "./IndustryCards";
import GoogleIcon from "/public/google.svg";
import LinkedinIcon from "/public/linkedin.svg";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isEventeli } from "@/config";
import logo from "/public/croppedlogo.png";
import whr from "/public/whrai.svg";

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
    clearErrors,
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
  }, [user, isAuthenticating]);

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
    clearErrors("industry");
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
    <div className="flex flex-col justify-center items-center w-full space-y-2">
      <div className="flex text-[var(--sidebar-active)] items-center justify-center text-center font-medium text-2xl mb-6 ">
              <Image src={logo} alt="logo" width={45} height={55} />
              <Image src={whr} alt="whr" />
            </div>
      {signUpFlow === "default" && (
        <>
          <p className="font-semibold text-lg leading-6 text-center mb-5">
            Create your account
          </p>
          {status === "unauthenticated" && (
            <>
              <div className="flex gap-4 w-full sm:w-[312px] mx-auto justify-center">
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
              <p className="text-xs mt-2 text-[var(--tertiary-text-color)]">
                OR
              </p>
            </>
          )}
        </>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-3 w-full"
      >
        {signUpFlow === "default" && (
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <div className="space-y-2 w-full max-w-[312px] self-center">
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
          <p className="text-[var(--secondary-text-color)] text-center font-semibold">
            Select the primary focus of your business.
          </p>
        )}

        {/* Tablist for Industry Insights and Location Insights */}
        <div className="flex w-full justify-center mb-4">
          <div className="w-fit">
            <Tabs defaultValue={isEventeli ? "location" : "industry"} className="w-full">
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

        <Button
          type="submit"
          className="w-full max-w-[312px] self-center"
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
          <div className="text-center pb-3 text-sm">
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
            <div className="text-center text-[#808080] text-[12px] mt-[-16px]">
              By signing up, you agree to our
              <Link
                target="_blank"
                href={"https://whr.ai/terms-of-service"}
                className="text-[#6750a4] font-medium ml-1"
              >
                Terms{" "}
              </Link>
              and
              <Link
                target="_blank"
                href={"https://whr.ai/privacy-policy"}
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
