"use client";
import React, { useState } from "react";
import styles from "./billing.module.css";
import Image from "next/image";
import BillingIcon from "/public/billingIcon.svg";
import BillingAccountIcon from "/public/billingAccountIcon.svg";
import BillingDetailsComponent from "@/app/components/settings/billingDetails/BillingDetails";
import Timer from "/public/timer.svg";
import { useTheme } from "@/context";
const Page = () => {
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";
  const [activeTab, setActiveTab] = useState("Billing Details");
  return (
    <div className={styles.container}>
      <div
        className={`${styles.navContainerLeft} ${
          theme === "light" && styles.navContainerLeft_light
        }`}
      >
        <div
          className={`${styles.comapny_container} ${styles.tabContainer} ${activeTab == "Billing Details" ? styles.active : ""
            }`}
          onClick={() => setActiveTab("Billing Details")}
        >
          <div>
            <Image
              className={`${iconClass}`}
              src={BillingIcon}
              alt="billing icon"
            />
          </div>
          <div className={styles.text}>Billing Details</div>
        </div>
        <div
          className={`${styles.comapny_container} ${styles.tabContainer} ${activeTab == "Billing Account Management" ? styles.active : ""
            }`}
          onClick={() => setActiveTab("Billing Account Management")}
        >
          <Image
            className={`${iconClass}`}
            src={BillingAccountIcon}
            alt="team icon"
          />
          <div className={styles.text}>Billing Account Management</div>
        </div>

        <div
          className={`${styles.comapny_container} ${styles.tabContainer} ${activeTab == "Invoices and Payments" ? styles.active : ""
            }`}
          onClick={() => setActiveTab("Invoices and Payments")}
        >
          <Image className={`${iconClass}`} src={Timer} alt="team icon" />
          <div className={styles.text}>Invoices and Payments</div>
        </div>
      </div>
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
