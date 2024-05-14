"use client";
import React, { useState, FormEvent } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import LeftBackground from "../../../public/leftBackground.svg";
import TopRightBackground from "../../../public/topRightBackground.svg";
import BottomRightBackground from "../../../public/bottomRightBackground.svg";
import SignUpVisuals from "../../../public/signupVisuals.svg";
import Verification from "../verification/page";
import { useAuthContext } from "@/context/auth";
import Link from "next/link";
import { SignUpFormSchema } from "@/types/signup";
import { ZodError } from "zod";
import Visibility from "../../../public/visibility.svg";

const SignUp = () => {
  const [showVerification, setShowVerification] = useState(false);
  const { signup } = useAuthContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData: any = {
      name,
      email,
      password,
      confirmPassword,
    };
    if (mobileNo.length > 0) {
      formData.mobileNo = mobileNo;
    }
    try {
      SignUpFormSchema.parse(formData);
      setErrors({});
      if (password !== confirmPassword) {
        setErrors({ confirmPassword: "Passwords do not match. Try again" });
        return;
      }

      setIsLoading(true);

      const response = await signup({
        firstname: name.split(" ")[0],
        lastname: name.split(" ")[1],
        email,
        password,
        ...(mobileNo.length > 0 ? { phoneNumber: mobileNo } : {}),
      });
      setIsLoading(false);
      console.log(response);

      if (!response?.error) {
        // console.log(response)
        setShowVerification(true);
      } else {
        setErrors({ confirmPassword: response.error });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            validationErrors[err.path.join(".")] = err.message;
          }
        });
        setErrors(validationErrors);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };
  console.log(errors);
  return (
    <div className={styles.container}>
      <Image
        src={LeftBackground}
        alt="leftBackground"
        className={`${styles.leftBackground_image} desktop_view tablet_view`}
      />
      <Image
        src={TopRightBackground}
        alt="toprightBackground"
        className={`${styles.topRightBackground_image} desktop_view tablet_view`}
      />
      <Image
        src={BottomRightBackground}
        alt="bottomRightBackground"
        className={`${styles.bottomRightBackground} desktop_view tablet_view`}
      />

      {!showVerification && (
        <div className={styles.sub_container}>
          <Image src={SignUpVisuals} alt="loginvisuals" className={styles.image} />
          <form onSubmit={handleSignUp}>
            <div className={styles.form_container}>
              <div className={styles.form_heading}>Sign Up</div>

              <div className={styles.input_container}>
                <div className={styles.input_title}>Full Name</div>
                <input
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && (
                  <div className={styles.error}>{errors.name}</div>
                )}
              </div>

              <div className={styles.input_container}>
                <div className={styles.input_title}>Email</div>
                <input
                  className={styles.input}
                  value={email}
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <div className={styles.error}>{errors.email}</div>
                )}
              </div>

              <div className={styles.input_container}>
                <div className={styles.input_title}>Mobile No</div>
                <input
                  className={styles.input}
                  value={mobileNo}
                  type="number"
                  onChange={(e) => setMobileNo(e.target.value)}
                />
                {errors.mobileNo && (
                  <div className={styles.error}>{errors.mobileNo}</div>
                )}
              </div>

              <div className={styles.input_container}>
                <div className={styles.input_title}>Password</div>
                <input
                  className={styles.input}
                  value={password}
                  type={passwordVisibility ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Image
                  src={Visibility}
                  alt="visibility"
                  className={styles.visibility_Icon}
                  onClick={() => setPasswordVisibility(!passwordVisibility)}
                />
                {errors.password && (
                  <div className={styles.error}>{errors.password}</div>
                )}
              </div>

              <div className={styles.input_container}>
                <div className={styles.input_title}>Confirm Password</div>
                <input
                  className={styles.input}
                  value={confirmPassword}
                  type={confirmPasswordVisibility ? "text" : "password"}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {/* <Image
                src={Visibility}
                alt="visibility"
                className={styles.visibility_Icon}
                onClick={() =>
                  setConfirmPasswordVisibility(!confirmPasswordVisibility)
                }
              /> */}
                {errors.confirmPassword && (
                  <div className={styles.error}>{errors.confirmPassword}</div>
                )}
              </div>

              <div className={styles.actions_container}>
                <button className={styles.button} type="submit">
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
                <span className={styles.privacyPolicy_hightlighted}>
                  Terms{" "}
                </span>
                and
                <span className={styles.privacyPolicy_hightlighted}>
                  Privacy Policy
                </span>
              </div>
            </div>
          </form>
        </div>
      )}

      {showVerification && <Verification />}
    </div>
  );
};

export default SignUp;
