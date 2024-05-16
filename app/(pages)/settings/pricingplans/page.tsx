"use client";
import React, { useState, useEffect } from "react";
import styles from "./pricing.module.css";
import Image from "next/image";
import BillingIcon from "/public/billingIcon.svg";
import SettingsSidebar from '@/app/components/settingsSidebar'
import BillingAccountIcon from "/public/currentplans.svg";
import availablePlansIcon from '/public/availablePlans.svg'
import CurrentPlan from "@/app/components/settings/pricingPlans/currentPlans";
import { useTheme } from "@/context";
import AvailablePlans from "@/app/components/settings/pricingPlans/availablePlans";
const Page = () => {
  const [activeTab, setActiveTab] = useState("current_plan");
  const [activeSection, setActiveSection] = useState("current_plan");
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";

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
    const target: any = document.getElementById(sectionId);
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
          onClick={() => scrollToSection("current_plan")}
          className={`${styles.tabContainer} ${
            activeSection == "current_plan" ? styles.active : ""
          }`}
        >
          <div>
            <Image
              className={`${iconClass}`}
              src={BillingAccountIcon}
              alt="billing icon"
            />
          </div>

          <div className={styles.text}>Current Plan</div>
        </div>
        <div
          onClick={() => scrollToSection("available_plans")}
          className={`${styles.tabContainer} ${
            activeSection == "available_plans" ? styles.active : ""
          }`}
        >
          <Image
            className={`${iconClass}`}
            src={availablePlansIcon}
            alt="team icon"
          />
          <div className={styles.text}>Available Plans</div>
        </div>
      </div> 

      <div className={styles.rightContainer}>
        {activeTab === "current_plan" ? <CurrentPlan /> : ""}
      </div>
    </div>
  );
};

export default Page;
