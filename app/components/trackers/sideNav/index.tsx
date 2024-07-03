"use client"
import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from "next/navigation";
import Back from '/public/back.svg';
import { baseUrl } from '@/constants';
import { myFetch } from '@/utils/myFetch';
import Settings from '/public/trackerSetting.svg';
import Manage from '/public/manageTracker.svg';
// import Link from "next/link";
import Image from "next/image";
import styles from './sideNav.style.module.css';
import Link from 'next/link';
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';
const Index = () => {
  const pathName = usePathname().split('/');
  const last = pathName[pathName.length - 1];
  const secondLast = pathName[pathName.length - 2];
  console.log(secondLast);
  const router = useRouter()
  const [trackerSection, setTrackerSection] = useState("Tracked Events");
  useEffect(() => {
    if (last === "trackedEvents") setTrackerSection("Tracked Events")
    if (last === "trackedConfiguration" || last === "editTracker") setTrackerSection("Tracker Configurations")
    if (last === "notesDiscussion") setTrackerSection("Notes & Discussions")
    if (last === "savedEvents") setTrackerSection("Saved Events")
    if (last === "manageAccess") setTrackerSection("Manage Access")
  }, [last])
  console.log(trackerSection);
  const [data, setData] = useState<any>([]);
  useEffect(() => {
    const fetchData = async () => {
      const url = `${baseUrl}/tracker/${secondLast}`;
      try {
        const { data, error } = await myFetch(url, {
          method: 'GET'
        });
        if (error) {
          console.error('Error fetching data:', error);
        } else {
          console.log('Data fetched:', data);
          setData(data);
        }
      } catch (err) {
        console.error('Fetch failed:', err);
      }
    };

    fetchData();
  }, [secondLast]);
  return (
    <>
      <div className={styles.bar}>
        <div className={styles.leftNav}>
          <Link className={styles.bottom} href={
            last === "trackedConfiguration" || last === "editTracker" || last === "manageAccess"
              ? (last === "editTracker"
                ? `/internal/trackers/${secondLast}/trackedConfiguration`
                : `/internal/trackers/${secondLast}/trackedEvents`)
              : '/internal/trackers'
          } >
            <Image style={{ display: "flex" }} src={Back} alt="back" />
          </Link>
          {/* <div className={styles.tooltipContainer} style={{cursor: data?.tracker?.name?.length>20?"pointer":"default"}}>
          {data?.tracker?.name?.length>20?data?.tracker?.name?.substring(0,20)+'...':data?.tracker?.name}
        {data?.tracker?.name?.length>20 && <span className={styles.tooltipText}>{data?.tracker?.name}</span>}  
  
</div> */}
        </div>
       
          <>
            <div className={styles.leftContainer}>
              <Link href={`/internal/trackers/${secondLast}/trackedEvents`}>
                <div className={`${styles.heading} ${trackerSection === "Tracked Events" ? styles.active : ""}`} onClick={() => setTrackerSection("Tracked Events")}>
                  Tracked Events
                </div>
              </Link>

              <Link href={`/internal/trackers/${secondLast}/notesDiscussion`}>
                <div className={`${styles.heading} ${trackerSection === "Notes & Discussions" ? styles.active : ""}`} onClick={() => setTrackerSection("Notes & Discussions")}>
                  Notes & Discussions
                </div>
              </Link>
              <Link href={`/internal/trackers/${secondLast}/savedEvents`}>
                <div className={`${styles.heading} ${trackerSection === "Saved Events" ? styles.active : ""}`} onClick={() => setTrackerSection("Saved Events")}>
                  Saved Events
                </div>
              </Link>

            </div>
            <div className={styles.configAccess}>
              <Link href={`/internal/trackers/${secondLast}/trackedConfiguration`}>
                <div style={{padding:"10px", display:"flex"}} className={`${styles.heading} ${styles.tooltipContainer} ${trackerSection === "Tracker Configurations" ? styles.active : ""}`}onClick={() => setTrackerSection("Tracker Configurations")}>
                  <Image src={Settings} alt="setting" /> 
                  <span className={styles.tooltipText}>Configurations</span>
                </div>
              </Link>
              <Link href={`/internal/trackers/${secondLast}/manageAccess`}>
                <div style={{padding:"10px", display:"flex"}} className={`${styles.heading} ${styles.tooltipContainer} ${trackerSection === "Manage Access" ? styles.active : ""}`} onClick={() => setTrackerSection("Manage Access")}>
                  <Image src={Manage} alt="setting" /> 
                  <span className={styles.tooltipText}>Manage Access</span>
                </div>
              </Link>
            </div>
          </>
        

      </div>
    </>
  )
}

export default Index
