"use client";
import React, { useState } from "react";
import Navbar from "@/app/components/internal/eventtrends/Navbar";
import styles from "./page.style.module.css";
import EventTrends from "@/app/components/internal/eventtrends/trends";
import { useTheme } from "@/context";

const Page = () => {
  const [activeChipY, setActiveChipY] = useState("Predicted Attendance");
  const [activeChipX, setActiveChipX] = useState("Date");
  const { theme } = useTheme();

  return (
    <div className={styles.body}>
      <div className={styles.navbar}>
        <Navbar
          setActiveChipY={setActiveChipY}
          setActiveChipX={setActiveChipX}
        />
      </div>
      <EventTrends activeChipX={activeChipX} activeChipY={activeChipY} />
    </div>
  );
};

export default Page;
