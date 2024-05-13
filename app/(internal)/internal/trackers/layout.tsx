"use client";
import React from "react";
import styles from "./layout.style.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context";
import Image from "next/image";
import MoreIcon from "/public/dots.svg";
import Add from "/public/add.svg";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  const { theme } = useTheme()

  return (
    <div className={`${styles.container} ${theme === 'light' ? styles.container_light : ""}`}>
      <div className={styles.header_container}>
        <div className={styles.tab_container}>
          <Link
            href="/internal/trackers"
            className={`${styles.tab} ${pathName == "/internal/trackers" ? styles.active : ""
              }`}
          >
            Trackers
          </Link>
          <Link
            href="/internal/trackers/savedevents"
            className={`${styles.tab} ${pathName == "/internal/trackers/savedevents" ? styles.active : ""
              }`}
          >
            Saved Events
          </Link>
        </div>
        <div className={styles.trackers_header}>
          <div className={styles.trackers_header_more_button}>
            <Image src={MoreIcon} alt="moreicon" />
          </div>
          <Link
            href="trackers/create"
            className={styles.trackers_header_newtracker_button}
          >
            <Image src={Add} alt="addicon" />
            New Tracker
          </Link>
        </div>
      </div>

      {children}
    </div>
  );
};

export default Layout;