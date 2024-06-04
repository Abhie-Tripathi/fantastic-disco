"use client";
import React, { useState, FormEvent } from "react";
import styles from "../signin/page.module.css";
import Image from "next/image";
import LeftBackground from "../../../public/leftBackground.svg";
import TopRightBackground from "../../../public/topRightBackground.svg";
import BottomRightBackground from "../../../public/bottomRightBackground.svg";
import LoginVisuals from "../../../public/loginVisuals.png";
import { useAuthContext } from "@/context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignInFormSchema } from "@/types";
import { ZodError } from "zod";
import Visibility from "../../../public/visibility.svg";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const forgetPasswordHandler = async (event: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const dataToSend = {
      email: email,
    };
    const { data, error } = await myFetch(
      `${baseUrl}/auth/customer/forgot-password`,
      {
        method: "POST",
        body: JSON.stringify(dataToSend),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (data) {
      console.log(data);
    }

    if (error) {
      console.log(error);
      return;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero_container}>
        <div className={styles.heroImage}></div>
      </div>

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

      <div className={styles.sub_container}>
        <Image src={LoginVisuals} alt="loginvisuals" className={styles.image} />
        <form className={styles.loginForm} onSubmit={forgetPasswordHandler}>
          <div className={styles.form_container}>
            <div className={styles.form_heading}>Forgot Password</div>

            <div className={styles.input_container}>
              <div className={styles.input_title}>Email Address</div>
              <input
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <div className={styles.error}>{errors.email}</div>
              )}
            </div>

            <div className={styles.actions_container}>
              <button className={styles.button} type="submit">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
