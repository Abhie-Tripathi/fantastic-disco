"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Grip,
  LogOut,
  Megaphone,
  Moon,
  Settings,
  Sun,
  UserSearch,
  Search
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

const routes: Record<string, string> = {
  internal: "Dashboard",
  "coordinate": "Coordinate",
  "events": "Research",
  "trackers": "Trackers",
  outreach: "Outreach",
  trends: "Event Trends"
};

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuthContext();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();


  console.log(routes[pathname.split("/").slice(-1)[0]])

  const router = useRouter()
  const handleRoute = (route : string) => {
    if(route === "research"){
      router.push("/internal")
    }else if(route === "promote"){
      router.push("/widget/dashboard")
    }
    
  }

  return (
    <header className="bg-background border-b">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <div className="text-lg font-semibold">
            {routes[pathname.split("/").slice(-1)[0]]}
            {/* {pathname.startsWith("/widget/list") ? "Widgets" : 
             pathname.startsWith("/widget/edit") ? "Edit Widget" : 
             pathname.startsWith("/widget/add") ? "Add Widget" : 
             pathname.startsWith("/widget/brandkit") ? "Brandkit" : 
             pathname.startsWith("/widget/event") ? "Events" : 
             pathname.startsWith("/widget/dashboard") ? "Dashboard" : 
             pathname.startsWith("/widget/events/manage") ? "" : 
             pathname.startsWith("/widget/profile") ? "Widget List" : 
             }  */}
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
                  {pathname.split("/")[1] === "internal" ?
                    <Button onClick={()=>handleRoute("promote")}
                      variant="ghost"
                      className="flex flex-col items-center justify-center gap-2 h-auto p-4"
                    >
                      <Megaphone className="h-6 w-6" />
                      <span className="text-xs">Promote</span>
                    </Button> : <Button onClick={()=>handleRoute("research")}
                      variant="ghost"
                      className="flex flex-col items-center justify-center gap-2 h-auto p-4"
                    >
                      <Search className="h-6 w-6" />
                      <span className="text-xs">Research</span>
                    </Button>}

                  <Button
                    variant="ghost"
                    className="flex flex-col items-center justify-center gap-2 h-auto p-4"
                  >
                    <UserSearch className="h-6 w-6" />
                    <span className="text-xs">Prospect</span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}

          <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="flex items-center bg-transparent p-1"
              >
                <div className="bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary rounded-full w-10 h-10">
                  {user
                    ? `${user?.firstname[0]?.toUpperCase() ?? ""}${user?.lastname?.[0]?.toUpperCase() ?? ""
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
        </div>
      </div>
    </header>
  );
}
