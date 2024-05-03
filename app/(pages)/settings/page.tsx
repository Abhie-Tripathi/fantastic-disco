"use client";
import React, { useState } from "react";
import styles from "./setting.module.css";
import Image from "next/image";
import DepartmentIcon from "/public/departmentIcon.svg";
import TeamIcon from "/public/teamIcon.svg";
const Page = () => {
  const [activeTab, setActiveTab] = useState("Department");

  return (
    <div className={styles.container}>
      <div className={styles.navContainerLeft}>
        <div
          className={`${styles.comapny_container} ${styles.tabContainer} ${
            activeTab == "Department" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("Department")}
        >
          <div>
            <Image src={DepartmentIcon} alt="department icon" />
          </div>
          <div className={styles.text}>Department</div>
        </div>
        <div
          className={`${styles.comapny_container} ${styles.tabContainer} ${
            activeTab == "Team" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("Team")}
        >
          <Image src={TeamIcon} alt="team icon" />
          <div className={styles.text}>Team</div>
        </div>
      </div>

      {activeTab === "Department" ? (
        <div className={styles.navContainerRight}>
          <div className={styles.gradient_border}>Department</div>
        </div>
      ) : (
        ""
      )}

      {activeTab === "Team" ? (
        <div className={styles.navContainerRight}>
          <div className={styles.gradient_border}>Team</div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Page;
