"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { Step } from "react-joyride";
import JoyRideCustom from "../internal/walkthrough/JoyRideCustom";

const Sidebar = () => {
  const pathName = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState<Boolean>(false);
  const { theme } = useTheme();
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);

  const dashboardRef = useRef(null);
  const researchRef = useRef(null);
  const trendsRef = useRef(null);
  const trackerRef = useRef(null);
  const coordinateRef = useRef(null);
  const outreachRef = useRef(null);

  const getActiveClass = (path: string) => {
    return pathName === path
      ? `${styles.active} ${
          theme === "dark" ? "darkMode_secondary" : "lightMode_secondary"
        }`
      : "";
  };

  const updateSteps = useCallback(() => {
    const newSteps: Step[] = [];

    if (dashboardRef.current) {
      console.log("ref", dashboardRef);
      newSteps.push({
        target: dashboardRef.current,
        title: "Dashboard",
        content:
          "Stay informed with our dashboard—your hub for overall and latest updates.",
        disableBeacon: true,
        placement: "auto",
        spotlightPadding: 10,
      });
    }

    if (researchRef.current) {
      newSteps.push({
        target: researchRef.current,
        title: "Research",
        content:
          "Discover insights on business trends filtered by geography and category, all in one glance.",
        disableBeacon: true,
        placement: "auto",
      });
    }

    if (trendsRef.current) {
      newSteps.push({
        target: trendsRef.current,
        title: "Event Trends",
        content:
          "Explore the global trends of business events among multiple categories.",
        disableBeacon: true,
        placement: "auto",
      });
    }

    if (trackerRef.current) {
      newSteps.push({
        target: trackerRef.current,
        title: "Tracker",
        content:
          "Track key events in real-time to make informed decisions and seize opportunities as they arise.",
        disableBeacon: true,
        placement: "auto",
      });
    }

    if (coordinateRef.current) {
      newSteps.push({
        target: coordinateRef.current,
        title: "Coordinate",
        content:
          "  An effective event communication and relationship management dashboard that keeps your team on the same page and makes coordination both internally and with events team easy and manageable.",
        disableBeacon: true,
        placement: "auto",
      });
    }

    if (outreachRef.current) {
      newSteps.push({
        target: outreachRef.current,
        title: "Outreach",
        content:
          "Connect efficiently with stakeholders and amplify engagement.",
        disableBeacon: true,
        placement: "auto",
      });
    }

    setSteps(newSteps);
  }, []);

  useEffect(() => {
    if (pathName === "/internal") {
      const walkthroughCompleted: string[] = JSON.parse(
        localStorage.getItem("walkthroughCompleted") || "[]"
      );

      if (!walkthroughCompleted.includes("internal")) {
        updateSteps();
        setRun(true);
      }
    }
  }, [updateSteps]);

  useEffect(() => {
    if (run) {
      setIsSidebarOpen(true);
    }
  }, [run]);

  const handleFinishWalkThrough = () => {
    setRun(false);
    setIsSidebarOpen(false);
  };

  const handleMouseEnter = () => {
    if (!run) {
      setIsSidebarOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!run) {
      setIsSidebarOpen(false);
    }
  };
  return (
    <div
      className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""} ${
        theme === "dark" ? "darkMode" : ""
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {steps.length > 0 && (
        <JoyRideCustom
          steps={steps}
          run={run}
          onFinish={handleFinishWalkThrough}
          pathName="internal"
        />
      )}
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

      <Link
        href="/internal"
        className={`${styles.link} ${getActiveClass("/internal")}`}
        ref={dashboardRef}
      >
        <div ref={dashboardRef}>
          <DashboardIcon />
        </div>
        <div className={styles.linkName}>Dashboard</div>
      </Link>

      <Link
        href="/internal/search/events"
        className={`${styles.link} ${getActiveClass(
          "/internal/search/events"
        )}`}
        ref={researchRef}
      >
        <SearchIcon />
        <div className={styles.linkName}>Research</div>
      </Link>

      <Link
        href="/internal/trends"
        className={`${styles.link} ${getActiveClass("/internal/trends")}`}
        ref={trendsRef}
      >
        <EventTrends />
        <div className={styles.linkName}>Event Trends</div>
      </Link>

      <Link
        href="/internal/trackers"
        className={`${styles.link} ${getActiveClass("/internal/trackers")}`}
        ref={trackerRef}
      >
        <Tracker />
        <div className={styles.linkName}>Trackers</div>
      </Link>

      <Link
        href="/internal/coordinate"
        className={`${styles.link} ${getActiveClass("/internal/coordinate")}`}
        ref={coordinateRef}
      >
        <CoordinateIcon />
        <div className={styles.linkName}>Coordinate</div>
      </Link>

      <Link
        href="/internal/outreach"
        className={`${styles.link} ${getActiveClass("/internal/outreach")}`}
        ref={outreachRef}
      >
        <OutreachIcon />
        <div className={styles.linkName}>Outreach</div>
      </Link>
    </div>
  );
};
export default Sidebar;
