"use client"
import React,{useState, useEffect} from 'react'
import { usePathname, useRouter } from "next/navigation";
import styles from './sideNav.style.module.css';
import Link from 'next/link';
const Index = () => {
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
  },[last])
console.log(trackerSection);

  return (
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
          <Link href='/internal/trackers/1/manageAccess'>
          <div className={`${styles.heading} ${trackerSection === "Manage Access" ? styles.active : ""}`} onClick={() => setTrackerSection("Manage Access")}>
          Manage Access
          </div>
          </Link>
        </div>
  )
}

export default Index
