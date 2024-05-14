"use client";
import React, { useState, useEffect } from "react";
import styles from "./billing.module.css";
import Image from "next/image";
import { usePathname } from "next/navigation";
import SettingsSidebar from '@/app/components/settingsSidebar'
import BillingIcon from "/public/billingIcon.svg";
import BillingAccountIcon from "/public/billingAccountIcon.svg";
import BillingDetailsComponent from "@/app/components/settings/billingDetails/BillingDetails";
import Timer from "/public/timer.svg";
import { useTheme } from "@/context";
import Link from "next/link";

interface Section {
  topic: string;
  boundingTop: number;
}

const marginTop = 0;

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

  const [offSetY, setOffSetY] = useState(0);
  const [sections, setSection] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState("");

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  //   setOffSetY(0);
  // }, []);

  // useEffect(() => {
  //   const els: HTMLElement[] = Array.from(
  //     document.querySelectorAll("section.section_heading")
  //   );

  //   const allSections = els.map((el: HTMLElement, index: number) => {
  //     const { top: boundingTop } = el.getBoundingClientRect();
  //     return {
  //       topic: el.getAttribute("id")!,
  //       boundingTop,
  //     };
  //   });

  //   console.log("All section--farah", allSections);

  //   setSection(allSections);
  // }, []);

  // useEffect(() => {
  //   if (sections.length <= 1) {
  //     return;
  //   }

  //   const onScroll = () => {
  //     setOffSetY(window.pageYOffset);
  //   };

  //   window.addEventListener("scroll", onScroll);
  //   return () => window.removeEventListener("scroll", onScroll);
  // }, [sections]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      let currentActive = "";

      console.log("All_section", sections);
      sections.forEach((section) => {
        console.log("section_offset", section.offsetTop - 100);

        const sectionTop = section.offsetTop - 200; // Adjust offset as needed
        console.log("section__", sectionTop);

        const sectionHeight = section.clientHeight;
        console.log("section__height", sectionHeight);
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
  console.log("active", activeSection);

  return (
    <div className={styles.container}>
      <div
        className={`${styles.navContainerLeft} ${
          theme === "light" && styles.navContainerLeft_light
        }`}
      >
        <div
          className={`${styles.comapny_container} ${styles.tabContainer} ${
            activeTab == "Billing Details" ? styles.active : ""
          }`}
          // onClick={() => setActiveTab("Billing Details")}
        >
          <div>
            <Image
              className={`${iconClass}`}
              src={BillingIcon}
              alt="billing icon"
            />
          </div>

          <Link href="#billing_details" className={styles.text}>
            Billing Details
          </Link>
        </div>
        <div
          className={`${styles.comapny_container} ${styles.tabContainer} ${
            activeTab == "Billing Account Management" ? styles.active : ""
          }`}
          // onClick={() => setActiveTab("Billing Account Management")}
        >
          <Image
            className={`${iconClass}`}
            src={BillingAccountIcon}
            alt="team icon"
          />
          <Link href="#billing_account_management" className={styles.text}>
            Billing Account Management
          </Link>
        </div>

        <div
          className={`${styles.comapny_container} ${styles.tabContainer} ${
            activeTab == "Invoices and Payments" ? styles.active : ""
          }`}
          // onClick={() => setActiveTab("Invoices and Payments")}
        >
          <Image className={`${iconClass}`} src={Timer} alt="team icon" />
          <Link href="#invoices_and_payments" className={styles.text}>
            Invoices and Payments
          </Link>
        </div>
      </div>

      <div className={styles.rightContainer}>
        {activeTab === "Billing Details" ? <BillingDetailsComponent /> : ""}

        {/* {activeTab === "Billing Account Management" ? (
          <div className={styles.navContainerRight}>
            <div className={styles.gradient_border}>
              Billing Account Management
            </div>
          </div>
        ) : (
          ""
        )} */}
        {/* {activeTab === "Pricing Plans" ? (
          <div className={styles.navContainerRight}>
            <div className={styles.gradient_border}>Pricing Plans</div>
          </div>
        ) : (
          ""
        )} */}

        {/* {activeTab === "Invoices and Payments" ? (
          <div className={styles.navContainerRight}>
            <div className={styles.gradient_border}>Invoices and Payments</div>
          </div>
        ) : (
          ""
        )} */}
      </div>
    </div>
  );
};

export default Page;
