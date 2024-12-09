"use client";
import React, { useState, FormEvent, useEffect } from "react";
import styles from "@/app/(auth)/signup/page.module.css";
import Image from "next/image";
import Carousel from "@/app/components/carousel";
import Verification from "@/app/(auth)/verification/page";
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
const NewSignUpForm = () => {
  const [showVerification, setShowVerification] = useState(false);
  const { signup } = useAuthContext();
  const { getFilterValue, setFilter } = useFilterState();

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const eventTypes = getFilterValue("categories").split(",").filter(Boolean);
    const selectedCategories = newCategories
      .filter((category) => eventTypes.includes(category.id))
      .map((category) => category.slug);
    setCategories(selectedCategories);
  }, [getFilterValue]);

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowVerification(true);
    // const formData: any = {
    //   email,
    //   industry,
    //   categories,
    // };
    // if (mobileNo.length > 0) {
    //   formData.mobileNo = mobileNo;
    // }

    // try {
    //   SignUpFormSchema.parse(formData);
    //   setErrors({});
    //   if (password.includes(" ")) {
    //     setErrors({ password: "Password must not contains spaces" });
    //     return;
    //   }
    //   if (password.trim().length < 8) {
    //     setErrors({ password: "Passoword should be atleast 8 characters" });
    //     return;
    //   }
    //   if (password !== confirmPassword) {
    //     setErrors({ confirmPassword: "Passwords do not match. Try again" });
    //     return;
    //   }
    //   if (name.split(" ")[1] === undefined || name.split(" ")[1].length === 0) {
    //     setErrors({ name: "Please Enter Full Name" });
    //     return;
    //   }
    //   if (mobileNo.length > 10 || mobileNo.startsWith("+")) {
    //     setErrors({ mobileNo: "Enter 10 digit mobile number only" });
    //     return;
    //   }

    //   setIsLoading(true);

    //   const response = await signup({
    //     firstname: name.split(" ")[0],
    //     lastname: name.split(" ")[1] === undefined ? " " : name.split(" ")[1],
    //     email,
    //     password,
    //     ...(mobileNo.length > 0 ? { phoneNumber: mobileNo } : {}),
    //   });
    //   setIsLoading(false);
    //   console.log("Response", response);

    //   if (!response[0]?.error) {
    //     generateOtp();
    //     setShowVerification(true);
    //   } else {
    //     if (response[0].error.message === "Email already exists")
    //       setErrors({ email: response[0].error.message });
    //     else if (response[0].error.message === "Phone number already exist")
    //       setErrors({ mobileNo: response[0].error.message });
    //     else if (response[0].error.message === "email not accepted")
    //       setErrors({ email: response[0].error.message });
    //     else setErrors({ otherError: response[0].error.message });
    //   }
    // } catch (error) {
    //   if (error instanceof ZodError) {
    //     const validationErrors: Record<string, string> = {};
    //     error.errors.forEach((err) => {
    //       if (err.path) {
    //         validationErrors[err.path.join(".")] = err.message;
    //       }
    //     });
    //     setErrors(validationErrors);
    //   } else {
    //     console.error("An unexpected error occurred:", error);
    //   }
    // }
  };

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
    if (data) console.log(data);
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
    <div className={styles.container}>
      {!showVerification && (
        <div className={styles.sub_container}>
          <div className={styles.sub_containerLeft}>
            <Carousel />
          </div>
          <form onSubmit={handleSignUp} className={styles.formContainer}>
            <div className={styles.form_container}>
              <div className={styles.form_heading}>
                <Image src={logo} alt="logo" width={45} height={55} />
                <Image src={whr} alt="whr" />
              </div>
              <div className={styles.form_heading}>Create Your Account</div>

              <div className={styles.input_container}>
                <div className={styles.input_title}>Email</div>
                <input
                  className={`${styles.input} ${
                    errors.email && styles.error_boundary
                  }`}
                  value={email}
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <div className={styles.error}>{errors.email}</div>
                )}
              </div>

              <div className={styles.input_container}>
                <div className={styles.input_title}>Industry</div>
                <IndustryDropdown
                  selected={industry}
                  setSelected={setIndustry}
                />
                {errors.email && (
                  <div className={styles.error}>{errors.email}</div>
                )}
              </div>

              {industryData.find((indust) => indust.slug === industry)
                ?.subCategory && (
                <div className={styles.input_container}>
                  <div className={styles.input_title}>Category</div>
                  <CategorySelector source="search" />
                  {errors.email && (
                    <div className={styles.error}>{errors.email}</div>
                  )}
                </div>
              )}

              <div className={styles.actions_container}>
                {errors.otherError && (
                  <div className={styles.otherError}>{errors.otherError}</div>
                )}
                <button
                  className={`${styles.button} ${isLoading && styles.disable}`}
                  type="submit"
                >
                  {`${isLoading ? "Loading..." : "Sign Up"} `}
                </button>
                <div className={styles.new_account}>
                  Already have an account?
                  <Link href="/signin" className={styles.createNew_link}>
                    {" "}
                    Log In
                  </Link>
                </div>
              </div>

              <div className={styles.privacyPolicy}>
                By signing up, you agree to our
                <Link
                  href="https://10times.com/terms-of-service"
                  className={styles.privacyPolicy_hightlighted}
                >
                  Terms&nbsp;
                </Link>
                and
                <Link
                  href="https://10times.com/privacy-policy"
                  className={styles.privacyPolicy_hightlighted}
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </form>
        </div>
      )}

      {showVerification && <Verification params={obj} />}
    </div>
  );
};

export default NewSignUpForm;
