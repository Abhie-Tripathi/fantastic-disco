import React, { useState } from "react";
import styles from "./pageWiget.module.css";
import Image from "next/image";
import Calendar from "/public/vector.svg";
import CloseEyeIcon from "/public/closeEyeIcon.svg";
import OpenEyeIcon from "/public/openEyeIcon.svg";
import DeleteBox from "/public/deleteBox.svg";

const Index = () => {
  const [activeState, setActiveState] = useState("Inactive");
  return (
    <div className={styles.container}>
      <div className={styles.outerDiv}>
        <div className={styles.widgetText}>Promotions</div>
        <div className={styles.stickyTopSec}>Page Widget</div>
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
        <div className={styles.geographyText}>Geography-India</div>
        <div className={styles.geographyText}>Type-Seminar</div>
      </div>

      <div className={styles.category}>
        <div className={styles.category_text}>
          Category- <span>Hospitality, Festival</span>{" "}
          <span>Format-Exhibition</span>
          <span>+6 more...</span>
        </div>
        <div></div>
      </div>

      <div className={styles.thirdSec}>
        <div className={styles.buttonContainer}>Configure</div>
        <div className={styles.icon_container}>
          {activeState === "Active" ? (
            <Image
              src={OpenEyeIcon}
              alt="open eye icon"
              onClick={() => {
                setActiveState("Inactive");
              }}
            />
          ) : (
            <Image
              src={CloseEyeIcon}
              alt="closed eye icon"
              onClick={() => {
                setActiveState("Active");
              }}
            />
          )}
          <Image src={DeleteBox} alt="delete icon" />
        </div>
      </div>
    </div>
  );
};

export default Index;
