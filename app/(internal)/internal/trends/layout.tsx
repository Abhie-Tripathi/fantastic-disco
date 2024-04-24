"use client";
import React from "react";
import styles from "./layout.style.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  return (
    <div className={styles.container}>
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
  );
};

export default Layout;