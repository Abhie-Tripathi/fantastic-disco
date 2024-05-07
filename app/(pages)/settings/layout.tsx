"use client";
import React from "react";
import styles from "./layout.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import CompanyIcon from "/public/company.svg";
import SettingIcon from "/public/settingIcon.svg";
import PricingIcon from "/public/pricingIcon.svg";
import BillingIcon from "/public/billin.svg";
import ConfigIcon from "/public/config.svg";
import UserManagemantIcon from "/public/userManagement.svg";
import { useTheme } from "@/context";
const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  const {theme}=useTheme(); 
  const iconClass = theme ===  'light' ? 'icons_light' : 'icon'
  return (
    <div className={`${styles.container} ${theme === 'light' && styles.container_light}`}>
      <div className={`${styles.outerDiv} ${theme === 'light' && styles.outerDiv_light}`}>
        <div className={styles.settingContainer}>
          <Image className={`${iconClass}`} src={SettingIcon} alt="setting icon" />
          <div className={styles.settingFonts}>Setting</div>
          <div className={styles.superAdminFont}> Super Admin</div>
        </div>
        <div className={styles.tabsContainer}>
          <Link
            href="/settings"
            className={`${styles.tab} ${
              pathName == "/settings" ? styles.active : ""
            }`}
          >
            <div className={`${styles.comapny_container}`}>
              <Image className={`${iconClass}`} src={CompanyIcon} alt="company icon" />
              <div className={styles.text}>Company</div>
            </div>
          </Link>

          <Link
            href="/settings/billingdetails"
            className={`${styles.tab} ${
              pathName == "/settings/billingdetails" ? styles.active : ""
            }`}
          >
            <div className={`${styles.comapny_container}`}>
              <Image className={`${iconClass}`} src={BillingIcon} alt="billing and plans icon" />
              <div className={styles.text}>Billing Details</div>
            </div>
          </Link>

          <Link
            href="/settings/pricingplans"
            className={`${styles.tab} ${
              pathName == "/settings/pricingplans" ? styles.active : ""
            }`}
          >
            <div className={`${styles.comapny_container}`}>
              <Image className={`${iconClass}`} src={PricingIcon} alt="config icon" />
              <div className={styles.text}>Pricing Plans</div>
            </div>
          </Link>

          <Link
            href="/settings/configurations"
            className={`${styles.tab} ${
              pathName == "/settings/configurations" ? styles.active : ""
            }`}
          >
            <div className={`${styles.comapny_container}`}>
              <Image className={`${iconClass}`} src={ConfigIcon} alt="config icon" />
              <div className={styles.text}>Configurations</div>
            </div>
          </Link>

          <Link
            href="/settings/usermanagement"
            className={`${styles.tab} ${
              pathName == "/settings/usermanagement" ? styles.active : ""
            }`}
          >
            <div className={`${styles.comapny_container}`}>
              <Image className={`${iconClass}`}src={UserManagemantIcon} alt="user management icon" />
              <div className={styles.text}>User Management</div>
            </div>
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Layout;
