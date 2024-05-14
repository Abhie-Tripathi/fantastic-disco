"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./navbar.style.module.css";
import logo from "/public/croppedlogo.png";
import settingsIcon from "/public/settings.svg";
import lightModeIcon from "/public/lightmode.svg";
import Home from "/public/internal/home.svg";
import DoorIcon from "/public/door.svg";
import Image from "next/image";
import Link from "next/link";
import DropDown from "@/app/components/employee/listView/DropdownRef";
import { useAuthContext, useTheme } from "@/context";
import Spinner from "/public/Icon.svg";
import menuIcon from "/public/internal/hamburger.svg";
import MobileSidebar from "./MobileSidebar";
import BellIcon from "/public/bell.svg";

interface UserDetail {
  firstname: string;
  email: string;
  lastname: string;
}

const Navbar = () => {
  const { user, signOut } = useAuthContext();
  const { theme, toggleTheme } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const iconClass = theme === "light" ? "icons_light" : "icon";

  const profilectas = DropDown();
  const [userDetail, setUserDetail] = useState<UserDetail | null>(
    user ? user : null
  );

  useEffect(() => {
    setUserDetail(user);
  }, [user]);
  console.log("User object:", userDetail);
  console.log("User firstname:", userDetail?.firstname);
  const toggleDropdown = () => {
    profilectas.setIsOpen(!profilectas.isOpen);
  };
  const pathName = usePathname().split("/")[1];

  const themeSwitchHandler = () => {
    toggleTheme();
  };

  const handelSideShow = () => {
    setShowSidebar(true);
  };

  const handelSideShowClose = () => {
    setShowSidebar(false);
  };

  return (
    <div className={`${styles.navbar} ${theme === "light" && styles.light}`}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {pathName === "internal" && (
          <Image
            src={menuIcon}
            alt="Menu"
            className={`styles.mobile_menuIcon mobile_view ${iconClass}`}
            onClick={handelSideShow}
          />
        )}
        {pathName === "internal" ? (
          <Link href="/internal">
            <Image
              className={`styles.logo_internal`}
              src={logo}
              width={40}
              height={48}
              alt="logo"
            />
          </Link>
        ) : (
          <Link href="/">
            <Image
              className={styles.logo}
              src={logo}
              width={40}
              height={48}
              alt="logo"
            />
          </Link>
        )}
      </div>

      <div className={styles.settings}>
        {/* Notification */}
        {pathName === "internal" && (
          <div className="mobile_view">
            <div
              className={`${styles.circle} `}
              style={{ marginRight: "10px" }}
              data-name="Notification"
            >
              <Image src={BellIcon} alt="notification" />
            </div>
          </div>
        )}

        {/* ThemeSwitch */}
        {pathName === "internal" && (
          <div className="desktop_view tablet_view">
            <div
              className={`${styles.circle}`}
              style={{ marginRight: "10px" }}
              onClick={themeSwitchHandler}
              data-name="Switch Theme"
            >
              <Image src={lightModeIcon} alt="theme" />
            </div>
          </div>
        )}

        {/* Home */}
        {pathName === "internal" && (
          <div className="desktop_view tablet_view">
            <Link
              href="/"
              className={`${styles.circle} desktop_view tablet_view`}
              style={{ marginRight: "10px" }}
              data-name="Home"
            >
              <Image src={Home} alt="home" />
            </Link>
          </div>
        )}

        {/* Settings */}
        {pathName === "internal" && (
          <Link
            className={`${styles.circle} mobile_view`}
            style={{ marginRight: "10px" }}
            href={"/settings"}
            data-name="Settings"
          >
            <Image src={settingsIcon} alt="settings" />
          </Link>
        )}

        {pathName !== "internal" && (
          <Link
            className={styles.circle}
            style={{ marginRight: "10px" }}
            href={"/internal"}
            data-name="Internal"
          >
            <Image src={DoorIcon} alt="internal" />
          </Link>
        )}

        {pathName !== "internal" && (
          <>
            <Link
              className={styles.circle}
              style={{ marginRight: "10px" }}
              href={"/widget"}
              data-name="Widget"
            >
              <Image src={Spinner} alt="widget" />
            </Link>

            <Link
              className={styles.circle}
              style={{ marginRight: "10px" }}
              href={"/settings"}
              data-name="Settings"
            >
              <Image src={settingsIcon} alt="settings" />
            </Link>
          </>
        )}
        {userDetail && (
          <div className="desktop_view tablet_view">
            <div
              style={{
                display: "flex",
                gap: "8px",
                cursor: "pointer",
                position: "relative",
              }}
              ref={profilectas.dropdownRef}
              onClick={toggleDropdown}
            >
              <div className={styles.circle} data-name="Username">
                {userDetail?.firstname.charAt(0)}
                {userDetail?.lastname.charAt(0)}
              </div>
              <div className={styles.userDetails}>
                <div>
                  {userDetail?.firstname} {userDetail?.lastname}
                </div>
                <div style={{ fontSize: "12px" }}>{userDetail?.email}</div>
              </div>
              {profilectas.isOpen && (
                <div
                  className={`${styles.userDropdown} ${
                    theme === "light" && styles.light
                  }`}
                >
                  <div className={styles.btns}>Profile</div>
                  <div className={styles.btns} onClick={signOut}>
                    Log Out
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {showSidebar && <MobileSidebar onClose={handelSideShowClose} />}
    </div>
  );
};

export default Navbar;
