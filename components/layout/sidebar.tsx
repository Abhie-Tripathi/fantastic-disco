"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import HeroLogo from "/public/HeroLogo.svg";
import HeroText from "/public/whrai.svg";
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
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context";

const Sidebar = () => {
  const { theme } = useTheme();
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  const links = [
    { name: "Dashboard", href: "/", icon: GridMasonry },
    {
      name: "Search Events",
      href: "/internal/search/events",
      icon: MagnifyingGlass,
    },
    {
      name: "Tracker",
      href: "/internal/trackers?tab=allTrackers",
      icon: LineChart,
    },
    { name: "Event Trends", href: "/internal/trends", icon: ChartBarRandom },
    {
      name: "Coordinate",
      href: "/internal/coordinate",
      icon: RefreshClockwise,
    },
    { name: "Outreach", href: "/internal/outreach", icon: Users },
    // { name: "API Tools", href: "/clients", icon: Wrench },
    // {
    //   name: "Documentation",
    //   href: "https://eventeli.com/docs",
    //   icon: BookOpen,
    // },
  ];

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <aside
      className={`fixed z-20 top-0 left-0 h-full bg-background transition-all duration-300 ease-in-out flex flex-col border-r ${
        isHovered ? "w-56" : "w-16"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-2 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <li key={link.name}>
                <Link href={link.href} passHref legacyBehavior>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full ${
                      isHovered ? "justify-start px-3" : "justify-center px-0"
                    } h-10 ${
                      isActive ? "bg-primary text-white hover:bg-primary" : ""
                    }`}
                    asChild
                  >
                    <a>
                      <Icon
                        color={theme == "dark" ? "#fff" : ""}
                        className="flex-shrink-0"
                      />
                      {isHovered && <span className="ml-2">{link.name}</span>}
                    </a>
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
