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
import { Loader2, TriangleAlert } from "lucide-react";
import { useFilterState } from "@/hooks/useFilterState";
import { useSearchParams } from "next/navigation";

const otpSchema = z.object({
  otpCode: z
    .string({ message: "OTP is required" })
    .length(4, "OTP must be 4 digits"),
});

type OTPData = z.infer<typeof otpSchema>;

export default function NewVerificationForm() {
  const { verifyOtp, verifyLoginOTP, error } = useAuthContext();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const industry = searchParams.get("industry");
  const subIndustry = searchParams.get("subIndustry");
  const flow = searchParams.get("flow");
  const redirectTo =
    flow && flow === "signup"
      ? `/location?industry=${industry}${
          subIndustry ? `&subIndustry=${subIndustry}` : ""
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

  return (
    <div className="w-full max-w-sm space-y-8 p-8">
      <div className="text-[#242424] font-medium text-2xl flex items-center justify-center text-center">
        <Image src={logo} alt="logo" width={45} height={55} />
        <Image src={whr} alt="whr" />
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="captilize flex items-center">
            <TriangleAlert color="#EF4444" className="w-4 h-4" />
            <span className="ml-2">{error.message}</span>
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
          console.log("Resend OTP clicked");
        }}
      >
        Resend OTP
      </Button>
    </div>
  );
}
