"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import OtpInput from "react-otp-input";
import VerificationVisuals from "/public/verificationVisuals.svg";
import ArchiveIcon from "/public/archive.svg";
import { useRouter } from "next/navigation";

const Verification = () => {
  const router = useRouter();
  const [code, setCode] = useState("");

  const confirmHandler = () => {
    if (code == "0000") {
      router.push("/");
    }
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
            00 : 36 <span className={styles.resend_button}>Resend</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;
