"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { useAuthContext } from "@/context/auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RefreshClockwise } from "geist-icons";
import { isEventeli } from "@/config";
import { useTheme } from "@/context/theme";
import Link from "next/link";
import MobileSidebar from "./mobile-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const gtmroutes: Record<string, string> = {
  "": "Dashboard",
  coordinate: "Coordinate",
  search: "Research",
  trackers: "Trackers",
  outreach: "Outreach",
  trends: "Event Trends",
  settings: "Settings",
  prospect: "Prospect",
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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  function getRoute(path: string | undefined): string {
    return gtmroutes[path || ""];
  }
  const router = useRouter();
  const handleRoute = (route: string) => {
    if (route === "research") {
      router.push("/internal");
    } else if (route === "promote") {
      router.push("/widget/dashboard");
    } else if (route === "prospect") {
      router.push("/internal/prospect");
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

  const generateProfileName = React.useMemo(() => {
    if (user) {
      const { email } = user;
      const [username] = email.split("@");
      const parts = username.split(/[.\-_]/);
      const abbreviation =
        parts.length > 1
          ? `${parts[0][0]}${parts[1][0]}`
          : username.substring(0, 2);
      return abbreviation.toUpperCase();
    }
    return "";
  }, [user]);

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
          <div className="flex items-center lg:hidden mr-2">
            <Image src={HeroLogo} alt="logo" width={34} height={34} />
            <Image
              className="ml-2 mb-[6px]"
              src={HeroText}
              alt="logotext"
              height={22}
            />
          </div>
          <div className="text-lg font-semibold hidden lg:block">
            {pathname.split("/")[1] === "internal"
              ? getRoute(pathname.split("/")[2])
              : pathname.split("/").slice(-2)[0] === "edit"
              ? "Edit Widget"
              : geniroutes[pathname.split("/").slice(-1)[0]]}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {!isEventeli && (
            <Button variant="ghost" size="icon" onClick={() => toggleTheme()}>
              {theme === "dark" ? (
                <Sun className="h-5 w-5 transition-all" />
              ) : (
                <Moon className="h-5 w-5  transition-all" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}

          {!isEventeli && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Grip className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-52 p-0" align="end">
                <div className="grid grid-cols-2 gap-2">
                  {pathname.split("/")[1] === "internal" ? (
                    <Button
                      onClick={() => handleRoute("promote")}
                      variant="ghost"
                      className="flex flex-col items-center justify-center gap-2 h-auto p-4"
                    >
                      <Megaphone className="h-6 w-6" />
                      <span className="text-xs">Promote</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleRoute("research")}
                      variant="ghost"
                      className="flex flex-col items-center justify-center gap-2 h-auto p-4"
                    >
                      <Search className="h-6 w-6" />
                      <span className="text-xs">Research</span>
                    </Button>
                  )}

                  <Button
                    onClick={() => handleRoute("prospect")}
                    variant="ghost"
                    className="flex flex-col items-center justify-center gap-2 h-auto p-4"
                  >
                    <UserSearch className="h-6 w-6" />
                    <span className="text-xs">Prospect</span>
                  </Button>
                  {/* <div className={styles.tag}>Coming soon</div> */}
                </div>
              </PopoverContent>
            </Popover>
          )}

          <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="flex items-center bg-transparent p-1 "
              >
                <div className="bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary rounded-full w-10 h-10">
                  {generateProfileName}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleClick()}
                className="flex items-center cursor-pointer"
              >
                <UserSearch className="h-4 w-4" />
                <span className="ml-2">Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSettingsClick()}
                className="flex items-center cursor-pointer"
              >
                <Settings className="h-4 w-4" />
                <span className="ml-2">Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => signOut()}
                className="flex items-center cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span className="ml-2">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
