import React from "react";
import styles from "./pasteditions.style.module.css";

const PastEditions = () => {
  return (
    <div className={`${styles.cardsContainer} card`} style={{ width: "50%" }}>
      <div className={styles.heading}>Past Editions</div>
      <div className={`${styles.pastEditionCards} ${styles.blurContent}`}>
        <div className={`${styles.editionCard} card`}>Milano PharmaTech & LabTech Expo</div>
        <div className={`${styles.editionCard} card`}>Milano PharmaTech & LabTech Expo</div>
        <div className={`${styles.editionCard} card`}>Milano PharmaTech & LabTech Expo</div>
        <div className={`${styles.editionCard} card`}>Milano PharmaTech & LabTech Expo</div>
      </div>
    </div>
  );
};
export default PastEditions;
