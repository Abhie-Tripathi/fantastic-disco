"use client";
import React, { useState } from "react";
import Navbar from "@/app/components/internal/eventtrends/Navbar";
import styles from "./page.style.module.css";
import EventTrends from "@/app/components/internal/eventtrends/trends";
import { useTheme } from "@/context";
import { useToast } from "@/hooks/useToast";

const Page = () => {
  const [activeChip, setActiveChip] = useState("Predicted Attendance");
  const { theme } = useTheme();

  return (
    <div className={styles.body}>
      <div className={styles.navbar}>
        <Navbar setActiveChip={setActiveChip} />
      </div>
      <EventTrends activeChip={activeChip} />
    </div>
  );
};

export default Page;
