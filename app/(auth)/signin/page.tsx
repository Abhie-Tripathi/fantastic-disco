"use client";
import React, { useState, FormEvent } from "react";
import styles from "./page.module.css";
import Image from "next/image";
// import EventeliText from "/public/assets/eventeli_text.svg";
// import EventeliLogo from "/public/assets/heroLogo.png";
// import { SignInDTO } from '@/app/components/types/signin';
import LeftBackground from "../../../public/leftBackground.svg";
import TopRightBackground from "../../../public/topRightBackground.svg";
import BottomRightBackground from "../../../public/bottomRightBackground.svg";
import LoginVisuals from "../../../public/loginVisuals.png";
import { useAuthContext } from "@/context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignInFormSchema } from "@/app/components/types/";
import { ZodError } from "zod";
import Visibility from "../../../public/visibility.svg";



const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const { signin } = useAuthContext();

  const signinHandler = async (event:FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    try {
      SignInFormSchema.parse({ email, password });
      setErrors({});
      const response = await signin({ email, password });
      if (response?.error) {
        setErrors({ password: response.error });
      } else {
        router.push("/");
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
      <div className={styles.hero_container}>
        <div className={styles.heroImage}>
          {/* <Image src={EventeliLogo} alt="logo" width={65} />
          <Image src={EventeliText} alt="text" /> */}
        </div>
        {/* <div className={styles.heroTitle}>
          Elevate your event planning with intelligence
        </div> */}
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

      <Image src={LoginVisuals} alt="loginvisuals" width={400} />
      <form className={styles.loginForm} onSubmit={signinHandler}>
        <div className={styles.form_container}>
          <div className={styles.form_heading}>Sign In</div>

          <div className={styles.input_container}>
            <div className={styles.input_title}>Email Address</div>
            <input
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div className={styles.error}>{errors.email}</div>}
          </div>

          <div className={styles.input_container}>
            <div className={styles.input_title}>Password</div>
            <input
              className={styles.input}
              value={password}
              type={visible ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Image
              src={Visibility}
              alt="visibility"
              className={styles.visibility_Icon}
              onClick={() => setVisible(!visible)}
            />
            {errors.password && (
              <div className={styles.error}>{errors.password}</div>
            )}
          </div>

          <div className={styles.checkbox_container}>
            <input
              type="checkbox"
              id="remember"
              className={styles.checkbox_input}
            />
            <label htmlFor="remember" className={styles.checkbox_title}>
              Remember me
            </label>
          </div>

          <div className={styles.actions_container}>
            <button className={styles.button}  type="submit">
              Sign In
            </button>
            <div className={styles.new_account}>
              Do not have an account?
              <Link href={"/signup"} className={styles.createNew_link}>
                {" "}
                Create New
              </Link>
            </div>
          </div>

          <div className={styles.forgot_password_link}>Forgot Password?</div>
        </div>
      </form>
    </div>
  );
};

export default SignIn;