"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import OtpInput from "react-otp-input";
import VerificationVisuals from "/public/verificationVisuals.svg";
import ArchiveIcon from "/public/archive.svg";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/constants";
import { myFetch } from "@/utils/myFetch";

interface VerificationProps {
  params: {
    email: string;
  };
}

const Verification: React.FC<VerificationProps> = ({ params }) => {
  const router = useRouter();
  const [time, setTime] = useState(30);
  const [code, setCode] = useState("");

  const confirmHandler = () => {
    verifyOtp();
  };

  const verifyOtp = async () => {
    const url = `${baseUrl}/auth/customer/verify`;

    const dataToSend = {
      email: params?.email,
      otpCode: code,
    };
    const { data, error } = await myFetch(url, {
      method: "POST",
      body: JSON.stringify(dataToSend),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (data) {
      console.log(data);
      if (data.isVerified) router.push("/");
    }
    if (error) {
      console.log(error);
      return;
    }
  };

  const generateOtp = async () => {
    const url = `${baseUrl}/auth/customer/verify/generate`;
    const { data, error } = await myFetch(url, {
      method: "POST",
    });
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
    if (time === 0) {
      setTime(30);
    }
    generateOtp();
  };
  return (
    <div className={styles.container}>
      <div className={styles.sub_container}>
        <Image
          src={VerificationVisuals}
          alt="verificationvisuals"
          width={500}
          className={`${styles.verification_visuals} ${styles.image}`}
        />

        <div className={styles.form_container}>
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

          <div className={styles.heading}>OTP Verification</div>

          <div className={styles.sub_heading}>Enter 4 digit OTP</div>

          <OtpInput
            containerStyle={styles.input_container}
            value={code}
            onChange={(value) => setCode(value)}
            numInputs={4}
            inputType="number"
            renderSeparator={<span style={{ width: "20px" }}></span>}
            renderInput={(props) => (
              <input {...props} className={styles.input} />
            )}
            shouldAutoFocus={true}
            inputStyle={{
              fontSize: "24px",
              fontFamily: "inherit",
              outline: "none",
              border: "1px solid #e6e6e6",
              borderRadius: "10px",
              padding: "10px 20px",
              width: "100%",
              textAlign: "center",
            }}
          />

          <div className={styles.actions_container}>
            <div className={styles.button} onClick={confirmHandler}>
              Confirm
            </div>
          </div>
          <div className={styles.resendButton_container}>
            {time !== 0 && <span>00 : {time > 9 ? time : `0${time}`}</span>}
            {time === 0 && (
              <span
                className={styles.resend_button}
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
