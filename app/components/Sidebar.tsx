"use client";
import React, { useState } from "react";
import styles from "./sidebar.style.module.css";
import Link from "next/link";
import Image from "next/image";
import Dashboard from '/public/internal/dashboard.svg'
import Trend from '/public/internal/trend.svg'
import Research from '/public/internal/research.svg'
import Exhibit from '/public/internal/exhibit.svg'
import { usePathname } from "next/navigation";
const Sidebar = () => {
  const pathname = usePathname();
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div
      className={`${styles.container} ${showSidebar ? styles.open : ""}`}
      onMouseEnter={() => setShowSidebar(true)}
      onMouseLeave={() => setShowSidebar(false)}
    >
      <div className={styles.links}>
        {/* <div className={styles.homebtn}>
          <Image src={AddIcon} alt="herologo" width={45} />
          <Image src={AddIcon} alt="herotext" width={144} />
        </div> */}
        <Link
          href="/"
          className={`${styles.link} ${
            pathname === "/dashboard" ? styles.activeLink : ""
          }`}
        >
          <Image src={Dashboard} alt="dashboard" className={styles.icons} />
          <div className={styles.linkName}>Dashboard</div>
        </Link>
        <Link
          href="/research"
          className={`${styles.link} ${
            pathname === "/research" ? styles.activeLink : ""
          }`}
        >
          <Image src={Research} alt="location" className={styles.icons} />
          <div className={styles.linkName}>Research</div>
        </Link>
        <Link
          href="/internal/trackers"
          className={`${styles.link} ${
            pathname === "/internal/trackers" ? styles.activeLink : ""
          }`}
        >
          <Image src={Trend} alt="location" className={styles.icons} />
          <div className={styles.linkName}>Trackers</div>
        </Link>
        <Link
          href="/internal/outreach"
          className={`${styles.link} ${
            pathname === "/coordinate/outreach" ? styles.activeLink : ""
          }`}
        >
          <Image src={Exhibit} alt="location" className={styles.icons} />
          <div className={styles.linkName}>Outreach</div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;