"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import HeroLogo from "/public/HeroLogo.svg";
import HeroText from "/public/whrai.svg";
import WidgetdashboardIcon from "@/app/components/sidebar/Icons/WidgetDashboard";
import BrandkitIcon from "@/app/components/sidebar/Icons/WidgetBrandKit";
import WidgetIcon from "@/app/components/sidebar/Icons/WidgetIcon2";
import EventsIcon from "@/app/components/sidebar/Icons/WidgetIcon3";
import { Step } from "react-joyride";
import { isEventeli } from "@/config";
import {
  MagnifyingGlass,
  BookOpen,
  ChartBarRandom,
  LineChart,
  GridMasonry,
  RefreshClockwise,
  Users,
  Wrench,
} from "geist-icons";
import {
  BriefcaseBusiness,
  Moon,
  Sun,
  UserSearch,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context";
import { useAuthContext } from "@/context/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import JoyRideCustom from "@/app/components/internal/walkthrough/JoyRideCustom";
import { endOfMonth } from "date-fns";
import { startOfMonth } from "date-fns";
import { addMonths } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function Coordinate() {
  return (
    <svg
      className="flex-shrink-0"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.5 14.75V14H2V14.75C2 16.1424 2.55312 17.4777 3.53769 18.4623C4.52226 19.4469 5.85761 20 7.25 20H9.5V18.5H7.25C6.25544 18.5 5.30161 18.1049 4.59835 17.4017C3.89509 16.6984 3.5 15.7446 3.5 14.75ZM17 7.25V8H18.5V7.25C18.5 5.85761 17.9469 4.52226 16.9623 3.53769C15.9777 2.55312 14.6424 2 13.25 2H11V3.5H13.25C13.7425 3.5 14.2301 3.597 14.6851 3.78545C15.14 3.97391 15.5534 4.25013 15.9017 4.59835C16.2499 4.94657 16.5261 5.35997 16.7145 5.81494C16.903 6.26991 17 6.75754 17 7.25ZM7.25 7.25H2.75C2.15326 7.25 1.58097 7.48705 1.15901 7.90901C0.737053 8.33097 0.5 8.90326 0.5 9.5V11H2V9.5C2 9.30109 2.07902 9.11032 2.21967 8.96967C2.36032 8.82902 2.55109 8.75 2.75 8.75H7.25C7.44891 8.75 7.63968 8.82902 7.78033 8.96967C7.92098 9.11032 8 9.30109 8 9.5V11H9.5V9.5C9.5 8.90326 9.26295 8.33097 8.84099 7.90901C8.41903 7.48705 7.84674 7.25 7.25 7.25ZM5 6.5C5.59334 6.5 6.17336 6.32405 6.66671 5.99441C7.16006 5.66477 7.54458 5.19623 7.77164 4.64805C7.9987 4.09987 8.05811 3.49667 7.94236 2.91473C7.8266 2.33279 7.54088 1.79824 7.12132 1.37868C6.70176 0.959123 6.16721 0.673401 5.58527 0.557646C5.00333 0.44189 4.40013 0.5013 3.85195 0.728363C3.30377 0.955426 2.83524 1.33994 2.50559 1.83329C2.17595 2.32664 2 2.90666 2 3.5C2 4.29565 2.31607 5.05871 2.87868 5.62132C3.44129 6.18393 4.20435 6.5 5 6.5ZM5 2C5.29667 2 5.58668 2.08797 5.83335 2.2528C6.08003 2.41762 6.27229 2.65189 6.38582 2.92598C6.49935 3.20007 6.52906 3.50167 6.47118 3.79264C6.4133 4.08361 6.27044 4.35088 6.06066 4.56066C5.85088 4.77044 5.58361 4.9133 5.29264 4.97118C5.00166 5.02906 4.70006 4.99935 4.42597 4.88582C4.15189 4.77229 3.91762 4.58003 3.7528 4.33336C3.58797 4.08668 3.5 3.79667 3.5 3.5C3.5 3.10218 3.65804 2.72065 3.93934 2.43934C4.22064 2.15804 4.60218 2 5 2ZM19.25 17.75H14.75C14.1533 17.75 13.581 17.9871 13.159 18.409C12.7371 18.831 12.5 19.4033 12.5 20V21.5H14V20C14 19.8011 14.079 19.6103 14.2197 19.4697C14.3603 19.329 14.5511 19.25 14.75 19.25H19.25C19.4489 19.25 19.6397 19.329 19.7803 19.4697C19.921 19.6103 20 19.8011 20 20V21.5H21.5V20C21.5 19.4033 21.2629 18.831 20.841 18.409C20.419 17.9871 19.8467 17.75 19.25 17.75ZM14 14C14 14.5933 14.1759 15.1734 14.5056 15.6667C14.8352 16.1601 15.3038 16.5446 15.8519 16.7716C16.4001 16.9987 17.0033 17.0581 17.5853 16.9424C18.1672 16.8266 18.7018 16.5409 19.1213 16.1213C19.5409 15.7018 19.8266 15.1672 19.9424 14.5853C20.0581 14.0033 19.9987 13.4001 19.7716 12.852C19.5446 12.3038 19.1601 11.8352 18.6667 11.5056C18.1734 11.1759 17.5933 11 17 11C16.2044 11 15.4413 11.3161 14.8787 11.8787C14.3161 12.4413 14 13.2044 14 14ZM18.5 14C18.5 14.2967 18.412 14.5867 18.2472 14.8334C18.0824 15.08 17.8481 15.2723 17.574 15.3858C17.2999 15.4994 16.9983 15.5291 16.7074 15.4712C16.4164 15.4133 16.1491 15.2704 15.9393 15.0607C15.7296 14.8509 15.5867 14.5836 15.5288 14.2926C15.4709 14.0017 15.5006 13.7001 15.6142 13.426C15.7277 13.1519 15.92 12.9176 16.1666 12.7528C16.4133 12.588 16.7033 12.5 17 12.5C17.3978 12.5 17.7794 12.658 18.0607 12.9393C18.342 13.2206 18.5 13.6022 18.5 14Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Outreach() {
  return (
    <svg
      className="flex-shrink-0"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.861 1.16321L16.021 1.21721L17.223 1.61721C17.686 1.77221 18.093 1.90721 18.414 2.05721C18.762 2.21921 19.081 2.42721 19.325 2.76621C19.569 3.10421 19.666 3.47321 19.71 3.85421C19.75 4.20721 19.75 4.63521 19.75 5.12421V13.3362C19.75 14.0342 19.75 14.6232 19.696 15.0892C19.64 15.5732 19.514 16.0512 19.161 16.4372C18.952 16.666 18.6981 16.8492 18.415 16.9752C17.937 17.1872 17.444 17.1552 16.967 17.0562C16.507 16.9602 15.949 16.7742 15.287 16.5532L15.244 16.5392C14.124 16.1652 13.739 16.0492 13.367 16.0622C13.2184 16.0673 13.0707 16.087 12.926 16.1212C12.563 16.2062 12.223 16.4202 11.24 17.0752L9.858 17.9972L9.718 18.0902C8.656 18.7992 7.918 19.2912 7.054 19.4072C6.191 19.5232 5.349 19.2422 4.139 18.8372L3.979 18.7842L2.777 18.3842C2.314 18.2292 1.907 18.0942 1.586 17.9442C1.238 17.7822 0.919 17.5742 0.675 17.2342C0.431 16.8962 0.334 16.5282 0.29 16.1462C0.25 15.7932 0.25 15.3662 0.25 14.8772V6.66521C0.25 5.96621 0.25 5.37721 0.304 4.91221C0.36 4.42821 0.486 3.95021 0.839 3.56421C1.04797 3.33543 1.30194 3.15227 1.585 3.02621C2.063 2.81321 2.557 2.84521 3.033 2.94521C3.493 3.04021 4.051 3.22721 4.713 3.44821L4.756 3.46221C5.876 3.83521 6.261 3.95221 6.634 3.93921C6.78225 3.9341 6.92964 3.91434 7.074 3.88021C7.437 3.79421 7.777 3.58021 8.76 2.92621L10.142 2.00421L10.282 1.91021C11.344 1.20221 12.082 0.710214 12.945 0.594214C13.809 0.478214 14.651 0.758215 15.861 1.16321ZM13.75 2.10721V14.5802C14.286 14.6382 14.85 14.8262 15.593 15.0742L15.718 15.1162C16.435 15.3552 16.91 15.5122 17.273 15.5882C17.629 15.6622 17.75 15.6282 17.805 15.6042C17.8994 15.5623 17.9842 15.5014 18.054 15.4252C18.094 15.3812 18.164 15.2762 18.206 14.9152C18.249 14.5472 18.25 14.0462 18.25 13.2912V5.16321C18.25 4.62321 18.249 4.28321 18.22 4.02521C18.192 3.78621 18.148 3.69721 18.108 3.64321C18.069 3.58921 17.999 3.51821 17.782 3.41721C17.546 3.30721 17.222 3.19921 16.712 3.02821L15.547 2.64021C14.66 2.34421 14.134 2.17721 13.75 2.10721ZM12.25 14.7602V2.43421C11.939 2.61421 11.54 2.87521 10.974 3.25221L9.592 4.17421L9.482 4.24721C8.794 4.70721 8.281 5.04921 7.75 5.24121V17.5672C8.061 17.3872 8.46 17.1252 9.026 16.7482L10.408 15.8272L10.518 15.7542C11.206 15.2942 11.719 14.9522 12.25 14.7602ZM6.25 17.8952V5.42021C5.714 5.36221 5.15 5.17421 4.407 4.92621L4.282 4.88421C3.565 4.64521 3.09 4.48821 2.726 4.41221C2.371 4.33821 2.25 4.37121 2.196 4.39521C2.10111 4.43727 2.01598 4.49856 1.946 4.57521C1.906 4.61821 1.836 4.72321 1.794 5.08421C1.751 5.45221 1.75 5.95421 1.75 6.70921V14.8372C1.75 15.3772 1.751 15.7172 1.78 15.9752C1.808 16.2142 1.852 16.3022 1.892 16.3572C1.931 16.4112 2.001 16.4822 2.218 16.5832C2.454 16.6932 2.778 16.8012 3.288 16.9722L4.453 17.3602C5.34 17.6552 5.865 17.8232 6.25 17.8942"
        fill="currentColor"
      />
    </svg>
  );
}

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const { user, signOut } = useAuthContext();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [storedUser, setStoredUser] = useState(() => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const user = localStorage.getItem("user");
      setStoredUser(user ? JSON.parse(user) : null);
    };

    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const generateProfileName = () => {
    if (storedUser) {
      const firstNameInitial = storedUser?.firstname?.[0]?.toUpperCase() || "";
      const lastNameInitial = storedUser?.lastname?.[0]?.toUpperCase() || "";
      return `${firstNameInitial}${lastNameInitial}`;
    }
    return "";
  };

  const handleClick = () => {
    if (pathname.startsWith("/internal")) {
      router.push("/internal/settings/profile");
    }
    if (pathname.startsWith("/widget")) {
      router.push("/widget/settings/profile");
    }
  };

  const handleSettingsClick = () => {
    if (pathname.startsWith("/internal")) {
      router.push("/internal/settings/product");
    }
    if (pathname.startsWith("/widget")) {
      router.push("/widget/settings/profile");
    }
  };

  const gtmLinks = [
    { name: "Dashboard", href: "/internal", icon: GridMasonry },
    {
      name: "Search",
      href: `/internal/search/events`,
      icon: MagnifyingGlass,
    },
    {
      name: "Tracker",
      href: "/internal/trackers?tab=allTrackers",
      icon: LineChart,
    },
    { name: "Trends", href: "/internal/trends", icon: ChartBarRandom },
    {
      name: "Coordinate",
      href: "/internal/coordinate",
      icon: Coordinate,
    },
    ...(!isEventeli
      ? [{ name: "Outreach", href: "/internal/outreach", icon: Outreach }]
      : []),
    // { name: "API Tools", href: "/clients", icon: Wrench },
    // {
    //   name: "Documentation",
    //   href: "https://eventeli.com/docs",
    //   icon: BookOpen,
    // },
  ];
  const geniLinks = [
    {
      name: "Dashboard",
      href: "/widget/dashboard",
      icon: <WidgetdashboardIcon />,
    },
    { name: "Brandkit", href: "/widget/brandkit", icon: <BrandkitIcon /> },
    { name: "Widget", href: "/widget/list", icon: <WidgetIcon /> },
    { name: "Events", href: "/widget/events", icon: <EventsIcon /> },
  ];

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // const [isSidebarOpen, setIsSidebarOpen] = useState<Boolean>(false);
  // const [run, setRun] = useState(false);
  // const [steps, setSteps] = useState<Step[]>([]);
  // const dashboardRef = useRef(null);
  // const brandkitRef = useRef(null);
  // const widgetRef = useRef(null);
  // const eventsRef = useRef(null);

  // const updateSteps = useCallback(() => {
  //   const newSteps: Step[] = [];

  //   if (dashboardRef.current) {
  //     console.log("ref_______________22", dashboardRef);
  //     newSteps.push({
  //       target: dashboardRef.current,
  //       title: "Dashboard",
  //       content:
  //         "Stay informed with our dashboard—your hub for overall and latest updates.",
  //       disableBeacon: true,
  //       placement: "auto",
  //       spotlightPadding: 10,
  //     });
  //   }

  //   if (brandkitRef.current) {
  //     newSteps.push({
  //       target: brandkitRef.current,
  //       title: "Brandkit",
  //       content:
  //         "ypu can customize you brandkit from here",
  //       disableBeacon: true,
  //       placement: "auto",
  //     });
  //   }

  //   if (widgetRef.current) {
  //     newSteps.push({
  //       target: widgetRef.current,
  //       title: "Widget",
  //       content:
  //         "Choose your widget from here.",
  //       disableBeacon: true,
  //       placement: "auto",
  //     });
  //   }

  //   if (eventsRef.current) {
  //     newSteps.push({
  //       target: eventsRef.current,
  //       title: "Events",
  //       content:
  //         "Check or create your Events",
  //       disableBeacon: true,
  //       placement: "auto",
  //     });
  //   }
  //   setSteps(newSteps);
  // }, []);

  // useEffect(() => {
  //   if (pathname === "/widget/dashboard") {
  //     const walkthroughCompleted: string[] = JSON.parse(
  //       localStorage.getItem("walkthroughCompleted") || "[]"
  //     );

  //     if (!walkthroughCompleted.includes("/widget/dashboard")) {
  //       updateSteps();
  //       setRun(true);
  //     }
  //   }
  // }, [updateSteps]);

  // const handleFinishWalkThrough = () => {
  //   setRun(false);
  //   setIsSidebarOpen(false);
  // };

  return (
    <aside
      className={`fixed z-50 top-0 left-0 h-full bg-background transition-all duration-300 ease-in-out flex flex-col border-r ${
        isHovered ? "w-56" : "w-16"
      } hidden lg:flex`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* {steps.length > 0 && (
        <JoyRideCustom
          steps={steps}
          run={run}
          onFinish={handleFinishWalkThrough}
          pathName="/widget/dashboard"
        />
      )} */}

      <div className="flex items-center pt-3 px-3 pb-6">
        <div className="flex items-center space-x-2">
          <Image src={HeroLogo} alt="logo" width={40} height={40} />
          {isHovered && (
            <Image
              className="mb-[6px]"
              src={HeroText}
              alt="logotext"
              height={24}
              style={theme === "dark" ? { filter: "invert(100%)" } : {}}
            />
          )}
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto flex flex-col justify-between">
        <ul className="p-2 space-y-1">
          {pathname.startsWith("/internal")
            ? gtmLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  pathname === link.href ||
                  (link.name === "Tracker" &&
                    pathname.startsWith("/internal/trackers")) ||
                  (link.name === "Search" &&
                    pathname.startsWith("/internal/search"));
                return (
                  <li key={link.name}>
                    <Link href={link.href} passHref legacyBehavior>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={`w-full ${
                          isHovered
                            ? "justify-start px-3"
                            : "justify-center px-0"
                        } h-10 ${
                          isActive
                            ? "bg-primary text-white hover:bg-primary"
                            : ""
                        }`}
                        asChild
                      >
                        <a
                          onClick={(e) => {
                            if (pathname === link.href.split("?")[0]) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <Icon
                            color={theme == "dark" ? "#fff" : ""}
                            className="flex-shrink-0"
                          />
                          {isHovered && (
                            <span className="ml-2">{link.name}</span>
                          )}
                        </a>
                      </Button>
                    </Link>
                  </li>
                );
              })
            : geniLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.name}>
                    <Link href={link.href} passHref legacyBehavior>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={`w-full ${
                          isHovered
                            ? "justify-start px-3"
                            : "justify-center px-0"
                        } h-10 ${
                          isActive
                            ? "bg-primary text-white hover:bg-primary"
                            : ""
                        }`}
                        asChild
                      >
                        <a>
                          {link.icon}
                          {isHovered && (
                            <span className="ml-2">{link.name}</span>
                          )}
                        </a>
                      </Button>
                    </Link>
                  </li>
                );
              })}
        </ul>
        <div className="px-3 pb-3 flex flex-col gap-3 border-t pt-3">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="profile" className="border-none">
              <AccordionTrigger
                className={`hover:no-underline  ${
                  !isHovered ? "[&>svg]:hidden" : ""
                } hover:bg-muted/50 rounded-md transition-colors py-0`}
              >
                <div className="flex items-center gap-2">
                  <div className="bg-primary flex items-center justify-center text-primary-foreground rounded-full w-10 h-10 font-medium text-sm shadow-sm">
                    {generateProfileName()}
                  </div>
                  {isHovered && (
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">
                        {storedUser?.firstname} {storedUser?.lastname}
                      </span>
                      {/* <span className="text-xs text-muted-foreground">
                        {storedUser?.email}
                      </span> */}
                    </div>
                  )}
                </div>
              </AccordionTrigger>
              {isHovered && (
                <AccordionContent className="px-3">
                  <div className="flex flex-col gap-1.5 py-1 mt-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 h-9 hover:bg-muted/50 rounded-md transition-colors"
                      onClick={() => handleClick()}
                    >
                      <UserSearch className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Profile</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 h-9 hover:bg-muted/50 rounded-md transition-colors"
                      onClick={() => handleSettingsClick()}
                    >
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Settings</span>
                    </Button>
                    <div className="h-px bg-border my-1" />
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 h-9 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors"
                      onClick={() => signOut()}
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">Logout</span>
                    </Button>
                  </div>
                </AccordionContent>
              )}
            </AccordionItem>
          </Accordion>
          {!isEventeli && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleTheme()}
              className={`w-full hover:bg-muted ${
                isHovered ? "justify-start px-3" : "justify-center px-0"
              }`}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-5 w-5 transition-all" />
                  {isHovered && (
                    <span className="ml-3.5 text-sm">Light Mode</span>
                  )}
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5 transition-all" />
                  {isHovered && (
                    <span className="ml-3.5 text-sm">Dark Mode</span>
                  )}
                </>
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
          <span className="text-xs text-muted-foreground px-1">
            {isHovered ? "Version 1.0.0" : "v1.0.0"}
          </span>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
