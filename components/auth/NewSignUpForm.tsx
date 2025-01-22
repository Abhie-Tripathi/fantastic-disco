"use client";
import React, {
  useState,
  FormEvent,
  useEffect,
  useCallback,
  useRef,
} from "react";
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
import { useDatabaseLocationcomplete } from "@/hooks/useLocationAutocomplete";
import { SignUpDTO } from "@/types";
import IndustryCards from "./IndustryCards";
import CategoryCards from "./CategoryCards";
import { Category } from "@/types/events";

type FormData = z.infer<typeof SignUpFormSchema>;

const NewSignUpForm = () => {
  const [showVerification, setShowVerification] = useState(false);
  const { signup, error, setError } = useAuthContext();
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
  const set = new Set<string>();
  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(SignUpFormSchema),
  });

  const onSubmit = async (data: FormData) => {
    const signUpDTOData = {
      ...data,
      industry: data.industry || "others",
      ...(categories.length > 0 && { categories: data.categories }),
    };
    const categorySlugs = categories
      .map(
        (category) =>
          newCategories.find((newCategory) => newCategory.id === category)?.slug
      )
      .join(",");

    if (categorySlugs && categorySlugs.length > 0) {
      sessionStorage.setItem("categories", JSON.stringify(categorySlugs));
    } else {
      sessionStorage.removeItem("categories");
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

  useEffect(() => {
    if (categories.length === 0) {
      sessionStorage.removeItem("categories");
    }
  }, [categories]);

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

  const isCategoryMapped = industryData.find(
    (industryItem) => industryItem.slug === industry
  )?.subCategory;

  const obj = {
    email: email,
    industry: industry,
    categories: categories,
    path: "signup",
  };

  const handleIndustry = (industry: string) => {
    setValue("industry", industry);
    setIndustry(industry);
  };

  const handleCategories = (categoryId: string) => {
    setCategories((prev) => {
      const updatedSet = new Set(prev);
      if (updatedSet.has(categoryId)) {
        updatedSet.delete(categoryId);
      } else {
        updatedSet.add(categoryId);
      }
      const updatedCategoriesArray = Array.from(updatedSet);
      const updatedCategoriesString = updatedCategoriesArray.join(",");
      setValue("categories", updatedCategoriesString);
      return updatedCategoriesArray;
    });
  };

  return (
    <div className="flex flex-col justify-center items-center w-full space-y-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-6 w-full"
      >
        <p className="font-semibold text-lg leading-6 text-center">
          Create your account
        </p>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <div className="space-y-2 w-96 max-w-3xl self-center border-b pb-6">
              <Input
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
        <p className="text-[var(--secondary-text-color)] text-center font-semibold">
          Let us know who you are and help us personalise your experience !
        </p>
        <Controller
          name={"industry"}
          control={control}
          render={({ field }) => (
            <>
              <IndustryCards
                activeIndustry={industry}
                handleIndustry={handleIndustry}
              />
            </>
          )}
        />
        {isCategoryMapped && (
          <Controller
            name={"industry"}
            control={control}
            render={({ field }) => (
              <>
                <CategoryCards
                  activeCategories={categories}
                  handleCategories={handleCategories}
                />
              </>
            )}
          />
        )}

        <hr className="w-full sm:w-96 mt-6 self-center" />

        <Button
          type="submit"
          className="w-80 self-center"
          disabled={isLoading}
          onClick={() => clearErrors}
        >
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
    </div>
  );
};

export default NewSignUpForm;
