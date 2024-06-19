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
import logo from "/public/Logo_Light mode.png";
import { showToast } from "@/utils/showToast";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const forgetPasswordHandler = async (event: any) => {
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
      showToast("success", data.message);
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

      <div className={styles.sub_container}>
        <div className={styles.sub_containerLeft}>
          <Carousel />
        </div>
        <form className={styles.loginForm} onSubmit={forgetPasswordHandler}>
          <div className={styles.form_container}>
            <div className={styles.form_heading}>
              <Image src={logo} alt="logo" />
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
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
