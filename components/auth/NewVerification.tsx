"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Loader2, TriangleAlert } from "lucide-react";
import { useFilterState } from "@/hooks/useFilterState";
import { useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { industryData, settingResearchData } from "@/data/onboarding";
import { endOfMonth, startOfMonth } from "date-fns";
import { GAEvent } from "@/utils/GAEvent";
import { VerifyOTP } from "@/types/auth/user";
import { SettingsInterestData } from "@/types/onboarding";

const otpSchema = z.object({
  otpCode: z
    .string({ message: "OTP is required" })
    .length(6, "OTP must be 6 digits"),
});

type OTPData = z.infer<typeof otpSchema>;

export default function NewVerificationForm() {
  const router = useRouter();
  const [time, setTime] = useState(30);
  const [resendLoading, setResendLoading] = useState(false);
  const { verifyOtp, verifyLoginOTP, error, generateOTP, signin, setError } =
    useAuthContext();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { getFilterValue } = useFilterState();
  const sessionCategories =
    (sessionStorage && sessionStorage.getItem("categories")) || "";
  const email = (sessionStorage && sessionStorage.getItem("userEmail")) || "";
  const industry = (sessionStorage && sessionStorage.getItem("industry")) || "";
  const flow = (sessionStorage && sessionStorage.getItem("flow")) || "";

  const categories = sessionCategories && JSON.parse(sessionCategories);

  const urlParams = useMemo(() => {
    const params = new URLSearchParams();
    const currentDate = new Date();
    const startDate = new Date(
      startOfMonth(currentDate).setHours(5, 30, 0, 0)
    ).toISOString();
    const endDate = new Date(
      endOfMonth(currentDate).setHours(5, 30, 0, 0)
    ).toISOString();

    params.set("view", "map");
    params.set("status", "active,cancelled,postponed");
    params.set("active_gte", startDate);
    params.set("active_lte", endDate);
    params.set("locationIds", "e3ef02ad-2f97-5fa6-9033-9addfad3f0ef");

    if (categories && categories.length > 0) {
      params.set("categories", categories);
    }
    return params;
  }, [categories]);

  const redirectTo = useMemo(() => {
    if (flow && flow === "signUp") {
      const isCategoryMapped = industryData.find(
        (industryItem) => industryItem.slug === industry
      )?.subCategory;
      if (isCategoryMapped) {
        return `/internal/search/events?${urlParams}`;
      }
    }
    return "/";
  }, [flow, industry]);

  const form = useForm<OTPData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otpCode: "",
    },
  });

  const { clearErrors } = form;

  const onSubmit = async (data: OTPData) => {
    try {
      time === 0 && setTime(30);
      const verifyOtpDTO: VerifyOTP = {
        email,
        otp: data.otpCode,
      };
      if (flow && flow === "signUp") {
        const mappedSettingResearch =
          industryData.find((data) => data.slug === industry)
            ?.mappedSettingResearch || settingResearchData;
        const settingsInterestData: SettingsInterestData = {
          data: mappedSettingResearch,
          source: "interest",
        };
        await verifyOtp(
          verifyOtpDTO,
          "signUp",
          redirectTo,
          settingsInterestData
        );
      } else {
        await verifyOtp(verifyOtpDTO, "signIn", redirectTo);
        // await verifyLoginOTP({ email, otpCode: data.otpCode }, redirectTo);
      }
    } catch (error) {
      console.error("OTP verification error:", error);
    }
  };

  const resendOTP = async (email: string) => {
    setTime(30);
    await signin({ email });
    // generateOTP(email, industry, categories, flow, "resend");
  };

  const handleBack = () => {
    if (flow === "signup") {
      GAEvent("Onboarding", "Onboarding", "Sign Up", "Verify OTP | Back");
    } else GAEvent("Onboarding", "Onboarding", "Sign In", "Verify OTP | Back");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("industry");
    sessionStorage.removeItem("categories");
    router.back();
  };
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (time > 0) {
      timer = setTimeout(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else {
      clearTimeout(timer!);
    }
    return () => clearTimeout(timer!);
  }, [time]);

  return (
    <div className="flex flex-col gap-24 h-full w-full mx-0 sm:w-fit sm:mx-auto p-8">
      <div className="flex flex-col justify-center items-center w-full space-y-8">
        <p className="font-semibold text-lg leading-6 text-center">
          Create your account
        </p>
        <div className="space-y-2 w-full sm:w-96 max-w-3xl self-center border-b pb-6">
          <Input
            id="email"
            type="email"
            value={email}
            disabled
            placeholder="Email"
          />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-6 w-full"
          >
            <p
              className="flex items-center gap-1 text-primary cursor-pointer"
              onClick={handleBack}
            >
              <ArrowLeft width={18} height={18} />
              <span>Back</span>
            </p>
            <h1 className="text-center font-medium text-sm">Enter your OTP</h1>
            <FormField
              control={form.control}
              name="otpCode"
              render={({ field }) => (
                <FormItem className="flex justify-center flex-col items-center">
                  <FormControl className="w-full flex justify-center">
                    <InputOTP
                      maxLength={6}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setError(null);
                      }}
                    >
                      <div className="flex justify-between w-full gap-4">
                        {Array.from({ length: 6 }).map((_, index) => (
                          <InputOTPGroup key={index}>
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className="w-8 sm:w-10 h-8 sm:h-10 text-sm sm:text-xl"
                            />
                          </InputOTPGroup>
                        ))}
                      </div>
                    </InputOTP>
                  </FormControl>
                  <FormMessage className="!mt-6" />
                </FormItem>
              )}
            />
            {error && (
              <Alert
                variant="destructive"
                className="w-fit border-none self-center p-0"
              >
                <AlertDescription className="captilize flex items-start">
                  <TriangleAlert color="#EF4444" className="w-4 h-4" />
                  <span className="ml-2">{error.message}</span>
                </AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full sm:w-80 self-center"
              disabled={isLoading}
              onClick={() => clearErrors}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>
          </form>
        </Form>
        {time === 0 ? (
          <Button
            variant="link"
            className="w-full"
            onClick={() => {
              resendOTP(email);
            }}
          >
            Resend OTP
          </Button>
        ) : (
          <span className="flex justify-center self-center">
            00 : {time > 9 ? time : `0${time}`}
          </span>
        )}
      </div>
    </div>
  );
}
