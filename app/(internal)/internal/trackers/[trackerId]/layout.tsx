"use client";
import React, { useState, useEffect } from "react";
import styles from "./layout.style.module.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/context/theme";
import Image from "next/image";
import MoreIcon from "/public/dots.svg";
import Add from "/public/add.svg";
function Location({ fillColor }:{fillColor:string}) {
  return (
    <svg  xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" fill={fillColor} /></svg>
  )
}
const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname().split('/');
  const last=pathName[pathName.length-1];
const router = useRouter()
const [trackerSection,setTrackerSection]=useState("Tracked Events");
useEffect(()=>{
  if(last==="trackedEvents") setTrackerSection("Tracked Events")
  if(last==="trackedConfiguration") setTrackerSection("Tracker Configurations")
  if(last==="notesDiscussion") setTrackerSection("Notes & Discussions")
  if(last==="savedEvents") setTrackerSection("Saved Events")
  if(last==="manageAccess") setTrackerSection("Manage Access")
},[])
console.log(trackerSection);
  return (
    <div className={`${styles.container}`}>
        <div className={styles.bar}>
            <div className={styles.leftNav}>
            Events in Bangalore
            </div>
            <div className={styles.rightNav}>
                <div className={styles.rightNavInner }>
                  <Location fillColor="#696B83"/>
                  Bengaluru, Karnataka, India (1.34 mi radius) 
                  </div>
            </div>
        </div>
        <div className={styles.containerBottom}>
      <div className={styles.containerLeft}>
        <div className={styles.leftContainer}>
          <Link href='/internal/trackers/1/trackedEvents'>
          <div className={`${styles.heading} ${trackerSection === "Tracked Events" ? styles.active : ""}`} onClick={() => setTrackerSection("Tracked Events")}>
            Tracked Events
          </div>
          </Link>
          <Link href='/internal/trackers/1/trackedConfiguration'>
          <div className={`${styles.heading} ${trackerSection === "Tracker Configurations" ? styles.active : ""}`} onClick={() => setTrackerSection("Tracker Configurations")}>
            Tracker Configurations
          </div>
          </Link>
          <Link href='/internal/trackers/1/notesDiscussion'>
          <div className={`${styles.heading} ${trackerSection === "Notes & Discussions" ? styles.active : ""}`} onClick={() => setTrackerSection("Notes & Discussions")}>
          Notes & Discussions
          </div>
          </Link>
          <Link href='/internal/trackers/1/savedEvents'>
          <div className={`${styles.heading} ${trackerSection === "Saved Events" ? styles.active : ""}`} onClick={() => setTrackerSection("Saved Events")}>
          Saved Events
          </div>
          </Link>
          <div className={`${styles.heading} ${trackerSection === "Manage Access" ? styles.active : ""}`} onClick={() => setTrackerSection("Manage Access")}>
          Manage Access
          </div>
        </div>
      </div>
      <div className={styles.containerRight}>
      {children}
      </div>
    </div>
      
    </div>
  );
};

export default Layout;