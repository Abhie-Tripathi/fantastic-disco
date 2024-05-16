"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.style.module.css";
import TrackerCard from "@/app/components/internal/trackers/TrackerCard";

const Trackers = () => {
  return (
    <div className={styles.body}>
      <div className={styles.trackers_card_container}>
        <TrackerCard />
        <TrackerCard />
        <TrackerCard />
        <TrackerCard />
      </div>
    </div>
  );
};

export default Trackers;
