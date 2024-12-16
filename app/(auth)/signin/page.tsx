"use client";
import React, { useState, FormEvent, useEffect } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import Carousel from "@/app/components/carousel";
import { useAuthContext } from "@/context";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SignInFormSchema, SignInWithOTPSchema } from "@/types";
import { ZodError } from "zod";
import Visibility from "../../../public/visibility.svg";
import VisibilityOff from "../../../public/visibilityOff.svg";
// import logo from "/public/Logo_Light mode.png";
import logo from "/public/croppedlogo.png";
import whr from "/public/whrai.svg"
import Verification from "../verification/page";
import { showToast } from "@/utils/showToast";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const { signin } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false); 

  const signinHandler = async (event: any) => {
    event?.preventDefault();
    try {
      SignInFormSchema.parse({ email, password });
      setErrors({});
      setIsLoading(true);
      const response = await signin({ email, password });
      console.log(response);
      setIsLoading(false);

      if (response.length !== 0) {
        if (response?.emailError) {
          setErrors({ email: response?.emailError });
          return;
        } else if (response?.passwordError) {
          setErrors({ password: response.passwordError });
          return;
        } else {
          if (rememberMe) {
            localStorage.setItem("rememberedEmail", email);
          } else {
            localStorage.removeItem("rememberedEmail");
          }
          if (id !== null) {
            router.push(`/internal/trackers/${id}/trackedEvents`);
          } else router.push("/internal");
        }
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
  const obj = {
    email: email,
    path: "signin",
  };

  const handleOTPLogin = async (event: any) => {
    event?.preventDefault();
    const dto = { email };
    try {
      SignInWithOTPSchema.parse({ email });
      setErrors({});
      const { data, error } = await myFetch(
        `${baseUrl}/auth/customer/verify/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dto),
        }
      );
      console.log(data, error);

      if (error) {
        showToast("error", error.message);
        return;
      }

      if (data) {
        setShowVerification(true);
      }

      if (data === null || error === null) {
        setErrors({ email: "No user found with this email" });
        return;
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

  return (
    <div className={styles.container}>
      {!showVerification && (
        <div className={styles.sub_container}>
          {/* <Image src={LoginVisuals} alt="loginvisuals" className={styles.image} /> */}
          <div className={styles.sub_containerLeft}>
            <Carousel />
          </div>
          <form className={styles.loginForm}>
            <div className={styles.form_container}>
              <div className={styles.form_heading}>
                <Image src={logo} alt="logo" width={45} height={50} />
                <Image src={whr} alt="whr"/>
              </div>

              <div className={styles.input_container}>
                <div className={styles.input_title}>Email Address</div>
                <input
                  className={`${styles.input} ${
                    errors.email && styles.error_boundary
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <div className={styles.error}>{errors.email}</div>
                )}
              </div>

              {/* <div className={styles.input_container}>
                <div className={styles.input_title}>Password</div>
                <input
                  className={`${styles.input} ${
                    errors.password && styles.error_boundary
                  }`}
                  value={password}
                  type={visible ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Image
                  src={visible ? VisibilityOff : Visibility}
                  alt="visibility"
                  className={styles.visibility_Icon}
                  onClick={() => setVisible(!visible)}
                />
                {errors.password && (
                  <div className={styles.error}>{errors.password}</div>
                )}
              </div> */}  

              {/* <div className={styles.checkbox_container}>
                <input
                  type="checkbox"
                  id="remember"
                  className={styles.checkbox_input}
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label htmlFor="remember" className={styles.checkbox_title}>
                  Remember me
                </label>
              </div> */}

              <div className={styles.actions_container}>
                {/* <button
                  className={styles.button}
                  type="submit"
                  onClick={signinHandler}
                >
                  {isLoading ? "Logging..." : "Login"}
                </button> */}

                <button className={styles.button} onClick={handleOTPLogin}>
                  Login
                </button>
                <div className={styles.new_account}>
                  Do not have an account?
                  <Link href={"/signup"} className={styles.createNew_link}>
                    {" "}
                    Create New
                  </Link>
                </div>
              </div>

              <Link
                href="/forgot-password"
                className={styles.forgot_password_link}
              >
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      )}
      {showVerification && <Verification params={obj} />}
    </div>
  );
};

export default SignIn;