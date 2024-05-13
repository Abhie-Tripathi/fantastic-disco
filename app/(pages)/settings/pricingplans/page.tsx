"use client";
import React, { useState } from "react";
import styles from "./pricing.module.css";
import Image from "next/image";
import BillingIcon from "/public/billingIcon.svg";
import BillingAccountIcon from "/public/billingAccountIcon.svg";
import CurrentPlan from "@/app/components/settings/pricingPlans/currentPlans";
import { useTheme } from "@/context";
import AvailablePlans from "@/app/components/settings/pricingPlans/availablePlans";
import Link from "next/link";
const Page = () => {
  const [activeTab, setActiveTab] = useState("Current Plan");
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";
  return (
    <div className={styles.container}>
      <div
        className={`${styles.navContainerLeft} ${
          theme === "light" && styles.navContainerLeft_light
        }`}
      >
        <div
          className={`${styles.comapny_container} ${styles.tabContainer} ${
            activeTab == "Current Plan" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("Current Plan")}
        >
          <div>
            <Image
              className={`${iconClass}`}
              src={BillingIcon}
              alt="billing icon"
            />
          </div>

          <Link href="#current_plan" className={styles.text}>
            Current Plan
          </Link>
        </div>
        <div
          className={`${styles.comapny_container} ${styles.tabContainer} ${
            activeTab == "Available Plans" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("Available Plans")}
        >
          <Image
            className={`${iconClass}`}
            src={BillingAccountIcon}
            alt="team icon"
          />
          <Link href="#our_pricing_plans" className={styles.text}>Available Plans</Link>
        </div>
      </div>

      <div className={styles.rightContainer}>
        {activeTab === "Current Plan" ? <CurrentPlan /> : ""}

        {activeTab === "Available Plans" ? <AvailablePlans /> : ""}
      </div>
    </div>
  );
};

export default Page;
