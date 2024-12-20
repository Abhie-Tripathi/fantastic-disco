"use client";
import React, { useState, FormEvent, useEffect } from "react";
import styles from "@/app/(auth)/signup/page.module.css";
import Image from "next/image";
import Carousel from "@/app/components/carousel";
// import Verification from "@/app/(auth)/verification/page";
import { useAuthContext } from "@/context/auth";
import Link from "next/link";
import { SignUpFormSchema } from "@/types/signup";
import { ZodError } from "zod";
import Visibility from "@/public/visibility.svg";
import VisibilityOff from "@/public/visibilityOff.svg";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
// import logo from "/public/Logo_Light mode.png";
import logo from "/public/croppedlogo.png";
import whr from "/public/whrai.svg";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BaseURL } from "@/config";
import CategorySelector from "../categorySelector";
import IndustryDropdown from "./IndustryDropdown";
import { industryData } from "@/data/onboarding";
import { useFilterContext } from "@/context/filterContext";
import { useFilterState } from "@/hooks/useFilterState";
import { newCategories } from "@/data/categories";
import LocationForm from "@/app/(auth)/location/page";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import HeroLogoText from "/public/heroLogoText.svg";
import { useDatabaseLocationAutocomplete } from "@/hooks/useLocationAutocomplete";
import { SignUpDTO } from "@/types";

type FormData = z.infer<typeof SignUpFormSchema>;

const NewSignUpForm = () => {
  const [showVerification, setShowVerification] = useState(false);
  const { signup, error } = useAuthContext();
  const { getFilterValue, setFilter, deleteFilter } = useFilterState();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [selected, setSelected] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [industry, setIndustry] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(false);
  // const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(SignUpFormSchema),
  });

  useEffect(() => {
    localStorage.removeItem("walkthroughCompleted");
  }, []);

  const onSubmit = async (data: FormData) => {
    const signUpDTOData = {
      ...data,
      ...(categories && categories.length > 0
        ? { categories: categories.join(",") }
        : {}),
    };
    if (!categories || categories.length === 0) {
      delete signUpDTOData.categories;
    }
    try {
      await signup(signUpDTOData);
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  useEffect(() => {
    const isMappedCategory = industryData.find(
      (indust) => indust.slug === industry
    )?.subCategory;
    if (!isMappedCategory) {
      deleteFilter("categories");
    }
  }, [industry]);

  useEffect(() => {
    const eventTypes = getFilterValue("categories").split(",").filter(Boolean);
    const selectedCategories = newCategories
      .filter((category) => eventTypes.includes(category.id))
      .map((category) => category.id);
    setCategories(selectedCategories);
  }, [getFilterValue]);

  const generateOtp = async () => {
    const dataToSend = {
      email: email,
    };
    const url = `${baseUrl}/auth/customer/verify/generate`;
    const { data, error } = await myFetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });
    if (error) {
      console.log(error);
      return;
    }
  };

  const obj = {
    email: email,
    industry: industry,
    categories: categories,
    path: "signup",
  };

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
              <Input id="email" type="email" {...field} placeholder="Email" className="h-11"/>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
          )}
        />
        <Controller
          name="industry"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <IndustryDropdown
                selected={industry}
                setSelected={setIndustry}
                field={field}
              />
            </div>
          )}
        />

        {industryData.find((indust) => indust.slug === industry)
          ?.subCategory && (
          <div className={styles.input_container}>
            <div className={styles.input_title}>Category</div>
            <CategorySelector source="search" />
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing up...
            </>
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>

      <div className="text-center py-2 text-sm">
        Already have an account?
        <Link
          href="/signin"
          className="text-[#6750a4] cursor-pointer font-medium"
        >
          {" "}
          Log In
        </Link>
      </div>

      <div className="text-center text-[#808080] text-[12px]">
        By signing up, you agree to our
        <span className="text-[#6750a4] font-medium ml-1">Terms </span>
        and
        <span className="text-[#6750a4] font-medium ml-1">Privacy Policy</span>
      </div>
    </div>
  );
};

export default NewSignUpForm;
