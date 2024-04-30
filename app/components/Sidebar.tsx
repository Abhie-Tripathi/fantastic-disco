"use client";
import React, { useState } from "react";
import styles from "./sidebar.style.module.css";
import Link from "next/link";
import Image from "next/image";
import Dashboard from '/public/internal/dashboard.svg'
import Trend from '/public/internal/trend.svg'
import Research from '/public/internal/research.svg'
import DatasetIcon from '/public/dataset.svg'
import Exhibit from '/public/internal/exhibit.svg'
import { usePathname } from "next/navigation";
import Graph from '/public/internal/trend.svg'
import { useTheme } from "@/context";

const Sidebar = () => {
  const pathname = usePathname();
  const [showSidebar, setShowSidebar] = useState(false);
  const { theme } = useTheme()

  return (
    <div
      className={`${styles.container} ${showSidebar ? styles.open : ""} ${theme === 'light' ? styles.container_light : ""}`}
      onMouseEnter={() => setShowSidebar(true)}
      onMouseLeave={() => setShowSidebar(false)}
    >
      <div className={styles.links}>
        {/* <div className={styles.homebtn}>
          <Image src={AddIcon} alt="herologo" width={45} />
          <Image src={AddIcon} alt="herotext" width={144} />
        </div> */}
        <Link
          href="/internal"
          className={`${styles.link} ${pathname === "/internal" ? styles.activeLink : ""
            }`}
        >
          <Image src={Dashboard} alt="dashboard" className={styles.icons} />
          <div className={styles.linkName}>Dashboard</div>
        </Link>
        <Link
          href="/internal/coordinate"
          className={`${styles.link} ${pathname === "/internal/coordinate" ? styles.activeLink : ""
            }`}
        >
          <Image src={DatasetIcon} alt="coordinate" className={styles.icons} />
          <div className={styles.linkName}>Coordinate</div>
        </Link>
        <Link
          href="/internal/search/events"
          className={`${styles.link} ${pathname === "/research" ? styles.activeLink : ""
            }`}
        >
          <Image src={Research} alt="location" className={styles.icons} />
          <div className={styles.linkName}>Research</div>
        </Link>
        <Link
          href="/internal/trackers"
          className={`${styles.link} ${pathname === "/internal/trackers" ? styles.activeLink : ""
            }`}
        >
          <Image src={Trend} alt="location" className={styles.icons} />
          <div className={styles.linkName}>Trackers</div>
        </Link>
        <Link
          href="/internal/outreach"
          className={`${styles.link} ${pathname === "/coordinate/outreach" ? styles.activeLink : ""
            }`}
        >
          <Image src={Exhibit} alt="location" className={styles.icons} />
          <div className={styles.linkName}>Outreach</div>
        </Link>
        <Link
          href="/internal/trends"
          className={`${styles.link} ${pathname === "/internal/trends" ? styles.activeLink : ""
            }`}
        >
          <Image src={Graph} alt="location" className={styles.icons} />
          <div className={styles.linkName}>Event Trends</div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;