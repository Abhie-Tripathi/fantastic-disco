"use client";
import React, { useState } from "react";
import styles from "./pricing.module.css";
import Image from "next/image";
import BillingIcon from "/public/billingIcon.svg";
import BillingAccountIcon from "/public/billingAccountIcon.svg";
import CurrentPlan from "@/app/components/settings/pricingPlans/currentPlans";
import AvailablePlans from "@/app/components/settings/pricingPlans/availablePlans";
const page = () => {
  const [activeTab, setActiveTab] = useState("Current Plan");
  return (
    <div className={styles.container}>
      <div className={styles.navContainerLeft}>
        <div
          className={`${styles.comapny_container} ${styles.tabContainer} ${
            activeTab == "Current Plan" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("Current Plan")}
        >
          <div>
            <Image src={BillingIcon} alt="billing icon" />
          </div>
          <div className={styles.text}>Current Plan</div>
        </div>
        <div
          className={`${styles.comapny_container} ${styles.tabContainer} ${
            activeTab == "Available Plans" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("Available Plans")}
        >
          <Image src={BillingAccountIcon} alt="team icon" />
          <div className={styles.text}>Available Plans</div>
        </div>
      </div>

      {activeTab === "Current Plan" ? <CurrentPlan /> : ""}

      {activeTab === "Available Plans" ? (
        <AvailablePlans />
      ) : (
        ""
      )}
    </div>
  );
};

export default page;
