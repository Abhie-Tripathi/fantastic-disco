"use client";
import React, { useState } from "react";
import styles from "./registerform.style.module.css";
import { baseUrl } from "@/constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "@/utils/showToast";
interface Props {
  registerMessage: string;
  registerBtnText: string;
  registerBtnColor: string;
  widgetId?: string;
  eventId: string;
  setRegisterSuccess: (value: boolean) => void;
}

const RegisterForm = ({
  registerMessage,
  registerBtnText,
  widgetId,
  registerBtnColor,
  eventId,
  setRegisterSuccess,
}: Props) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState(true);
  // Function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace("#", "");
    const bigint = parseInt(cleanHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };

  // Function to calculate brightness
  const calculateBrightness = ({
    r,
    g,
    b,
  }: {
    r: number;
    g: number;
    b: number;
  }) => {
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  // Determine if the button color is dark or light
  const rgb = hexToRgb(registerBtnColor);
  const brightness = calculateBrightness(rgb);
  const fontColor = brightness > 155 ? "#000000" : "#FFFFFF";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      email: formData.email,
      firstname: formData.firstname,
      lastname: formData.lastname,
      eventId: eventId,
      interest: "ATTENDEE",
      note: "intend",
      source: "eventgeni",
      // sourceId: widgetId,
    };

    try {
      const response = await fetch(`${baseUrl}/intend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Success:", data);
        setRegisterSuccess(true);
        // toast.success("successfully registred for the event !");
      } else {
        console.error("Error:", response.statusText);
        // toast.error("Error in registration");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleClick = () => {
    showToast("error", "You have already registered for this event");
  };
  return (
    <div className={styles.registerContainer}>
      {/* <ToastContainer /> */}
      {isApproved ? (
        <>Register</>
      ) : (
        <div className={styles.header}>
          <div>Join us at the event</div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {isApproved ? (
          <>
            <div className={styles.event_container}>
              <div className={styles.icon_container}>
                <EventClosedIcon />
              </div>
              <div className={styles.text_container}>
                <div className={styles.event_full_text}>Event Full</div>
                <div className={styles.waitlist_text}>
                  If you`&apos;`d like, you can join the waitlist.
                </div>
              </div>
            </div>
            <div className={styles.detail_text}>
              Please click on the button below to join the waitlist. You will be
              notified if additional spots become available.
            </div>
          </>
        ) : (
          <div className={styles.formSubHeading}>{registerMessage}</div>
        )}

        <input
          className={styles.inputField}
          type="text"
          name="firstname"
          placeholder="First Name"
          value={formData.firstname}
          onChange={handleChange}
          required
        />
        <input
          className={styles.inputField}
          type="text"
          name="lastname"
          placeholder="Last Name"
          value={formData.lastname}
          onChange={handleChange}
          required
        />
        <input
          className={styles.inputField}
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          style={{ backgroundColor: registerBtnColor, color: fontColor }}
          className={styles.submitBtn}
        >
          {isApproved ? (
            <span onClick={handleClick}>Join waitlist</span>
          ) : (
            `${registerBtnText}`
          )}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;

function EventClosedIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#a8a8a8"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}
