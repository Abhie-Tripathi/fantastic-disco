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

type SignInData = z.infer<typeof SignInFormSchema>;

export default function SignInForm() {
  const { signin, error, isLoading } = useAuthContext();

  const {
    control,
    handleSubmit,
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
    localStorage.setItem("walkthroughCompleted", JSON.stringify(["research"]));
  }, []);

  return (
    <div className="w-full max-w-md space-y-8 p-8">
      <div className={styles.form_heading}>
        <Image src={logo} alt="logo" width={45} height={55} />
        <Image src={whr} alt="whr" />
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="capitalize flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 self-start" />
            {error.message}
          </AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...field}
                placeholder="Enter your email"
                className="h-11"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
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
        <Link href="/signup" className="text-primary hover:underline">
          Don&apos;t have an account? Sign up
        </Link>
      </div>
    </div>
  );
}
