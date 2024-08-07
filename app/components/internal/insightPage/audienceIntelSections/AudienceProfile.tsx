import React from "react";
import styles from "./audienceprofile.style.module.css";
import ProgressBar from "@/app/components/UI/progressBar";

const AudienceProfile = () => {
  return (
    <div className={`${styles.audienceCard} card`}>
      <div className={styles.cardHeading}>Audience Profile</div>
      <div className={`${styles.audienceSubCard} card`}>
        <div className={styles.cardHeading}>Most interested Dept</div>
        <ProgressBar value={95} label="Marketing" />
      </div>
      <div className={styles.otherProfiles}>
        Other profiles
        <ProgressBar value={82} label="CEO" />
        <ProgressBar value={55} label="Manager" />
        <ProgressBar value={16} label="Student" />
      </div>
    </div>
  );
};
export default AudienceProfile;
