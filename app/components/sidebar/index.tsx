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
import Image from "next/image";
import logo from "/public/croppedlogo.png";

const Sidebar = () => {
  const pathName = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState<Boolean>(false);
  const { theme } = useTheme();

  const getActiveClass = (path: string) => {
    return pathName === path
      ? `${styles.active} ${
          theme === "dark" ? "darkMode_secondary" : "lightMode_secondary"
        }`
      : "";
  };

  return (
    <div
    className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""} ${
      theme === "dark" ? 'darkMode' : ""
    }`}
    onMouseEnter={() => setIsSidebarOpen(true)}
    onMouseLeave={() => setIsSidebarOpen(false)}
  >
    <Link href="/internal" className={`${styles.link} `}>
      <Image
        className={styles.logo_image}
        src={logo}
        width={40}
        height={48}
        alt="logo"
      />
      <div className={styles.logo_title}>EventGeni</div>
    </Link>

    <Link href="/internal" className={`${styles.link} ${getActiveClass("/internal")}`}>
      <DashboardIcon />
      <div className={styles.linkName}>Dashboard</div>
    </Link>

    <Link
      href="/internal/search/events"
      className={`${styles.link} ${getActiveClass("/internal/search/events")}`}
    >
      <SearchIcon />
      <div className={styles.linkName}>Research</div>
    </Link>

    <Link
      href="/internal/trends"
      className={`${styles.link} ${getActiveClass("/internal/trends")}`}
    >
      <EventTrends />
      <div className={styles.linkName}>Event Trends</div>
    </Link>

    <Link
      href="/internal/trackers"
      className={`${styles.link} ${getActiveClass("/internal/trackers")}`}
    >
      <Tracker />
      <div className={styles.linkName}>Trackers</div>
    </Link>

    <Link
      href="/internal/coordinate"
      className={`${styles.link} ${getActiveClass("/internal/coordinate")}`}
    >
      <CoordinateIcon />
      <div className={styles.linkName}>Coordinate</div>
    </Link>

    <Link
      href="/internal/outreach"
      className={`${styles.link} ${getActiveClass("/internal/outreach")}`}
    >
      <OutreachIcon />
      <div className={styles.linkName}>Outreach</div>
    </Link>

  </div>
  );
};
export default Sidebar;
