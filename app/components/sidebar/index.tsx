"use client";
import React, { useState } from "react";
import styles from "./sidebar.module.css";
import Link from "next/link";
import SearchIcon from "@/app/components/sidebar/Icons/Search";
import DashboardIcon from "@/app/components/sidebar/Icons/Dashboard";
import CoordinateIcon from "@/app/components/sidebar/Icons/Coordinate";
import EventTrends from "@/app/components/sidebar/Icons/EventTrends";
import Tracker from "@/app/components/sidebar/Icons/Trackers";
import OutreachIcon from "@/app/components/sidebar/Icons/Outreach";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context";
const Sidebar = () => {
  const pathName = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState<Boolean>(false);
  const { theme } = useTheme();

  return (
    <div
      className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""} ${
        theme === "light" ? styles.container_light : ""
      }`}
      onMouseEnter={() => setIsSidebarOpen(true)}
      onMouseLeave={() => setIsSidebarOpen(false)}
    >

      <Link
        href="/internal"
        className={`${styles.link} ${pathName === "/internal" ? styles.active : ""}`}
      >
        <DashboardIcon />
        <div className={styles.linkName}>Dashboard</div>
      </Link>

      <Link
        href="/internal/coordinate"
        className={`${styles.link} ${
          pathName === "/internal/coordinate" ? styles.active : ""
        }`}
      >
        <CoordinateIcon />
        <div className={styles.linkName}>Coordinate</div>
      </Link>

      <Link
        href="/internal/search/events"
        className={`${styles.link} ${
          pathName === "/internal/search/events" ? styles.active : ""
        }`}
      >
        <SearchIcon />
        <div className={styles.linkName}>Research</div>
      </Link>

      <Link
        href="/internal/trackers"
        className={`${styles.link} ${
          pathName === "/internal/trackers" ? styles.active : ""
        }`}
      >
        <Tracker />
        <div className={styles.linkName}>Trackers</div>
      </Link>

      <Link
        href="/internal/outreach"
        className={`${styles.link} ${
          pathName === "/internal/outreach" ? styles.active : ""
        }`}
      >
        <OutreachIcon />
        <div className={styles.linkName}>Outreach</div>
      </Link>

      <Link
        href="/internal/trends"
        className={`${styles.link} ${
          pathName === "/internal/trends" ? styles.active : ""
        }`}
      >
        <EventTrends />
        <div className={styles.linkName}>Event Trends</div>
      </Link>
    </div>
  );
};
export default Sidebar;