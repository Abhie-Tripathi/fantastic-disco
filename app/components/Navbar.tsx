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
import dotMenuIcon from "/public/internal/dotMenus.svg";
import promoteIcon from "/public/internal/promote.svg";
import prospectIcon from "/public/internal/prospect.svg";
import { useRouter } from "next/navigation";
import ArrowDownIcon from "/public/DownArrow.svg";
import ArrowUpIcon from "/public/UpArrow.svg";
interface UserDetail {
  firstname: string;
  email: string;
  lastname: string;
  profilePicture: string | null;
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
  const router = useRouter();
  const pathname = usePathname();
  const [shouldShowBackButton, setShouldShowBackButton] = useState(false);

  const [showSidebar, setShowSidebar] = useState(false);
  const iconClass = theme === "light" ? "icons_light" : "icon";
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const profilectas = DropDown();
  const dotMenuCtas = DropDown();
  const [userDetail, setUserDetail] = useState<UserDetail | null>(
    user ? user : null
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (user) setUserDetail(user);
  }, [user]);

  console.log("Navbar", user, userDetail);

  const toggleDropdown = () => {
    profilectas.setIsOpen(!profilectas.isOpen);
  };

  const dotMenuToggle = () => {
    dotMenuCtas.setIsOpen(!dotMenuCtas.isOpen);
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
    if (currPath.startsWith("/internal/event")) {
      setTitle("Event Detail");
    }
    if (routeMap.hasOwnProperty(currPath)) {
      setTitle(routeMap[currPath]);
    }
    if (currPath.startsWith("/widget/list")) {
      setTitle("Widgets");
    }
    if (currPath.startsWith("/widget/edit")) {
      setTitle("Edit Widget");
    }
    if (currPath.startsWith("/widget/add")) {
      setTitle("Add Widget");
    }
    if (currPath.startsWith("/widget/brandkit")) {
      setTitle("Brandkit");
    }
    if (currPath.startsWith("/widget/events")) {
      setTitle("Events");
    }
    if (currPath.startsWith("/widget/dashboard")) {
      setTitle("Dashboard");
    }
    if (currPath.startsWith("/widget/events/manage")) {
      setTitle("Manage");
    }
    if (currPath.startsWith("/widget/profile")) {
      setTitle("Profile");
    }
  }, [currPath]);
  console.log(userDetail);

  useEffect(() => {
    const referrer = document.referrer;

    if (!referrer || !referrer.includes(window.location.origin)) {
      setShouldShowBackButton(false);
    } else {
      setShouldShowBackButton(true);
    }
  }, []);

  useEffect(() => {
    if (
      window.location.origin === document.referrer ||
      document.referrer === ""
    ) {
      setShouldShowBackButton(true);
    }
  }, [pathname]);

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
            width={16}
            className={`styles.mobile_menuIcon mobile_view ${iconClass}`}
            onClick={handelSideShow}
          />
        )}
        {/* {pathName === "internal" ? ( */}
        {/* <div className={styles.page_title}>
            {currPath.startsWith("/widget/edit") && <Link href={"/widget/add"} className={styles.backBtn}>
            <BackIcon/>
            </Link>}
            {title.length !== 0 && title}</div> */}

        {/* <div className={styles.page_title}>
          {shouldShowBackButton && (
            <button className={styles.backBtn} onClick={() => router.back()}>
              <BackIcon />
            </button>
          )}
          {title.length !== 0 && title}
        </div> */}

        <div className={styles.page_title}>
          {shouldShowBackButton &&
            (currPath.startsWith("/widget/edit") ||
              currPath.startsWith("/widget/add")) && (
              <button className={styles.backBtn} onClick={() => router.back()}>
                <BackIcon />
              </button>
            )}
          {title.length !== 0 && title}
        </div>

        {/* ) : ( */}
        {/* <Link href="/">
            <Image
              className={styles.logo}
              src={logo}
              width={40}
              height={48}
              alt="logo"
            />
          </Link>
        )} */}
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
              <Image
                src={lightModeIcon}
                alt="theme"
                className={iconClass}
                width={20}
              />
            </div>
          </div>
        )}

        {/* Home */}
        {/* {pathName === "internal" && (
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
        )} */}

        {/* DotMenus */}
        {pathName === "internal" && (
          <div className="desktop_view tablet_view">
            <div
              style={{
                display: "flex",
                gap: "8px",
                cursor: "pointer",
                position: "relative",
                marginRight: "10px",
              }}
              ref={dotMenuCtas.dropdownRef}
              onClick={dotMenuToggle}
            >
              <div className={`${styles.circle}`} data-name="Menu">
                <Image
                  src={dotMenuIcon}
                  alt="dotMenu"
                  width={16}
                  height={20}
                  className={iconClass}
                />
              </div>

              {dotMenuCtas.isOpen && (
                <div
                  className={`${styles.userDropdown} card ${styles.dotmenu_dropdown} `}
                  style={{ width: "fit-content", padding: "8px" }}
                >
                  {/* <Link href="/internal" className=""> */}
                  <div
                    className={`${styles.btns_menu} ${styles.dotMenu_icons}`}
                  >
                    <Image
                      src={promoteIcon}
                      alt="promote"
                      width={28}
                      height={28}
                      className={iconClass}
                    />
                    Promote
                  </div>
                  {/* </Link> */}
                  <div
                    className={`${styles.btns_menu} ${styles.dotMenu_icons}`}
                  >
                    <Image
                      src={prospectIcon}
                      alt="prospect"
                      width={28}
                      height={28}
                      className={iconClass}
                    />
                    Prospect
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings */}
        {/* {pathName === "internal" && (
          <Link
            className={`${styles.circle}`}
            style={{ marginRight: "10px" }}
            href={"/settings"}
            data-name="Settings"
          >
            <Image src={settingsIcon} alt="settings" className={iconClass} />
          </Link>
        )} */}

        {pathName !== "internal" && (
          <>
            <div
              className={`${styles.square} `}
              style={{ marginRight: "10px" }}
              onClick={themeSwitchHandler}
              data-name="Switch Theme"
            >
              <Image src={lightModeIcon} alt="theme" className={iconClass} />
            </div>
            <Link
              className={`${styles.square}`}
              style={{ marginRight: "10px" }}
              href={"/internal"}
              data-name="Internal"
            >
              <Image src={DoorIcon} alt="internal" className={iconClass} />
            </Link>
          </>
        )}

        {/* {pathName !== "internal" && (
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
        )} */}
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
                alignItems: "center",
                position: "relative",
              }}
              ref={profilectas.dropdownRef}
              onClick={toggleDropdown}
            >
              {userDetail.profilePicture ? (
                <Image
                  src={userDetail.profilePicture}
                  alt="profile"
                  width={32}
                  height={32}
                  className={`${styles.circle} ${styles.userCircle}`}
                />
              ) : (
                <div
                  className={`${styles.circle} ${styles.userCircle}`}
                  data-name="Username"
                >
                  {userDetail?.firstname?.charAt(0)}
                  {userDetail?.lastname?.charAt(0)}
                </div>
              )}

              <div
                className={`${styles.iconContainer} ${
                  profilectas.isOpen
                    ? styles.iconRotateUp
                    : styles.iconRotateDown
                }`}
              >
                {profilectas.isOpen ? (
                  <Image src={ArrowDownIcon} alt="" className={iconClass} />
                ) : (
                  <Image src={ArrowUpIcon} alt="" className={iconClass} />
                )}
              </div>

              {profilectas.isOpen && (
                <div
                  className={`${styles.userDropdown}  ${styles.dropdownAnimation} card`}
                  style={{
                    padding: "8px",
                    borderRadius: "var(--border-radius-sm)",
                  }}
                >
                  <Link
                    href={
                      pathName === "internal" ? "/internal/profile" : "/profile"
                    }
                  >
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

function BackIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
      style={{ marginRight: "8px" }}
    >
      <path
        fillRule="evenodd"
        d="M11.354 1.354a.5.5 0 0 1 0 .707L5.707 7.707H14.5a.5.5 0 0 1 0 1H5.707l5.647 5.646a.5.5 0 0 1-.708.708l-6.5-6.5a.5.5 0 0 1 0-.708l6.5-6.5a.5.5 0 0 1 .708 0z"
      />
    </svg>
  );
}
