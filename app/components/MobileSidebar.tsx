"use client";
import React, { useEffect, useState } from "react";
import styles from "./MobileSidebar.module.css";
import Link from "next/link";
import Image from "next/image";
import Dashboard from "/public/internal/dashboard.svg";
import Trend from "/public/internal/trend.svg";
import Research from "/public/internal/research.svg";
import DatasetIcon from "/public/dataset.svg";
import Exhibit from "/public/internal/exhibit.svg";
import { usePathname } from "next/navigation";
import Graph from "/public/internal/trend.svg";
import { useAuthContext, useTheme } from "@/context";
import closeIcon from "/public/close.svg";
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
            className={`${styles.link} ${styles.header}`}
            style={{
              display: "flex",
              gap: "18px",
              position: "relative",
            }}
            // ref={profilectas.dropdownRef}
            // onClick={toggleDropdown}
          >
            <div className={styles.circle} data-name="Username">
              {userDetail?.firstname.charAt(0)}
              {userDetail?.lastname.charAt(0)}
              {/* AM */}
            </div>
            <div className={styles.userDetails}>
              <div>
                {userDetail?.firstname} {userDetail?.lastname}
                {/* Ashwani M. */}
              </div>
              <div style={{ fontSize: "14px" }}>
                {userDetail?.email}
                {/* user@email.com */}
              </div>
            </div>
          </div>
          <span className={styles.closeIcon} onClick={onClose}>
            X
          </span>
        </div>

        <div className={styles.links}>
          <Link
            href="/"
            className={`${styles.link} ${
              pathname === "/"
                ? theme === "light"
                  ? styles.activeLink_light
                  : styles.activeLink
                : ""
            }`}
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
                ? theme === "light"
                  ? styles.activeLink_light
                  : styles.activeLink
                : ""
            }`}
            onClick={onClose}
          >
            <Image src={Dashboard} alt="dashboard" className={styles.icons} />
            <div className={styles.linkName}>Dashboard</div>
          </Link>
          <Link
            href="/internal/coordinate"
            className={`${styles.link} ${
              pathname === "/internal/coordinate"
                ? theme === "light"
                  ? styles.activeLink_light
                  : styles.activeLink
                : ""
            }`}
            onClick={onClose}
          >
            <Image
              src={DatasetIcon}
              alt="coordinate"
              className={styles.icons}
            />
            <div className={styles.linkName}>Coordinate</div>
          </Link>
          <Link
            href="/internal/search/events"
            className={`${styles.link} ${
              pathname === "/internal/search/events"
                ? theme === "light"
                  ? styles.activeLink_light
                  : styles.activeLink
                : ""
            }`}
            onClick={onClose}
          >
            <Image src={Research} alt="location" className={styles.icons} />
            <div className={styles.linkName}>Research</div>
          </Link>
          <Link
            href="/internal/trackers"
            className={`${styles.link} ${
              pathname === "/internal/trackers"
                ? theme === "light"
                  ? styles.activeLink_light
                  : styles.activeLink
                : ""
            }`}
            onClick={onClose}
          >
            <Image src={Trend} alt="location" className={styles.icons} />
            <div className={styles.linkName}>Trackers</div>
          </Link>
          <Link
            href="/internal/outreach"
            className={`${styles.link} ${
              pathname === "/internal/outreach"
                ? theme === "light"
                  ? styles.activeLink_light
                  : styles.activeLink
                : ""
            }`}
            onClick={onClose}
          >
            <Image src={Exhibit} alt="location" className={styles.icons} />
            <div className={styles.linkName}>Outreach</div>
          </Link>
          <Link
            href="/internal/trends"
            className={`${styles.link} ${
              pathname === "/internal/trends"
                ? theme === "light"
                  ? styles.activeLink_light
                  : styles.activeLink
                : ""
            }`}
            onClick={onClose}
          >
            <Image src={Graph} alt="location" className={styles.icons} />
            <div className={styles.linkName}>Event Trends</div>
          </Link>
        </div>
      </div>
      <div className={styles.footer}>
        <Link
          href="#"
          className={`${styles.link} ${
            pathname === "/notification"
              ? theme === "light"
                ? styles.activeLink_light
                : styles.activeLink
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
              <input type="checkbox" onClick={themeSwitchHandler} />
              <span className={styles.slider}></span>
            </label>
          </div>
          <span>Light Mode</span>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
