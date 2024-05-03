import React from "react";
import styles from "./declineNotes.module.css";
import Send from "@/public/send.svg";
import Image from "next/image";
import { useTheme } from "@/context";
const DeclineNote = () => {
  const { theme } = useTheme();
  return (
    <div className={styles.inputBox}>
      <input
        type="text"
        className={styles.box}
        placeholder="Add a note,  @name"
      />
      <Image
        style={{ cursor: "pointer" }}
        src={Send}
        alt="Send"
        className={theme === "light" ? styles.icons_light : styles.icon}
      />
    </div>
  );
};

export default DeclineNote;
