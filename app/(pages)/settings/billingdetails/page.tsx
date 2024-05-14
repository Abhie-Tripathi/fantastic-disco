"use client";
import React, { useState } from "react";
import styles from "./billing.module.css";
import Image from "next/image";
import { usePathname } from "next/navigation";
import SettingsSidebar from '@/app/components/settingsSidebar'
import BillingIcon from "/public/billingIcon.svg";
import BillingAccountIcon from "/public/billingAccountIcon.svg";
import BillingDetailsComponent from "@/app/components/settings/billingDetails/BillingDetails";
import Timer from "/public/timer.svg";
import { useTheme } from "@/context";
const Page = () => {
  const {theme}=useTheme();
  // const [sideValue, setSideValue] = useState<{ text: string; }[]>
  // const { theme } = useTheme();
  const sideValue = [
    { text: "Billing Details" },
      { text: "Billing Account Management" },
      {text:"Invoices and Payments"}
  ];
  // setSideValue(updatedSideValue);
  const iconClass = theme === "light" ? "icons_light" : "icon";
  const [activeTab, setActiveTab] = useState("Billing Details");
  return (
    <div className={styles.container}>
      
      <SettingsSidebar sideVal={sideValue} active={activeTab} 
      setActive={setActiveTab}/>
     
      <div className={styles.rightContainer}>
        {activeTab === "Billing Details" ? <BillingDetailsComponent /> : ""}

        {activeTab === "Billing Account Management" ? (
          <div className={styles.navContainerRight}>
            <div className={styles.gradient_border}>
              Billing Account Management
            </div>
          </div>
        ) : (
          ""
        )}
        {activeTab === "Pricing Plans" ? (
          <div className={styles.navContainerRight}>
            <div className={styles.gradient_border}>Pricing Plans</div>
          </div>
        ) : (
          ""
        )}

        {activeTab === "Invoices and Payments" ? (
          <div className={styles.navContainerRight}>
            <div className={styles.gradient_border}>Invoices and Payments</div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Page;
