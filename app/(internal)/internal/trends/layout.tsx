"use client";
import React from "react";
import styles from "./layout.style.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const {theme} = useTheme()
  const pathName = usePathname();
  return (
    <div style={{ paddingTop: "70px", paddingLeft: "74px" }}>
      <div className={`${styles.container} ${theme === 'light' ? styles.container_light : ""}`}>
        <div className={styles.tab_container}>
          <Link
            href="/internal/trends/attendance"
            className={`${styles.tab} ${
              pathName == "/internal/trends/attendance" ? styles.active : ""
            }`}
          >
            Predicted Attendance
          </Link>
          <Link
            href="/internal/trends/events"
            className={`${styles.tab} ${
              pathName == "/internal/trends/events" ? styles.active : ""
            }`}
          >
            No Of Events
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;
