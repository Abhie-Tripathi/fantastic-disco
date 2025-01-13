"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import HeroLogo from "/public/HeroLogo.svg";
import HeroText from "/public/whrai.svg";
import {
  MagnifyingGlass,
  BookOpen,
  ChartBarRandom,
  LineChart,
  GridMasonry,
  Wrench,
} from "geist-icons";
import { Coordinate, Outreach } from "@/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SheetClose } from "@/components/ui/sheet";
import { LogOut, User } from "lucide-react";
import { useAuthContext } from "@/context/auth";

const MobileSidebar = () => {
  const pathname = usePathname();
  const { signOut } = useAuthContext();

  const links = [
    { name: "Dashboard", href: "/", icon: GridMasonry },
    { name: "Search Events", href: "/search/events", icon: MagnifyingGlass },
    { name: "Tracker", href: "/trackers", icon: LineChart },
    { name: "Event Trends", href: "/trends", icon: ChartBarRandom },
    { name: "Coordinate", href: "/coordinate", icon: Coordinate },
    { name: "Outreach", href: "/outreach", icon: Outreach },
    { name: "API Tools", href: "/clients", icon: Wrench },
    {
      name: "Documentation",
      href: "https://eventeli.com/docs",
      icon: BookOpen,
    },
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
        />
      </div>
      <nav className="flex-1">
        <ul className="p-2 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <li key={link.name}>
                <SheetClose asChild>
                  <Link href={link.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={`w-full justify-start px-3 h-10 ${
                        isActive ? "bg-primary text-white hover:bg-primary" : ""
                      }`}
                    >
                      <Icon className="flex-shrink-0 mr-2" />
                      <span>{link.name}</span>
                    </Button>
                  </Link>
                </SheetClose>
              </li>
            );
          })}
        </ul>
        <Separator className="my-2 px-2" />
        <ul className="p-2 space-y-1">
          <li>
            <SheetClose asChild>
              <Link href="/profile">
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
    </div>
  );
};

export default MobileSidebar;
