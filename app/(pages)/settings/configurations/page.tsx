"use client";
import React, { useState, useEffect } from "react";
import styles from "./config.module.css";
import Image from "next/image";
import SettingsSidebar from '@/app/components/settingsSidebar'
import WidgetConfiguration from "@/app/components/settings/configurations/widgetConfigurations";
import OutreachConfigurations from "@/app/components/settings/configurations/outreachConfigurations";
import WidgetIcon from "/public/widgetIcon.svg";
import OutreachIcon from "/public/kanbanIcon.svg";
import { useTheme } from "@/context";
const Page = () => {
  const {theme}=useTheme();
  const iconClass = theme ===  'light' ? 'icons_light' : 'icon';
  const [activeTab, setActiveTab] = useState("widgets_configurations");
  const [activeSection, setActiveSection] = useState("widgets_configurations");

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
  const sideValue = [
    { text: "Widgets Configurations" },
      { text: "Outreach Configurations" },
      { text: "Features" }
  ];
  
  return (
    <div className={styles.container}>
      <div className={styles.navContainerLeft}>
        <div
          onClick={() => scrollToSection("widgets_configurations")}
          className={`${styles.tabContainer} ${
            activeSection == "widgets_configurations" ? styles.active : ""
          }`}
        >
          <div>
            <Image src={WidgetIcon} alt="widget icon" />
          </div>
          <div className={styles.text}>Widgets Configurations</div>
        </div>
        <div
          onClick={() => scrollToSection("outreach_configurations")}
          className={`${styles.tabContainer} ${
            activeSection == "outreach_configurations" ? styles.active : ""
          }`}
        >
          <Image src={OutreachIcon} alt="outreach icon" />
          <div className={styles.text}>Outreach Configurations</div>
        </div>
      </div>

      <div className={styles.rightContainer}>
        {activeTab === "widgets_configurations" ? <WidgetConfiguration /> : ""}
      </div>
    </div>
  );
};

export default Page;
