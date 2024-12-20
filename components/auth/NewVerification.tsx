"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/app/(auth)/verification/page.module.css";
import OtpInput from "react-otp-input";
import Carousel from "@/app/components/carousel";
import VerificationVisuals from "/public/verificationVisuals.svg";
import ArchiveIcon from "/public/archive.svg";
import { usePathname, useRouter } from "next/navigation";
import { baseUrl } from "@/constants";
import { myFetch } from "@/utils/myFetch";
import { useAuthContext } from "@/context";
import logo from "/public/croppedlogo.png";
import whr from "/public/whrai.svg";
import LocationForm from "@/app/(auth)/location/page";
import { VerificationProps } from "@/types/onboarding";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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

const otpSchema = z.object({
  otpCode: z
    .string({ message: "OTP is required" })
    .length(4, "OTP must be 4 digits"),
});

type OTPData = z.infer<typeof otpSchema>;

export default function NewVerificationForm() {
  const router = useRouter();
  const { verifyOtp, verifyLoginOTP, error, generateOTP } = useAuthContext();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const industry = searchParams.get("industry");
  const categories = searchParams.get("categories");
  const flow = searchParams.get("flow");
  const redirectTo =
    flow && flow === "signup"
      ? `/location?industry=${industry}${
          categories ? `&categories=${categories}` : ""
        }`
      : "/";
  const { getFilterValue } = useFilterState();
  const email = getFilterValue("email");

  const form = useForm<OTPData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otpCode: "",
    },
  });

  const onSubmit = async (data: OTPData) => {
    try {
      flow && flow === "signup"
        ? await verifyOtp({ email, otpCode: data.otpCode }, redirectTo)
        : await verifyLoginOTP({ email, otpCode: data.otpCode }, redirectTo);
    } catch (error) {
      console.error("OTP verification error:", error);
    }
  };

  const resendOTP = async () => {
    await generateOTP(email);
  };

  return (
    <div className="flex flex-col gap-8 h-full w-full max-w-md p-8">
      <p
        className="flex items-center gap-1 text-primary cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft width={18} height={18} />
        <span>Back</span>
      </p>
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-[#242424] font-medium text-2xl flex items-center justify-center text-center">
          <Image src={logo} alt="logo" width={45} height={55} />
          <Image src={whr} alt="whr" />
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription className="captilize flex items-center">
              <TriangleAlert
                color="#EF4444"
                className="h-4 w-4 mr-2 self-start"
              />
              <span className="">{error.message}</span>
            </AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <h1 className="text-center font-medium text-sm">Enter your OTP</h1>
            <FormField
              control={form.control}
              name="otpCode"
              render={({ field }) => (
                <FormItem className="flex justify-center flex-col items-center">
                  <FormControl className="w-full flex justify-center">
                    <InputOTP maxLength={4} {...field}>
                      <div className="flex justify-between w-full gap-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                          <InputOTPGroup key={index}>
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className="w-10 h-10 text-xl"
                            />
                          </InputOTPGroup>
                        ))}
                      </div>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
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
        <Button
          variant="link"
          className="w-full"
          onClick={() => {
            resendOTP();
          }}
        >
          Resend OTP
        </Button>
      </div>
    </div>
  );
}
