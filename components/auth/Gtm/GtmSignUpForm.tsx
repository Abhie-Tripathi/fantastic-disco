"use client";
import React, { useState, useEffect } from "react";
import { useAuthContext } from "@/context/auth";
import Link from "next/link";
import { SignUpFormSchema } from "@/types/signup";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
import { industryData, sessionKeys } from "@/data/onboarding";
import { useFilterState } from "@/hooks/useFilterState";
import { newCategories } from "@/data/categories";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import IndustryCards from "./IndustryCards";
import CategoryCards from "./CategoryCards";
import { GAEvent } from "@/utils/GAEvent";

type FormData = z.infer<typeof SignUpFormSchema>;

const GtmSignUpForm = () => {
  const { signup, error, setError } = useAuthContext();
  const { getFilterValue, deleteFilter } = useFilterState();
  const [email, setEmail] = useState("");
  const [industry, setIndustry] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
    sessionKeys.forEach((key) => sessionStorage.removeItem(key));

    const signUpDTOData = {
      ...data,
      industry:
        data.industry ||
        industryData.find((industry) => industry.name === "Others")?.slug ||
        "Others",
      ...(categories.length > 0 && { category: data.categories }),
    };
    delete signUpDTOData.categories;
    const categorySlugs = categories
      .map(
        (category) =>
          newCategories.find((newCategory) => newCategory.id === category)?.slug
      )
      .join(",");

    if (categorySlugs && categorySlugs.length > 0) {
      sessionStorage.setItem("categories", JSON.stringify(categorySlugs));
    }
    if (signUpDTOData && signUpDTOData.industry) {
      sessionStorage.setItem("industry", signUpDTOData.industry);
    }
    if (signUpDTOData && signUpDTOData.email) {
      sessionStorage.setItem("userEmail", signUpDTOData.email);
    }
    sessionStorage.setItem("flow", "signUp");

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

  useEffect(() => {
    if (
      errors.email?.message &&
      errors.email?.message === "Email is required" &&
      errors.email.type === "invalid_type"
    ) {
      GAEvent("Onboarding", "Onboarding", "Sign Up", "Sign Up | Email Empty");
    }
  }, [errors.email?.message]);

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
    GAEvent(
      "Onboarding",
      "Onboarding",
      "Sign Up",
      "Sign Up | Use Case Selected"
    );
  };

  const handleCategories = (categoryId: string) => {
    setCategories((prev) => {
      const updatedSet = new Set(prev);
      if (updatedSet.has(categoryId)) {
        updatedSet.delete(categoryId);
        GAEvent(
          "Onboarding",
          "Onboarding",
          "Sign Up",
          "Sign Up | Category Deselected"
        );
      } else {
        updatedSet.add(categoryId);
        GAEvent(
          "Onboarding",
          "Onboarding",
          "Sign Up",
          "Sign Up | Category Selected"
        );
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
                className="rounded-sm bg-white ring-1
                ring-primary outline outline-[#D2D2F3] outline-offset-2
                focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-[3px] focus-visible:outline-[#D2D2F3] focus-visible:outline-offset-2"
                id="email"
                type="email"
                {...field}
                placeholder="Email"
                value={field.value || ""}
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
        <p className="text-[var(--secondary-text-color)] text-sm text-center font-semibold">
          Choose an Industry Relevant to You
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
          onClick={() => clearErrors()}
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
    </div>
  );
};

export default GtmSignUpForm;
