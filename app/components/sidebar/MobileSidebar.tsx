"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./MobileSidebar.module.css";
import Link from "next/link";
import Image from "next/image";
// import Dashboard from "/public/internal/dashboard.svg";
// import Trend from "/public/internal/trend.svg";
// import Research from "/public/internal/research.svg";
// import DatasetIcon from "/public/dataset.svg";
// import Exhibit from "/public/internal/exhibit.svg";
import SearchIcon from "@/app/components/sidebar/Icons/Search";
import DashboardIcon from "@/app/components/sidebar/Icons/Dashboard";
import CoordinateIcon from "@/app/components/sidebar/Icons/Coordinate";
import EventTrends from "@/app/components/sidebar/Icons/EventTrends";
import Tracker from "@/app/components/sidebar/Icons/Trackers";
import OutreachIcon from "@/app/components/sidebar/Icons/Outreach";
import { usePathname } from "next/navigation";
// import Graph from "/public/internal/trend.svg";
import { useAuthContext, useTheme } from "@/context";
import closeIcon from "/public/internal/cross.svg";
import logoutIcon from "/public/internal/logout.svg";
import Home from "/public/internal/home.svg";

interface UserDetail {
  firstname: string;
  email: string;
  lastname: string;
}

const MobileSidebar = ({ onClose }: { onClose: () => void }) => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuthContext();
  const iconClass = theme === "light" ? "icons_light" : "icon";

  const [userDetail, setUserDetail] = useState<UserDetail | null>(
    user ? user : null
  );

  useEffect(() => {
    setUserDetail(user);
  }, [user]);

  const themeSwitchHandler = () => {
    toggleTheme();
  };


  return (
      <div
        className={`${styles.container} ${styles.open}} ${
          theme === "light" ? styles.container_light : ""
        }`}
      >
        <div>
          <div className={styles.header_container}>
            <div
              className={`${styles.header}`}
              style={{
                display: "flex",
                gap: "12px",
                position: "relative",
              }}
            >
              <div className={styles.circle}>
                {userDetail?.firstname.charAt(0)}
                {userDetail?.lastname.charAt(0)}
              </div>
              <div className={styles.userDetails}>
                <div style={{fontSize: "16px"}}>
                  {userDetail?.firstname} {userDetail?.lastname}
                </div>
                <div style={{ fontSize: "12px" }}>
                  {userDetail && userDetail?.email.length > 23
                    ? userDetail?.email.slice(0, 22) + "..."
                    : userDetail?.email}
                </div>
              </div>
            </div>
            <span className={styles.closeIcon} onClick={onClose}>
              <Image src={closeIcon} alt="close" />
            </span>
          </div>

          <div className={styles.links}>
            <Link
              href="/"
              className={`${styles.link} ${ pathname === "/" ? styles.active : ""}`}
              onClick={onClose}
            >
              <Image
                src={Home}
                alt="Home"
                className={`${styles.icons} ${iconClass}`}
              />
              <div className={styles.linkName}>Home</div>
            </Link>

            <Link
              href="/internal"
              className={`${styles.link} ${
                pathname === "/internal"
                  ? styles.active
                  : ""
              }`}
              onClick={onClose}
            >
              <DashboardIcon />
              <div className={styles.linkName}>Dashboard</div>
            </Link>

            <Link
              href="/internal/coordinate"
              className={`${styles.link} ${
                pathname === "/internal/coordinate"
                  ? styles.active
                  : ""
              }`}
              onClick={onClose}
            >
              <CoordinateIcon />
              <div className={styles.linkName}>Coordinate</div>
            </Link>

            <Link
              href="/internal/search/events"
              className={`${styles.link} ${
                pathname === "/internal/search/events"
                  ? styles.active
                  : ""
              }`}
              onClick={onClose}
            >
              <SearchIcon />
              <div className={styles.linkName}>Research</div>
            </Link>

            <Link
              href="/internal/trackers"
              className={`${styles.link} ${
                pathname === "/internal/trackers"
                  ? styles.active
                  : ""
              }`}
              onClick={onClose}
            >
              <Tracker />
              <div className={styles.linkName}>Trackers</div>
            </Link>

            <Link
              href="/internal/outreach"
              className={`${styles.link} ${
                pathname === "/internal/outreach"
                  ? styles.active
                  : ""
              }`}
              onClick={onClose}
            >
              <OutreachIcon />
              <div className={styles.linkName}>Outreach</div>
            </Link>

            <Link
              href="/internal/trends"
              className={`${styles.link} ${
                pathname === "/internal/trends"
                  ? styles.active
                  : ""
              }`}
              onClick={onClose}
            >
              <EventTrends />
              <div className={styles.linkName}>Event Trends</div>
            </Link>
          </div>
        </div>
        <div className={styles.footer}>
          <Link
            href="#"
            className={`${styles.link} ${
              pathname === "/notification"
                ? styles.active
                : ""
            }`}
            onClick={signOut}
          >
            <Image
              src={logoutIcon}
              alt="logout"
              width={20}
              height={20}
              className={`${styles.icons} ${iconClass}`}
            />
            <div className={`${styles.linkName} `}>Logout</div>
          </Link>

          <div className={styles.link}>
            <div className={styles.toggle_container}>
              <label className={styles.switch}>
                <input type="checkbox" onClick={themeSwitchHandler} checked={theme === "dark"? true : false} />
                <span className={styles.slider}></span>
              </label>
            </div>
            <span>Dark Theme</span>
          </div>
        </div>
      </div>
  );
};

export default MobileSidebar;
