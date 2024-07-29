"use client"
import React, { useState, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { GAEvent } from '@/utils/GAEvent';
import { useAuthContext } from '@/context';
const Index = () => {
  const pathName = usePathname().split('/');
  const last = pathName[pathName.length - 1];
  const searchParams = useSearchParams();
  const type  = searchParams.get('type');
  const secondLast = pathName[pathName.length - 2];
  const {setUser}=useAuthContext();
  const token = searchParams.get("token");
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
    if (token && token.length > 0) {
      const verifyToken = async () => {
        const formData = {
          token: token,
          invite: true,
        };
        const url = `${baseUrl}/auth/customer/reset-password/page`;
        try {
          const { data, error } = await myFetch(url, {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
              "Content-Type": "application/json",
            },
          });

          console.log("Data from signin", data);
          console.log("Error from signnin", error);
          if (error) {
            console.error("Error fetching data:", error);
            router.push("/signin");
          } else {
            console.log("Data fetched:", data);
            const { id, firstname, lastname, email, role, profilePicture } =
              data.info;
            const user = {
              user: {
                id: id,
                firstname: firstname,
                lastname: lastname,
                email: email,
                role: role,
                profilePicture: profilePicture,
              },
            };
            const userObject = {
              user: {
                id: id,
                firstname: firstname,
                lastname: lastname,
                email: email,
                role: role,
                profilePicture: profilePicture,
              },
            };
            setUser(data.info);
            localStorage.setItem("user",JSON.stringify(userObject));
          }
        } catch (err) {
          console.error("Fetch failed:", err);
          router.push("/signin");
        }
      };
      verifyToken();
    }
  }, [token]);
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
                ? `/internal/trackers/${secondLast}/trackedConfiguration?type=${type}`
                : `/internal/trackers/${secondLast}/trackedEvents?type=${type}`)
              : '/internal/trackers'
          } >
            <Image style={{ display: "flex" }} src={Back} alt="back" />
          </Link>
          <div className={styles.tooltipContainer} style={{ cursor: data?.tracker?.name?.length > 20 ? "pointer" : "default" }}>
            {data?.tracker?.name?.length > 20 ? data?.tracker?.name?.substring(0, 20) + '...' : data?.tracker?.name}
            {data?.tracker?.name?.length > 20 && <span className={styles.tooltipText}>{data?.tracker?.name}</span>}

          </div>
        </div>

        <>
          <div className={styles.leftContainer}>
            <Link href={`/internal/trackers/${secondLast}/trackedEvents?type=${type}`}
              onClick={() => {
                GAEvent(
                  "trackers",
                  "Tracker Detail",
                  "View",
                  "Tracked Events"
                )
              }}
            >
              <div className={`${styles.heading} ${trackerSection === "Tracked Events" ? styles.active : ""}`} onClick={() => setTrackerSection("Tracked Events")}>
                Tracked Events
              </div>
            </Link>

            <Link href={`/internal/trackers/${secondLast}/notesDiscussion?type=${type}`}
              onClick={() => {
                GAEvent(
                  "trackers",
                  "Tracker Detail",
                  "View",
                  "Notes and Discussion"
                )
              }}
            >
              <div className={`${styles.heading} ${trackerSection === "Notes & Discussions" ? styles.active : ""}`} onClick={() => setTrackerSection("Notes & Discussions")}>
                Notes & Discussions
              </div>
            </Link>
            <Link href={`/internal/trackers/${secondLast}/savedEvents?type=${type}`}
              onClick={() => {
                GAEvent(
                  "trackers",
                  "Tracker Detail",
                  "View",
                  "Saved Events"
                )
              }}
            >
              <div className={`${styles.heading} ${trackerSection === "Saved Events" ? styles.active : ""}`} onClick={() => setTrackerSection("Saved Events")}>
                Saved Events
              </div>
            </Link>

          </div>
          <div className={styles.configAccess}>
            <Link href={`/internal/trackers/${secondLast}/trackedConfiguration?type=${type}`}
              onClick={() => {
                GAEvent(
                  "trackers",
                  "Tracker Detail",
                  "View",
                  "Configuration"
                )
              }}>
              <div style={{ padding: "10px 5px", display: "flex" }} className={`${styles.heading} ${styles.tooltipContainer} ${trackerSection === "Tracker Configurations" ? styles.active : ""}`} onClick={() => setTrackerSection("Tracker Configurations")}>
                <Image src={Settings} alt="setting" />
                <span className={styles.tooltipText}>Configurations</span>
              </div>
            </Link>
            <Link href={`/internal/trackers/${secondLast}/manageAccess?type=${type}`}
              onClick={() => {
                GAEvent(
                  "trackers",
                  "Tracker Detail",
                  "View",
                  "User Access"
                )
              }}
            >
              <div style={{ padding: "10px 5px", display: "flex" }} className={`${styles.heading} ${styles.tooltipContainer} ${trackerSection === "Manage Access" ? styles.active : ""}`} onClick={() => setTrackerSection("Manage Access")}>
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
