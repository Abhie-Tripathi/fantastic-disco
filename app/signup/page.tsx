"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";
// import EventeliText from "/public/assets/eventeli_text.svg";
// import EventeliLogo from "/public/assets/heroLogo.png";
import LeftBackground from "../../public/leftBackground.svg";
import TopRightBackground from "../../public/topRightBackground.svg";
import BottomRightBackground from "../../public/bottomRightBackground.svg";
import SignUpVisuals from "../../public/signupVisuals.svg";
//import Verification from "@/components/SignUp/Verification";
//import { useAuthContext } from "@/context/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import { SignUpFormSchema } from "@/types/signup";
// import { ZodError } from "zod";
// import Visibility from "/public/visibility.svg";

const SignIn = () => {
  const [showVerification, setShowVerification] = useState(false);
//   const { signup } = useAuthContext();

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

  const handleSignUp = async () => {
    // try {
    //   SignUpFormSchema.parse({
    //     name,
    //     email,
    //     mobileNo,
    //     password,
    //     confirmPassword,
    //   });
    //   setErrors({});
    //   if (password !== confirmPassword) {
    //     setErrors({ confirmPassword: "Passwords do not match. Try again" });
    //     return;
    //   }
    //   setIsLoading(true);
    //   const response = await signup({
    //     firstname: name.split(" ")[0],
    //     lastname: name.split(" ")[1],
    //     email,
    //     password,
    //   });
    //   setIsLoading(false);
    //   if (!response?.error) {
    //     setShowVerification(true);
    //   } else {
    //     setErrors({ confirmPassword: response.error });
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

  return (
    <div className={styles.container}>
      <div className={styles.hero_container}>
        <div className={styles.heroImage}>
          {/* <Image src={EventeliLogo} alt="logo" width={65} />
          <Image src={EventeliText} alt="text" /> */}
        </div>
        <div className={styles.heroTitle}>
          Elevate your event planning with intelligence
        </div>
      </div>

      <Image
        src={LeftBackground}
        alt="leftBackground"
        className={styles.leftBackground_image}
      />
      <Image
        src={TopRightBackground}
        alt="toprightBackground"
        className={styles.topRightBackground_image}
      />
      <Image
        src={BottomRightBackground}
        alt="bottomRightBackground"
        className={styles.bottomRightBackground}
      />

      {!showVerification && (
        <div className={styles.sub_container}>
          <Image src={SignUpVisuals} alt="loginvisuals" width={400} />

          <div className={styles.form_container}>
            <div className={styles.form_heading}>Create your account</div>

            <div className={styles.input_container}>
              <div className={styles.input_title}>Full Name</div>
              <input
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <div className={styles.error}>{errors.name}</div>}
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
              {/* <Image
                src={Visibility}
                alt="visibility"
                className={styles.visibility_Icon}
                onClick={() => setPasswordVisibility(!passwordVisibility)}
              /> */}
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
              <div className={styles.button} onClick={handleSignUp}>
                {`${isLoading ? "Loading..." : "Sign Up"} `}
              </div>
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
              <span className={styles.privacyPolicy_hightlighted}>Terms </span>
              and
              <span className={styles.privacyPolicy_hightlighted}>
                Privacy Policy
              </span>
            </div>
          </div>
        </div>
      )}

      {/* {showVerification && <Verification />} */}
    </div>
  );
};

export default SignIn;