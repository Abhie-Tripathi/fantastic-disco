"use client";

import React, { useEffect, useState } from "react";
import styles from "./navbar.style.module.css";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import HeroLogo from "/public/HeroLogo.svg";
import HeroText from "/public/whrai.svg";
import {
  Grip,
  LogOut,
  Megaphone,
  Moon,
  Settings,
  Sun,
  UserSearch,
  Search,
  Menu,
  Bell,
} from "lucide-react";
import { useAuthContext } from "@/context/auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { RefreshClockwise } from "geist-icons";
import { isEventeli } from "@/config";
import { useTheme } from "@/context/theme";
import Link from "next/link";
import MobileSidebar from "./mobile-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import path from "path";
import VideoModal from "@/components/layout/videoModal";

const gtmroutes: Record<string, string> = {
  "": "Dashboard",
  coordinate: "Coordinate",
  search: "Research",
  trackers: "Trackers",
  outreach: "Outreach",
  trends: "Trends",
  settings: "Settings",
};
const geniroutes: Record<string, string> = {
  list: "Widgets",
  edit: "Edit Widget",
  add: "Add Widget",
  brandkit: "Brandkit",
  events: "Events",
  dashboard: "Dashboard",
  overview: "Manage",
  settings: "Manage",
  guests: "Manage",
  profile: "Settings",
  product: "Settings",
};

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuthContext();
  const { theme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // const { theme, toggleTheme } = useTheme();

  function getRoute(path: string | undefined): string {
    return gtmroutes[path || ""];
  }
  const router = useRouter();
  const handleRoute = (route: string) => {
    if (route === "research") {
      router.push("/internal");
    } else if (route === "promote") {
      router.push("/widget/dashboard");
    }
  };

  const route = pathname.split("/")[1];
  const handleClick = () => {
    if (route === "internal") {
      router.push("/internal/settings/profile");
    }
    if (route === "widget") {
      router.push("/widget/settings/profile");
    }
  };

  // const generateProfileName = React.useMemo(() => {
  //   if (user) {
  //     // const { email } = user;
  //     // const [username] = email.split("@");
  //     // const parts = username.split(/[.\-_]/);
  //     // const abbreviation =
  //     //   parts.length > 1
  //     //     ? `${parts[0][0]}${parts[1][0]}`
  //     //     : username.substring(0, 2);
  //     // return abbreviation.toUpperCase();
  //     const firstNameInitial = user?.firstname?.[0]?.toUpperCase() || "";
  //     const lastNameInitial = user?.lastname?.[0]?.toUpperCase() || "";
  //     return `${firstNameInitial}${lastNameInitial}`;
  //   }
  //   return "";
  // }, [user]);

  const [storedUser, setStoredUser] = useState<any>(null);
  const [emptyFields, setEmptyFields] = useState<string[]>([]);

  useEffect(() => {
    // Ensure this code runs only on the client side
    const user = localStorage.getItem("user");
    setStoredUser(user ? JSON.parse(user) : null);

    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      setStoredUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (storedUser) {
      const fields = [];
      if (!storedUser.imageURL || storedUser.imageURL === "") {
        fields.push("profilePicture");
      }
      setEmptyFields(fields);
    }
  }, [storedUser]);

  const generateProfileName = () => {
    if (storedUser) {
      const firstNameInitial = storedUser?.firstname?.[0]?.toUpperCase() || "";
      const lastNameInitial = storedUser?.lastname?.[0]?.toUpperCase() || "";
      return `${firstNameInitial}${lastNameInitial}`;
    }
    return "";
  };

  const handleSettingsClick = () => {
    if (route === "internal") {
      router.push("/internal/settings/product");
    }
    if (route === "widget") {
      router.push("/widget/settings/profile");
    }
  };
  return (
    <header className="bg-background border-b">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 sm:max-w-64">
              <MobileSidebar />
            </SheetContent>
          </Sheet>
          <div className="flex items-center lg:hidden mr-2 max-[570px]:hidden">
            <Image src={HeroLogo} alt="logo" width={34} height={34} />
            <Image
              className="ml-2 mb-[6px]"
              src={HeroText}
              alt="logotext"
              height={22}
              style={theme === "dark" ? { filter: "invert(100%)" } : {}}
            />
          </div>
          <div className="text-lg font-semibold hidden lg:block">
            {pathname.split("/")[1] === "internal"
              ? (
                <div className="flex items-center">
                  {getRoute(pathname.split("/")[2])}
                  <div className="ml-2 " >
                    <VideoModal source={pathname.split("/")[2]} />
                  </div>
                  {pathname.split("/")[2] === "trends" && (
                    <Badge variant="default" className="text-xs font-medium px-2 py-0.5 ml-2 h-5">Beta</Badge>
                  )}
                </div>
              )
              : pathname.split("/").slice(-2)[0] === "edit"
              ? "Edit Widget"
              : geniroutes[pathname.split("/").slice(-1)[0]]}
          </div>
        </div>
        <div className="hidden max-[570px]:block">
          <div className="items-center flex">
            <Image src={HeroLogo} alt="logo" width={34} height={34} />
            <Image
              className="ml-2 mb-[6px]"
              src={HeroText}
              alt="logotext"
              height={22}
              style={theme === "dark" ? { filter: "invert(100%)" } : {}}
            />
          </div>
        </div>
        <div className="flex items-center gap-1">
          {!isEventeli && (
            <>
              <div className="flex items-center gap-1 max-[570px]:hidden">
                <div className="flex flex-col items-center">
                  <Button
                    onClick={() => handleRoute("research")}
                    variant="ghost"
                    className={`flex items-center justify-center gap-2 h-auto`}
                  >
                    <Search className="h-6 w-6" />
                    <span className="text-xs">Plan</span>
                  </Button>
                  <div
                    className={
                      pathname.split("/")[2] !== "company" &&
                      pathname.split("/")[2] !== "user" &&
                      pathname.split("/")[1] === "internal"
                        ? "border-b-[2px] border-[var(--primary-color)] rounded-md w-[60px]"
                        : ""
                    }
                  ></div>
                </div>
                <div className="border-r-[1px] border-[var(--border-color)] h-[20px]"></div>
                <div className="flex flex-col items-center">
                  <Button
                    onClick={() => handleRoute("promote")}
                    variant="ghost"
                    className="flex items-center justify-center gap-2 h-auto"
                  >
                    <Megaphone className="h-6 w-6" />
                    <span className="text-xs">Promote</span>
                  </Button>
                  <div
                    className={
                      pathname.split("/")[1] === "widget"
                        ? "border-b-[2px] border-[var(--primary-color)] rounded-md w-[80px]"
                        : ""
                    }
                  ></div>
                </div>
                <div className="border-r-[1px] border-[var(--border-color)] h-[20px]"></div>
              </div>
              <div className="hidden max-[570px]:block">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Grip className="h-5 w-5" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-52 p-0" align="end">
                    <div className="grid grid-cols-2 gap-2">
                      {pathname.split("/")[1] === "internal" && (
                        <Button
                          onClick={() => handleRoute("promote")}
                          variant="ghost"
                          className="flex flex-col items-center justify-center gap-2 h-auto p-4"
                        >
                          <Megaphone className="h-6 w-6" />
                          <span className="text-xs">Promote</span>
                        </Button>
                      )}
                      {pathname.split("/")[1] === "widget" && (
                        <Button
                          onClick={() => handleRoute("research")}
                          variant="ghost"
                          className="flex flex-col items-center justify-center gap-2 h-auto p-4"
                        >
                          <Search className="h-6 w-6" />
                          <span className="text-xs">Plan</span>
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}
          {/* {!isEventeli && (
            <Button variant="ghost" size="icon" onClick={() => toggleTheme()}>
              {theme === "dark" ? (
                <Sun className="h-5 w-5 transition-all" />
              ) : (
                <Moon className="h-5 w-5  transition-all" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )} */}

          <div className="hidden lg:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-2 py-1.5 border-b">
                  <span className="text-sm font-medium">Notifications</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {emptyFields.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No new notifications
                    </div>
                  ) : (
                    emptyFields.map((field, index) => (
                      <div key={index} className="px-2 py-2 hover:bg-muted/50 cursor-pointer" onClick={handleClick}>
                        <div className="flex items-start gap-2">
                          <div className="bg-primary flex items-center justify-center text-primary-foreground rounded-full w-8 h-8 font-medium text-sm">
                            {generateProfileName()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                {storedUser?.firstname} {storedUser?.lastname}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              Profile picture is missing from your profile
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
