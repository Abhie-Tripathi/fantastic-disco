import React, { useState } from "react";
import styles from "./wigitCard.module.css";
import Image from "next/image";
import Calendar from "/public/vector.svg";

const index = () => {
  const [activeState, setActiveState] = useState("Active");
  return (
    <div className={styles.container}>
      <div className={styles.outerDiv}>
        <div className={styles.widgetText}>Hero Widget</div>
        <div className={styles.stickyTopSec}>Sticky top</div>
        <div className={styles.statusBtn}>
          <div
            className={`${styles.activeFlag} ${
              activeState === "Inactive" ? styles.inactiveFlag : ""
            }`}
          ></div>
          <div
            className={`${styles.status} ${
              activeState === "Inactive" ? styles.inactiveStatus : ""
            }`}
          >
            {activeState}
          </div>
        </div>
      </div>

      <div className={styles.secondSec}>
        <div className={styles.eventDetail}>
          <div style={{ display: "flex" }}>
            <Image src={Calendar} alt="calendar" />
          </div>
          <div className={styles.date}>1st Apr 2024</div>
          <div>-</div>
          <div className={styles.date}>30th Apr 2024</div>
        </div>
        <div className={styles.geographyText}>Geography India</div>
        <div className={styles.geographyText}>Geography India</div>
      </div>

      <div className={styles.thirdSec}>
        <div className={styles.buttonContainer}>Configure</div>
      </div>
    </div>
  );
};

export default index;
