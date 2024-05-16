// components/SideNav.js
"use client";
import React, { useState } from "react";
import styles from "./settingsSidebar.module.css";
import Image from "next/image";
import BillingIcon from "/public/billingIcon.svg";
import BillingAccountIcon from "/public/billingAccountIcon.svg";
import BillingDetailsComponent from "@/app/components/settings/billingDetails/BillingDetails";
import Widget from "/public/widgetIcon.svg";
import Outreach from "/public/kanbanIcon.svg"
import Feature from '/public/featuresIcon.svg';
import Timer from "/public/timer.svg";
import { useTheme } from "@/context";
const SideNav = ({sideVal,active,setActive}:any) => {
  
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";
  const [activeTab, setActiveTab] = useState("Billing Details");
  console.log("Sideal",sideVal);
  
  return (
    <div className={styles.container}>
      <div
        className={`${styles.navContainerLeft} ${
          theme === "light" && styles.navContainerLeft_light
        }`}
      >
       
        {sideVal?.map((item: { text: string; imagePath: string }, ind: number) => {
  return (
    <div
      key={ind}
      className={`${styles.comapny_container} ${styles.tabContainer} ${
        active == item.text ? styles.active : ""
      }`}
      onClick={() => setActive(item.text)}
    >
      {item.text==="Widgets Configurations"&&
       <Image width={13} height={13}className={`${iconClass}`} src={Widget} alt="team icon"/>
      }
      {item.text==="Outreach Configurations"&&
       <Image width={13} height={13} className={`${iconClass}`} src={Outreach} alt="team icon"/>
      }
      {item.text==="Features"&&
       <Image width={13} height={13} className={`${iconClass}`} src={Feature} alt="team icon"/>
      }
      {item.text==="Current Plan"&&
      <Image width={13} height={13} className={`${iconClass}`} src={BillingIcon} alt="team icon"/>
      }
      {item.text==="Available Plans"&&
      <Image width={13} height={13} className={`${iconClass}`} src={BillingAccountIcon} alt="team icon"/>
      }
      {item.text==="Billing Details"&&
      <Image width={13} height={13}className={`${iconClass}`} src={BillingIcon} alt="team icon"/>
      }
      {item.text==="Billing Account Management"&&
      <Image width={13} height={13}className={`${iconClass}`} src={BillingAccountIcon} alt="team icon"/>
      }
      {item.text==="Invoices and Payments"&&
      <Image width={13} height={13} className={`${iconClass}`} src={Timer} alt="team icon"/>
      }
      <div className={styles.text}>{item.text}</div>
    </div>
  );
})}

      </div>
      
    </div>
  );
};

export default SideNav;

