"use client";
import React, { useState } from "react";
import styles from "./navbar.style.module.css";
import { useTheme } from "@/context";

interface NavbarProps {
  setActiveChip: React.Dispatch<React.SetStateAction<string>>;
}
const Navbar: React.FC<NavbarProps> = (props) => {
  const { theme } = useTheme();

  const [activeChip, setActiveChip] = useState("Predicted Attendance");
  const selectChipHandler = (key: string) => {
    setActiveChip(key);
    props.setActiveChip(key);
  };

  return (
    <div
      className={`${styles.navbar} ${theme === "light" && styles.navbar_light}`}
    >
      <div
        className={`${styles.header_container} ${
          activeChip === "Predicted Attendance" && styles.active
        }`}
      >
        <div
          className={`${styles.heading}`}
          onClick={() => selectChipHandler("Predicted Attendance")}
        >
          Predicted Attendance
        </div>
      </div>
      <div
        className={`${styles.header_container} ${
          activeChip === "No of Events" && styles.active
        }`}
      >
        <div
          className={`${styles.heading} `}
          onClick={() => selectChipHandler("No of Events")}
        >
          No. of Events
        </div>
      </div>
    </div>
  );
};

export default Navbar;
