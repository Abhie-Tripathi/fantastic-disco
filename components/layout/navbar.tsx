"use client";

import React, { useState } from "react";
import styles from "./navbar.style.module.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import HeroLogo from "/public/HeroLogo.svg";
import HeroText from "/public/whrai.svg";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { isEventeli } from "@/config";
import { useTheme } from "@/context/theme";
import { Sheet, SheetTrigger, SheetContent } from "../ui/sheet";
import Image from "next/image";
import MobileSidebar from "./mobile-sidebar";

const gtmroutes: Record<string, string> = {
  internal: "Dashboard",
  coordinate: "Coordinate",
  events: "Research",
  trackers: "Trackers",
  outreach: "Outreach",
  trends: "Event Trends",
};
const geniroutes: Record<string, string> = {
  "list": "Widgets",
  "edit": "Edit Widget",
  "add": "Add Widget",
  "brandkit": "Brandkit",
  "events": "Events",
  "dashboard": "Dashboard",
  "overview": "Manage",
  "settings": "Manage",
  "guests": "Manage"
};

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuthContext();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  console.log("route", pathname.split("/").slice(-1)[0])

  const router = useRouter();
  const handleRoute = (route: string) => {
    if (route === "research") {
      router.push("/internal");
    } else if (route === "promote") {
      router.push("/widget/dashboard");
    }
  };

  return (
    <header className="bg-background border-b">
      <div className="flex items-center justify-between px-4 sm:px-4 py-3">
        <div className="flex items-center">
          <div className="text-lg font-semibold">
            {pathname.split("/")[1] === "internal" ?
              gtmroutes[pathname.split("/").slice(-1)[0]]
              : pathname.split("/").slice(-2)[0] === "edit" ? "Edit Widget" : geniroutes[pathname.split("/").slice(-1)[0]]}
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
                    variant="ghost"
                    className="flex flex-col items-center justify-center gap-2 h-auto p-4"
                  >
                    <UserSearch className="h-6 w-6" />
                    <span className="text-xs">Prospect</span>
                  </Button>
                  <div className={styles.tag}>Coming soon</div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="items-center bg-transparent p-1 hidden lg:!flex "
              >
                <div className="bg-primary lg:!flex items-center justify-center text-primary-foreground hover:bg-primary rounded-full w-10 h-10 hidden">
                  {user
                    ? `${user?.firstname[0]?.toUpperCase() ?? ""}${
                        user?.lastname?.[0]?.toUpperCase() ?? ""
                      }`
                    : ""}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => signOut()}
                className="flex items-center"
              >
                <LogOut className="h-4 w-4" />
                <span className="ml-2">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:!hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 sm:max-w-64">
              <MobileSidebar />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
