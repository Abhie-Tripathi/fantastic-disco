"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import HeroLogo from "/public/HeroLogo.svg";
import WidgetdashboardIcon from "@/app/components/sidebar/Icons/WidgetDashboard";
import BrandkitIcon from "@/app/components/sidebar/Icons/WidgetBrandKit";
import WidgetIcon from "@/app/components/sidebar/Icons/WidgetIcon2";
import EventsIcon from "@/app/components/sidebar/Icons/WidgetIcon3";
import HeroText from "/public/whrai.svg";
import {
  MagnifyingGlass,
  BookOpen,
  ChartBarRandom,
  LineChart,
  GridMasonry,
  Wrench,
} from "geist-icons";
import { Coordinate, Outreach } from "@/constants/index";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SheetClose } from "@/components/ui/sheet";
import { LogOut, Moon, Settings, Sun, User } from "lucide-react";
import { useAuthContext } from "@/context/auth";
import { useTheme } from "@/context";

const MobileSidebar = () => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAuthContext();

  const gtmLinks = [
    { name: "Dashboard", href: "/internal", icon: GridMasonry },
    {
      name: "Search",
      href: "/internal/search/events",
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
    { name: "Outreach", href: "/internal/outreach", icon: Outreach },
  ];
  const geniLinks = [
    {
      name: "Dashboard", href: "/widget/dashboard", icon: <WidgetdashboardIcon />
    },
    { name: "Brandkit", href: "/widget/brandkit", icon: <BrandkitIcon /> },
    { name: "Widget", href: "/widget/list", icon: <WidgetIcon /> },
    { name: "Events", href: "/widget/events", icon: <EventsIcon /> },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center p-4 border-b">
        <Image src={HeroLogo} alt="logo" width={40} height={40} />
        <Image
          className="ml-2 mb-[6px]"
          src={HeroText}
          alt="logotext"
          height={24}
          style={theme === "dark" ? { filter: "invert(100%)" } : {}}
        />
      </div>
      <nav className="flex-1">
        <ul className="p-2 space-y-1">
          {pathname.startsWith("/internal") ? (
            gtmLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.name === "Tracker" && pathname.startsWith("/internal/trackers"));
              return (
                <li key={link.name}>
                  <SheetClose asChild>
                    <Link href={link.href}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={`w-full justify-start px-3 h-10 ${isActive ? "bg-primary text-white hover:bg-primary" : ""
                          }`}
                      >
                        <Icon
                          className="flex-shrink-0 mr-2"
                          color={theme === "dark" ? "#fff" : ""}
                        />
                        <span>{link.name}</span>
                      </Button>
                    </Link>
                  </SheetClose>
                </li>
              );
            })
          ) : (
            geniLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.name}>
                  <SheetClose asChild>
                    <Link href={link.href}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={`w-full justify-start px-3 h-10 ${isActive ? "bg-primary text-white hover:bg-primary" : ""
                          }`}
                      >
                        {/* <Icon
                          className="flex-shrink-0 mr-2"
                          color={theme === "dark" ? "#fff" : ""}
                        /> */}
                        <div className="flex items-center gap-2">
                          {link.icon}
                          <span>{link.name}</span>
                        </div>

                      </Button>
                    </Link>
                  </SheetClose>
                </li>
              );
            })
          )}

        </ul>
        <Separator className="my-2 px-2" />
        <ul className="p-2 space-y-1">
          <li>
            <SheetClose asChild>
              <Link href="/internal/settings/product">
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 h-10"
                >
                  <Settings className="flex-shrink-0 mr-2" />
                  <span>Settings</span>
                </Button>
              </Link>
            </SheetClose>
          </li>
          <li>
            <SheetClose asChild>
              <Link href="/internal/profile">
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 h-10"
                >
                  <User className="flex-shrink-0 mr-2" />
                  <span>Profile</span>
                </Button>
              </Link>
            </SheetClose>
          </li>
          <li>
            <SheetClose asChild>
              <Button
                variant="ghost"
                className="w-full justify-start px-3 h-10 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => signOut()}
              >
                <LogOut className="flex-shrink-0 mr-2" />
                <span>Logout</span>
              </Button>
            </SheetClose>
          </li>
        </ul>
      </nav>
      <Button className="ml-3 mb-3" variant="ghost" size="icon" onClick={() => toggleTheme()}>
        {theme === "dark" ? (
          <Sun className="h-5 w-5 transition-all" />
        ) : (
          <Moon className="h-5 w-5  transition-all" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
      <span className="text-xs text-muted-foreground px-4 mb-3">Version 1.0.0</span>
    </div>
  );
};

export default MobileSidebar;