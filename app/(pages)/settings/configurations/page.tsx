"use client";
import React, { useState } from "react";
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
  const [activeTab, setActiveTab] = useState("Widgets Configurations");
  const sideValue = [
    { text: "Widgets Configurations" },
      { text: "Outreach Configurations" },
      { text: "Features" }
  ];
  console.log("1111"+activeTab);
  
  return (
    <div className={styles.container}>
      <div className={styles.navContainerLeft}>
        <div
          className={`${styles.comapny_container} ${styles.tabContainer} ${
            activeTab == "Widgets Configurations" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("Widgets Configurations")}
        >
          <div>
            <Image src={WidgetIcon} alt="billing icon" />
          </div>
          <div className={styles.text}>Widgets Configurations</div>
        </div>
        <div
          className={`${styles.comapny_container} ${styles.tabContainer} ${
            activeTab == "Outreach Configurations" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("Outreach Configurations")}
        >
          <Image src={OutreachIcon} alt="team icon" />
          <div className={styles.text}>Outreach Configurations</div>
        </div>
      </div>

      <div className={styles.rightContainer}>
        {activeTab === "Widgets Configurations" ? <WidgetConfiguration /> : ""}

        {activeTab === "Outreach Configurations" ? (
          <OutreachConfigurations />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Page;
