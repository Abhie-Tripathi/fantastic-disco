"use client";
import React, { useState,useEffect } from "react";
import styles from "./setting.module.css";
import { usePathname } from "next/navigation";
import SettingsSidebar from '@/app/components/settingsSidebar'
import Image from "next/image";
import DepartmentIcon from "/public/departmentIcon.svg";
import TeamIcon from "/public/teamIcon.svg";
const Page = () => {
  // const [activeTab, setActiveTab] = useState("Department");
  const pathName = usePathname();
  const [sideValue, setSideValue] = useState<{ text: string; }[]>([]);
  console.log(pathName);
  const [activeTab, setActiveTab] = useState("Billing Details");
  useEffect(() => {
  if (pathName === "/settings/configurations") {
    // setActiveTab("abc")
    const updatedSideValue = [
      { text: "Widgets Configurations" },
      { text: "Outreach Configurations" },
      { text: "Features" }
    ];
    
    // Update the state with the new array
    setSideValue(updatedSideValue);

  }
  if(pathName==="/settings/pricingplans"){
    // sideValue.clean();
    const updatedSideValue = [
      { text: "Current Plan" },
      { text: "Available Plans" },
    ];
    setSideValue(updatedSideValue);
  }
  if(pathName==="/settings/billingdetails"){
    const updatedSideValue = [
      { text: "Billing Details" },
      { text: "Billing Account Management" },
      {text:"Invoices and Payments"}
    ];
    setSideValue(updatedSideValue);
    setActiveTab("Billing Details")
  }
}, [pathName]);
  useEffect(()=>{
    if (pathName === "/settings/configurations") {
    setActiveTab("Widgets Configurations")
    }
    if (pathName === "/settings/pricingplans") {
      setActiveTab("Current Plan")
      }
  },[pathName])
  console.log("abc"+sideValue);
  return (
    <div className={styles.container}>
      <div className={styles.navContainerLeft}>
        {/* <div
          className={`${styles.comapny_container} ${styles.tabContainer} ${
            activeTab == "Department" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("Department")}
        >
          <div>
            <Image src={DepartmentIcon} alt="department icon" />
          </div>
          <div className={styles.text}>Department</div>
        </div>
        <div
          className={`${styles.comapny_container} ${styles.tabContainer} ${
            activeTab == "Team" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("Team")}
        >
          <Image src={TeamIcon} alt="team icon" />
          <div className={styles.text}>Team</div>
        </div> */}
        
      </div>
      <SettingsSidebar sideVal={sideValue} active={activeTab} setActive={setActiveTab}/>
    
      {activeTab === "Department" ? (
        <div className={styles.navContainerRight}>
          <div className={styles.gradient_border}>Department</div>
        </div>
      ) : (
        ""
      )}

      {activeTab === "Team" ? (
        <div className={styles.navContainerRight}>
          <div className={styles.gradient_border}>Team</div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Page;
