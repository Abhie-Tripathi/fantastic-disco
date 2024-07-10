"use client";
import React, { useEffect, useRef, useState } from "react";
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
import MobileSidebar from "@/app/components/sidebar/MobileSidebar";
import BellIcon from "/public/bell.svg";

interface UserDetail {
  firstname: string;
  email: string;
  lastname: string;
}

const routeMap = {
  "/internal": "Dashboard",
  "/internal/coordinate": "Coordinate",
  "/internal/search/events": "Research",
  // "/internal/trackers/": "Trackers",
  "/internal/outreach": "Outreach",
  "/internal/trends": "Event Trends",
};

type RouteMap = typeof routeMap;
type RouteMapKey = keyof RouteMap;

const Navbar = () => {
  const { user, signOut } = useAuthContext();
  const { theme, toggleTheme } = useTheme();
  const [title, setTitle] = useState("");

  const [showSidebar, setShowSidebar] = useState(false);
  const iconClass = theme === "light" ? "icons_light" : "icon";
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const profilectas = DropDown();
  const [userDetail, setUserDetail] = useState<UserDetail | null>(
    user ? user : null
  );

  useEffect(() => {
    if (user) setUserDetail(user);
  }, [user]);

  const toggleDropdown = () => {
    profilectas.setIsOpen(!profilectas.isOpen);
  };
  const pathName = usePathname().split("/")[1];
  const currPath = usePathname() as RouteMapKey;

  const themeSwitchHandler = () => {
    toggleTheme();
  };
  console.log(user);

  const handelSideShow = () => {
    setShowSidebar(true);
    // setHeight("100vh")
  };

  const handelSideShowClose = () => {
    setShowSidebar(false);
    // setHeight("auto");
  };

  useEffect(() => {
    if (showSidebar) {
      document.body.classList.add("sidebar-open");
    } else document.body.classList.remove("sidebar-open");
  }, [showSidebar]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowSidebar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (currPath.startsWith("/internal/trackers")) {
      setTitle("Trackers");
    }
    if (routeMap.hasOwnProperty(currPath)) {
      setTitle(routeMap[currPath]);
    }
  }, [currPath]);

  return (
    <div className={`${styles.navbar} ${theme === "dark" && styles.dark}`}>
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
          <div className={styles.page_title}>{title.length !== 0 && title}</div>
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
              className={`${styles.circle}`}
              style={{ marginRight: "10px" }}
              data-name="Notification"
            >
              <Image src={BellIcon} alt="notification" className={iconClass} />
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
              <Image src={lightModeIcon} alt="theme" className={iconClass} />
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
              <Image src={Home} alt="home" className={iconClass} />
            </Link>
          </div>
        )}

        {/* Settings */}
        {pathName === "internal" && (
          <Link
            className={`${styles.circle}`}
            style={{ marginRight: "10px" }}
            href={"/settings"}
            data-name="Settings"
          >
            <Image src={settingsIcon} alt="settings" className={iconClass} />
          </Link>
        )}

        {pathName !== "internal" && (
          <>
            <div
              className={`${styles.circle} `}
              style={{ marginRight: "10px" }}
              onClick={themeSwitchHandler}
              data-name="Switch Theme"
            >
              <Image src={lightModeIcon} alt="theme" className={iconClass} />
            </div>
            <Link
              className={`${styles.circle}`}
              style={{ marginRight: "10px" }}
              href={"/internal"}
              data-name="Internal"
            >
              <Image src={DoorIcon} alt="internal" className={iconClass} />
            </Link>
          </>
        )}

        {pathName !== "internal" && (
          <>
            <Link
              className={`${styles.circle}`}
              style={{ marginRight: "10px" }}
              href={"/widget"}
              data-name="Widget"
            >
              <Image src={Spinner} alt="widget" className={iconClass} />
            </Link>

            <Link
              className={`${styles.circle}`}
              style={{ marginRight: "10px" }}
              href={"/settings"}
              data-name="Settings"
            >
              <Image src={settingsIcon} alt="settings" className={iconClass} />
            </Link>
          </>
        )}
        {userDetail && (
          <div
            className={`${
              pathName === "internal" && "desktop_view tablet_view"
            }`}
          >
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
              <div
                className={`${styles.circle} ${styles.userCircle}`}
                data-name="Username"
              >
                {userDetail?.firstname?.charAt(0)}
                {userDetail?.lastname?.charAt(0)}
              </div>
              {/* <div className={styles.userDetails}>
                <div>
                  {userDetail?.firstname} {userDetail?.lastname}
                </div>
                <div style={{ fontSize: "12px" }}>{userDetail?.email}</div>
              </div> */}
              {profilectas.isOpen && (
                <div
                  className={`${styles.userDropdown} card`}
                >
                  <Link href="/profile">
                    <div className={styles.btns}>Profile</div>
                  </Link>
                  <div className={styles.btns} onClick={signOut}>
                    Log Out
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {showSidebar && (
        <div className={styles.mobile_sideBar_container}>
          <div ref={sidebarRef}>
            <MobileSidebar onClose={handelSideShowClose} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
