"use client";
import React, { useState } from "react";
import styles from "./setting.module.css";
import SettingIcon from "/public/settingIcon.svg";
import Image from "next/image";
import CompanyIcon from "/public/company.svg";
import BillingIcon from "/public/billin.svg";
import ConffigIcon from "/public/config.svg";
import UserManagemant from "/public/userManagement.svg";
import Company from "@/app/components/company";
import Configuration from "@/app/components/configurations";
const page = () => {
  const [activeTab, setActiveTab] = useState<string>("Company");
  return (
    <div className={styles.container}>
      <div className={styles.outerDiv}>
        <div className={styles.settingContainer}>
          <Image src={SettingIcon} alt="setting icon" />
          <div className={styles.settingFonts}>Setting</div>
          <div className={styles.superAdminFont}> Super Admin</div>
        </div>

        <div className={styles.tabsContainer}>
          <div
            className={`${styles.comapny_container} ${styles.tabContainer} ${
              activeTab == "Company" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("Company")}
          >
            <Image src={CompanyIcon} alt="company icon" />
            <div>Company</div>
          </div>
          <div
            className={`${styles.comapny_container} ${styles.tabContainer} ${
              activeTab == "Billing and Plans" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("Billing and Plans")}
          >
            <Image src={BillingIcon} alt="company icon" />
            <div>Billing and Plans</div>
          </div>
          <div
            className={`${styles.comapny_container} ${styles.tabContainer} ${
              activeTab == "Configurations" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("Configurations")}
          >
            <Image src={ConffigIcon} alt="company icon" />
            <div>Configurations</div>
          </div>
          <div
            className={`${styles.comapny_container} ${styles.tabContainer} ${
              activeTab == "User Management" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("User Management")}
          >
            <Image src={UserManagemant} alt="user management" />
            <div>User Management</div>
          </div>
        </div>
      </div>

      <div className={styles.innerDiv}>
        {activeTab === "Company" ? <Company /> : ""}
        {activeTab === "Configurations" ? <Configuration /> : ""}
      </div>
    </div>
  );
};

export default page;
