"use client";
import React, { useState } from "react";
import styles from "./pricing.module.css";
import Image from "next/image";
import BillingIcon from "/public/billingIcon.svg";
import SettingsSidebar from '@/app/components/settingsSidebar'
import BillingAccountIcon from "/public/billingAccountIcon.svg";
import CurrentPlan from "@/app/components/settings/pricingPlans/currentPlans";
import { useTheme } from "@/context";
import AvailablePlans from "@/app/components/settings/pricingPlans/availablePlans";
const Page = () => {
  const [activeTab, setActiveTab] = useState("Current Plan");
  const {theme}=useTheme(); 
  const sideValue = [
    { text: "Current Plan" },
    { text: "Available Plans" },
  ];
  // setSideValue(updatedSideValue);
  console.log(11111111111111+activeTab);
  
  const iconClass = theme ===  'light' ? 'icons_light' : 'icon'
  return (
    <div className={styles.container}>
       <SettingsSidebar sideVal={sideValue} active={activeTab} 
      setActive={setActiveTab}/>
      {/* <div className={`${styles.navContainerLeft} ${theme === 'light' && styles.navContainerLeft_light}`}>
        <div
          className={`${styles.comapny_container} ${styles.tabContainer} ${
            activeTab == "Current Plan" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("Current Plan")}
        >
          <div>
            <Image className={`${iconClass}`}  src={BillingIcon} alt="billing icon" />
          </div>
          <div className={styles.text}>Current Plan</div>
        </div>
        <div
          className={`${styles.comapny_container} ${styles.tabContainer} ${
            activeTab == "Available Plans" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("Available Plans")}
        >
          <Image className={`${iconClass}`}  src={BillingAccountIcon} alt="team icon" />
          <div className={styles.text}>Available Plans</div>
        </div>
      </div> */}

      {activeTab === "Current Plan" ? <CurrentPlan /> : ""}

      {activeTab === "Available Plans" && 
        <AvailablePlans />
      }
    </div>
  );
};

export default Page;
