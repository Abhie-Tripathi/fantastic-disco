"use client";
import React, { useState } from "react";
import styles from "./config.module.css";
import Image from "next/image";
import SettingsSidebar from '@/app/components/settingsSidebar'
import WidgetConfiguration from "@/app/components/settings/configurations/widgetConfigurations";
import OutreachConfigurations from "@/app/components/settings/configurations/outreachConfigurations";
import WidgetIcon from "/public/widgetIcon.svg";
import FeatureIcon from "/public/featuresIcon.svg";
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
      <SettingsSidebar sideVal={sideValue} active={activeTab} 
      setActive={setActiveTab}/>
      {activeTab === "Widgets Configurations" ? <WidgetConfiguration /> : ""}

      {activeTab === "Outreach Configurations" ? (
        <OutreachConfigurations />
      ) : (
        ""
      )}
    </div>
  );
};

export default Page;
