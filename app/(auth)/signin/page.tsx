"use client";
import React, { useState, FormEvent, useEffect } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import Carousel from "@/app/components/carousel";
import { useAuthContext } from "@/context";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SignInFormSchema, SignInWithOTPSchema } from "@/types";
import { ZodError } from "zod";
import Visibility from "../../../public/visibility.svg";
import VisibilityOff from "../../../public/visibilityOff.svg";
// import logo from "/public/Logo_Light mode.png";
import logo from "/public/croppedlogo.png";
import whr from "/public/whrai.svg";
// import Verification from "../verification/page";
import { showToast } from "@/utils/showToast";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { GAEvent } from "@/utils/GAEvent";

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
    <div className="flex flex-col justify-center items-center w-full space-y-8 h-[80dvh]">
      <p className="font-semibold text-lg leading-6 text-center">
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
                  <AlertDescription className="capitalize flex items-center">
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
