"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import OtpInput from "react-otp-input";
import Carousel from "@/app/components/carousel";
import VerificationVisuals from "/public/verificationVisuals.svg";
import ArchiveIcon from "/public/archive.svg";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/constants";
import { myFetch } from "@/utils/myFetch";
import { useAuthContext } from "@/context";
import logo from "/public/Logo_Light mode.png";

interface VerificationProps {
  params: {
    email: string;
    path: string;
  };
}

const Verification: React.FC<VerificationProps> = ({ params }) => {
  const router = useRouter();
  const [time, setTime] = useState(30);
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { verifyOtp, verifyLoginOTP } = useAuthContext();

  const confirmHandler = () => {
    otpVerificationHandler();
  };

  const otpVerificationHandler = async () => {
    if (code.length < 4) {
      setErrors({ otpError: "OTP must be of 4 digit" });
      return;
    }

    const dataToSend = {
      email: params?.email,
      otpCode: code,
    };

    setIsLoading(true);
    let response;
    setIsLoading(true);
    if (params.path === "signin") {
      response = await verifyLoginOTP(dataToSend);
    } else if (params.path === "signup") {
      response = await verifyOtp(dataToSend);
    }

    console.log("Res", response);
    setIsLoading(false);

    if (response?.isVerified) {
      router.push("/internal");
    } else {
      setErrors({ otpError: "Invalid Code. Please retry" });
      return;
    }
  };

  const generateOtp = async () => {
    const dataToSend = {
      email: params.email,
    };
    const url = `${baseUrl}/auth/customer/verify/generate`;
    setResendLoading(true);
    const { data, error } = await myFetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    setResendLoading(false);
    if (data) console.log(data);
    if (error) {
      console.log(error);
      return;
    }
  };
  useEffect(() => {
    let timer: any = null;
    if (time >= 0) {
      if (time > 0) {
        timer = setTimeout(() => {
          setTime((prev) => prev - 1);
        }, 1000);
      } else return () => clearTimeout(timer);
    }
  }, [time]);

  const resend = () => {
    setCode("");
    setErrors({});
    if (time === 0) {
      setTime(30);
    }
    generateOtp();
  };

  const handleChange = (value: any) => {
    setCode(value);
    if (Object.keys(errors).length !== 0) {
      setErrors({});
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sub_container}>
        <div className={styles.leftContainer}>
          <Carousel />
        </div>
        <div className={styles.form_container}>
          <div className={styles.heading}>
            <Image src={logo} alt="logo" />
          </div>

          <div className={styles.message}>
            <span className={styles.message_highlighted}>Check your </span>
            <Image
              src={ArchiveIcon}
              alt="archive"
              className={styles.archive_icon}
            />
            <span className={styles.message_highlighted}> mailbox </span>
            for a quick verification code.
          </div>

          <div className={styles.heading}>Enter 4 Digit OTP</div>

          <OtpInput
            containerStyle={styles.input_container}
            value={code}
            onChange={handleChange}
            numInputs={4}
            inputType="number"
            renderSeparator={<span style={{ width: "20px" }}></span>}
            renderInput={(props) => (
              <input {...props} className={styles.input} />
            )}
            shouldAutoFocus={true}
            inputStyle={{
              width:"40px",
              height:"40px",
              fontFamily: "inherit",
              outline: "none",
              border: "1px solid #e6e6e6",
              borderRadius: "var(--border-radius-sm)",
              textAlign: "center",
              borderColor: errors.otpError && "#f15050",
            }}
          />
          {errors.otpError && (
            <div className={styles.error}>{errors.otpError}</div>
          )}

          <div className={styles.actions_container}>
            <div
              className={`${styles.button} ${isLoading && styles.disable}`}
              onClick={confirmHandler}
            >
              {isLoading ? "Verifying..." : "Confirm"}
            </div>
          </div>
          <div className={styles.resendButton_container}>
            {time !== 0 && <span>00 : {time > 9 ? time : `0${time}`}</span>}
            {time === 0 && (
              <span
                className={`${styles.resend_button} ${
                  resendLoading && styles.disable_text
                }`}
                onClick={() => resend()}
                style={{ cursor: time === 0 ? "pointer" : "default" }}
              >
                Resend
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;