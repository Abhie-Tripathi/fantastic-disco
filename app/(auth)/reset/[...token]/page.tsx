"use client";
import React, { useState, FormEvent, useLayoutEffect } from "react";
import styles from "@/app/(auth)//signin/page.module.css";
import styles1 from "@/app/components/carousel/carousel.style.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Visibility from "/public/visibility.svg";
import VisibilityOff from "/public/visibilityOff.svg";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
import logo from "/public/Logo_Light mode.png";
import leftImage from "/public/update_password_left_logo.png";
import { showToast } from "@/utils/showToast";
import Loading from "@/app/components/UI/Loading";

const PasswordReset = ({ params }: { params: { token: string[] } }) => {
  const [password, setPassword] = useState("");
  const [cnfrmPassword, setCnfrmPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const router = useRouter();

  useLayoutEffect(() => {
    const verifyToken = async () => {
      const dataToSend = {
        token: decodeURIComponent(params.token.join("/")),
      };

      const { data, error } = await myFetch(
        `${baseUrl}/auth/customer/reset-password/page`,
        {
          method: "POST",
          body: JSON.stringify(dataToSend),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data) {
        console.log("TokenValidation", data);
        setIsValidToken(true);
      }

      if (error) {
        console.log("TokenValidation", error);
        setIsValidToken(false);
      }
    };
    verifyToken();
  }, [params.token]);

  const forgetPasswordHandler = async (event: any) => {
    event?.preventDefault();

    if (password.includes(" ")) {
      setErrors({ password: "Password must not contains spaces" });
      return;
    }
    if (password.trim().length < 8) {
      setErrors({ password: "Passoword must be atleast 8 characters" });
      return;
    }
    if (password !== cnfrmPassword) {
      setErrors({ cnfrmPassword: "Passwords do not match. Try again" });
      return;
    }

    setIsLoading(true);

    const dataToSend = {
      password: password,
      token: decodeURIComponent(params.token.join("/")),
    };

    const { data, error } = await myFetch(
      `${baseUrl}/auth/customer/reset-password`,
      {
        method: "POST",
        body: JSON.stringify(dataToSend),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (data) {
      console.log("Reset", data);
      router.push("/signin");
    }
    setIsLoading(false);

    if (error) {
      console.log("Reset", error);
      showToast("error", error.message);
      return;
    }
  };

  if (isValidToken === null) {
    return (
      <div style={{ textAlign: "center" }}>
        <Loading />
      </div>
    );
  }

  if (isValidToken === false) {
    router.push("/signin");
    return;
    // return <div className={styles.expired_token}>Token is expired</div>;
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.hero_container}>
          <div className={styles.heroImage}></div>
        </div>

        <div className={styles.sub_container}>
          <div className={styles.sub_containerLeft}>
            <div className={styles1.leftContent}>
              <div className={styles1.heading}>Update Password</div>
              <div
                style={{
                  height: "60%",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Image
                  src={leftImage}
                  alt="updatePassword"
                  style={{ height: "350px", width: "80%" }}
                />
              </div>
              <div className={styles1.content} style={{ marginTop: "-45px" }}>
                We received a request to reset your password. Follow the steps
                to set a new password for your account.
              </div>
            </div>
          </div>
          <form className={styles.loginForm} onSubmit={forgetPasswordHandler}>
            <div className={styles.form_container}>
              <div className={styles.form_heading}>
                <Image src={logo} alt="logo" />
              </div>
              <div className={styles.form_heading}>Reset Password</div>

              <div className={styles.input_container}>
                <div className={styles.input_title}>New Password</div>
                <input
                  className={`${styles.input} ${
                    errors.password && styles.error_boundary
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={passwordVisibility ? "text" : "password"}
                />
                <Image
                  src={passwordVisibility ? VisibilityOff : Visibility}
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
                  className={`${styles.input} ${
                    errors.cnfrmPassword && styles.error_boundary
                  }`}
                  value={cnfrmPassword}
                  onChange={(e) => setCnfrmPassword(e.target.value)}
                  type={confirmPasswordVisibility ? "text" : "password"}
                />
                <Image
                  src={confirmPasswordVisibility ? VisibilityOff : Visibility}
                  alt="visibility"
                  className={styles.visibility_Icon}
                  onClick={() =>
                    setConfirmPasswordVisibility(!confirmPasswordVisibility)
                  }
                />
                {errors.cnfrmPassword && (
                  <div className={styles.error}>{errors.cnfrmPassword}</div>
                )}
              </div>

              <div className={styles.actions_container}>
                <button
                  className={styles.button}
                  type="submit"
                  disabled={isLoading} // Disable button while loading
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PasswordReset;
