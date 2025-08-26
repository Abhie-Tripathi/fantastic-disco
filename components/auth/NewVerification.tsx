"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { isEventeli } from "@/config";
import { useAuthContext } from "@/context";
import { industryData, settingResearchData } from "@/data/onboarding";
import { VerifyOTP } from "@/types/auth/user";
import { SettingsInterestData } from "@/types/onboarding";
import { GAEvent } from "@/utils/GAEvent";
import { zodResolver } from "@hookform/resolvers/zod";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { ArrowLeft, CheckCircle2, Loader2, Lock, TriangleAlert } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "../ui/input";
import { BASE_URL } from "@/config";

const otpSchema = z.object({
  otpCode: z
    .string({ message: "OTP is required" })
    .length(6, "OTP must be 6 digits"),
});

type OTPData = z.infer<typeof otpSchema>;

export default function NewVerificationForm() {
  const router = useRouter();
  const [time, setTime] = useState(30);
  const [showResendOtpMessage, setShowResendOtpMessage] = useState(false);
  const [showAccessRequest, setShowAccessRequest] = useState(false);
  const [isRequestingAccess, setIsRequestingAccess] = useState(false);
  const { verifyOtp, error, signin, setError, isLoading, showOTPMessage } =
    useAuthContext();
  const searchParams = useSearchParams();
  const sessionCategories =
    (sessionStorage && sessionStorage.getItem("categories")) || "";
  const email = (searchParams && searchParams.get("email")) || "";
  const industry = (sessionStorage && sessionStorage.getItem("industry")) || "";
  const flow = (sessionStorage && sessionStorage.getItem("flow")) || "";
  const categories = sessionCategories && JSON.parse(sessionCategories);
  const redirectPath = sessionStorage.getItem("redirect");

  const formatDateForFilter = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  const urlParams = useMemo(() => {
    const params = new URLSearchParams();
    const currentDate = new Date();
    const startDate = formatDateForFilter(startOfMonth(currentDate));
    const endDate = formatDateForFilter(endOfMonth(currentDate));

    params.set("view", "list");
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
      if (isEventeli) {
        return "/location";
      } else {
        const isCategoryMapped = industryData.find(
          (industryItem) => industryItem.slug === industry
        )?.subCategory;
        if (isCategoryMapped) {
          return redirectPath
            ? `/internal/${redirectPath}`
            : `/internal/search/events?${urlParams}`;
        }
      }
    }
    return redirectPath ? `/internal/${redirectPath}` : "/";
  }, [flow, industry]);

  const form = useForm<OTPData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otpCode: "",
    },
  });

  const { clearErrors } = form;

  const handleRequestAccess = async () => {
    setIsRequestingAccess(true);
    try {
      const response = await fetch(`${BASE_URL}/me/account/request-access`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessType: "USER",
          redirectDomain: window.location.origin,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to request access");
      }

      const data = await response.json();
      router.push("/access-requested");
    } catch (error) {
      console.error("Access request error:", error);
      setError({
        message: "Failed to request access. Please try again.",
        statusCode: 500,
        issues: [],
      });
    } finally {
      setIsRequestingAccess(false);
    }
  };

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
        const result = await verifyOtp(
          verifyOtpDTO,
          "signUp",
          redirectTo,
          settingsInterestData
        );
        
        console.log("i am here")
        if (true) {
          setShowAccessRequest(true);
          return;
        }
      } else {
        await verifyOtp(verifyOtpDTO, "signIn", redirectTo);
      }
    } catch (error) {
      console.error("OTP verification error:", error);
    }
  };

  const resendOTP = async (email: string) => {
    setTime(30);
    setShowResendOtpMessage(true);
    await signin({ email });
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
        {!showAccessRequest ? (
          <>
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
                {showOTPMessage && (
                  <p className="text-sm text-center">
                    {showResendOtpMessage
                      ? "A new 6 digit OTP has been resent to your email"
                      : showOTPMessage
                      ? "We have sent a 6 digit OTP to your email"
                      : ""}
                  </p>
                )}

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
          </>
        ) : (
          <div className="flex flex-col space-y-8 w-full max-w-md">
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-center">Access Required</h2>
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Your account needs access approval to continue.
                </p>
                <p className="text-sm text-gray-500">
                  We'll notify you once your access request is approved.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">What happens next?</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Your request will be sent to administrators</li>
                    <li>• You'll receive an email when access is granted</li>
                    <li>• You can then sign in to access the platform</li>
                  </ul>
                </div>
              </div>

              <Button
                onClick={handleRequestAccess}
                disabled={isRequestingAccess}
                className="w-full h-11"
                size="lg"
              >
                {isRequestingAccess ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Requesting Access...
                  </>
                ) : (
                  "Request Access"
                )}
              </Button>

              <Button
                variant="ghost"
                onClick={handleBack}
                className="w-full text-sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Button>
            </div>
          </div>
        )}
        {time === 0 && !showAccessRequest ? (
          <Button
            variant="link"
            className="w-full"
            onClick={() => {
              resendOTP(email);
            }}
          >
            Resend OTP
          </Button>
        ) : !showAccessRequest ? (
          <span className="flex justify-center self-center">
            00 : {time > 9 ? time : `0${time}`}
          </span>
        ) : null}
        {!showAccessRequest && (
          <span className="text-gray-400 text-xs">
            {"Didn't find the OTP? Check your spam box"}
          </span>
        )}
      </div>
    </div>
  );
}
