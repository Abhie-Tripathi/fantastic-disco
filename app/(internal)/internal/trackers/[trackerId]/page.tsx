"use client";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from './page.style.module.css';
import Image from "next/image";
import MoreIcon from "/public/dots.svg";
import TrackerDetails from "@/app/components/internal/trackers/TrackerDetails/TrackerDetails";

const TrackerPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const editTrackerHandler = () => {
    const params = new URLSearchParams(searchParams);
    params.set("categories", "festivals");
    params.set("location", "chicago");
    params.set("status", "ACTIVE");
    router.push(`/trackers/create?${params.toString()}`);
  };

  return (
    <div>
      <div className={styles.trackers_container}>
        <div className={styles.trackers_header}>
          <div className={styles.trackers_header_title}>
            Events in Bangalore
          </div>
          <div className={styles.trackers_header_more_button}>
            <Image src={MoreIcon} alt="moreicon" />
          </div>
          <button
            onClick={editTrackerHandler}
            className={styles.trackers_header_newtracker_button}
          >
            <div>Edit Tracker</div>
          </button>
        </div>
      </div>

      <TrackerDetails />
    </div>
  );
};

export default TrackerPage;