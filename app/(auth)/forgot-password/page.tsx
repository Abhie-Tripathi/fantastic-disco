"use client";
import React, { useState, FormEvent } from "react";
import styles from "../signin/page.module.css";
import Image from "next/image";
import { useAuthContext } from "@/context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
import Carousel from "@/app/components/carousel";
import logo from "/public/croppedlogo.png";
import whr from "/public/whrai.svg"
import { showToast } from "@/utils/showToast";
import { SignInWithOTPSchema } from "@/types";
import { z } from "zod";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const forgetPasswordHandler = async (event: any) => {
    event?.preventDefault();
    try {
      SignInWithOTPSchema.parse({ email });
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
        showToast("success", data.message);
      }

      if (error) {
        setErrors({email: error.message})
        return;
      }
    } catch (e) {
      if (e instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        e.errors.forEach((err) => {
          if (err.path.length > 0) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero_container}>
        <div className={styles.heroImage}></div>
      </div>

      <div className={styles.sub_container}>
        <div className={styles.sub_containerLeft}>
          <Carousel />
        </div>
        <form className={styles.loginForm} onSubmit={forgetPasswordHandler}>
          <div className={styles.form_container}>
            <div className={styles.form_heading}>
            <Image src={logo} alt="logo" width={45} height={50} />
                <Image src={whr} alt="whr"/>
            </div>
            <div className={styles.form_heading}>Forgot Password</div>

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

            <div className={styles.actions_container}>
              <button
                className={styles.button}
                type="submit"
                onClick={forgetPasswordHandler}
              >
                Submit
              </button>
              <div className={styles.new_account} style={{border: 'none'}}>
                <Link href={"/signin"}>
                  Or click here to <span className={styles.createNew_link} > Log In</span>
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;