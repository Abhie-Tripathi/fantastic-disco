"use client";
import React, { useState, useEffect } from "react";
import styles from "./billing.module.css";
import Image from "next/image";
import BillingIcon from "/public/billingIcon.svg";
import BillingAccountIcon from "/public/billingAccountIcon.svg";
import BillingDetailsComponent from "@/app/components/settings/billingDetails/BillingDetails";
import Timer from "/public/timer.svg";
import { useTheme } from "@/context";

interface Section {
  topic: string;
  boundingTop: number;
}


const Page = () => {
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";
  const [activeTab, setActiveTab] = useState("billing_details");

  const [activeSection, setActiveSection] = useState("billing_details");
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      let currentActive = "";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 200; // Adjust offset as needed

        const sectionHeight = section.clientHeight;
        if (
          window.scrollY >= sectionTop &&
          window.scrollY < sectionTop + sectionHeight
        ) {
          currentActive = section.id;
        }
      });
      setActiveSection(currentActive);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToSection(sectionId: string) {
    const target:any = document.getElementById(sectionId);
    const offsetTop = target.offsetTop - 100;

    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  }

  return (
    <div className={styles.container}>
      <div
        className={`${styles.navContainerLeft} ${
          theme === "light" && styles.navContainerLeft_light
        }`}
      >
        <div
          onClick={() => scrollToSection("billing_details")}
          className={`${styles.tabContainer} ${
            activeSection == "billing_details" ? styles.active : ""
          }`}
        >
          <div>
            <Image
              className={`${iconClass}`}
              src={BillingIcon}
              alt="billing icon"
            />
          </div>

          <div>Billing Details</div>
        </div>
        <div
          onClick={() => scrollToSection("billing_account_management")}
          className={`${styles.tabContainer} ${
            activeSection == "billing_account_management" ? styles.active : ""
          }`}
        >
          <Image
            className={`${iconClass}`}
            src={BillingAccountIcon}
            alt="team icon"
          />
          <div>Billing Account Management</div>
        </div>

        <div
          onClick={() => scrollToSection("invoices_and_payments")}
          className={`${styles.tabContainer} ${
            activeSection == "invoices_and_payments" ? styles.active : ""
          }`}
        >
          <Image className={`${iconClass}`} src={Timer} alt="team icon" />
          <div>Invoices and Payments</div>
        </div>
      </div>

      <div className={styles.rightContainer}>
        {activeTab === "billing_details" ? <BillingDetailsComponent /> : ""}
      </div>
    </div>
  );
};

export default Page;
