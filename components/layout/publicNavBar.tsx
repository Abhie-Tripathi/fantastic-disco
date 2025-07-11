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
import WhrAIText from '@/public/whrai.svg'
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
  ArrowUpRight,
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
import { GAEvent } from "@/utils/GAEvent";
import { useProfileServices } from "@/services/profileService";
import { MembershipPlan } from "@/data/membershipPlans";

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

export default function Navbar({isPublic}:{isPublic:boolean}) {
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
  const { getMembershipData } = useProfileServices();
  const [membershipData, setMembershipData] = useState<any>(null);

//   useEffect(() => {
//     // Ensure this code runs only on the client side
//     const user = localStorage.getItem("user");
//     setStoredUser(user ? JSON.parse(user) : null);

//     const handleStorageChange = () => {
//       const updatedUser = localStorage.getItem("user");
//       setStoredUser(updatedUser ? JSON.parse(updatedUser) : null);
//     };

//     window.addEventListener("storage", handleStorageChange);
//     const interval = setInterval(handleStorageChange, 1000);

//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//       clearInterval(interval);
//     };
//   }, []);

//   useEffect(() => {
//     if (storedUser) {
//       const fields = [];
//       if (!storedUser.imageURL || storedUser.imageURL === "") {
//         fields.push("profilePicture");
//       }
//       setEmptyFields(fields);
//     }
//   }, [storedUser]);

//   useEffect(() => {
//     const fetchMembership = async () => {
//       try {
//         const data = await getMembershipData();
//         setMembershipData(data);
//       } catch (e) {
//         setMembershipData(null);
//       }
//     };
//     fetchMembership();
//   }, []);

//   const generateProfileName = () => {
//     if (storedUser) {
//       const firstNameInitial = storedUser?.firstname?.[0]?.toUpperCase() || "";
//       const lastNameInitial = storedUser?.lastname?.[0]?.toUpperCase() || "";
//       return `${firstNameInitial}${lastNameInitial}`;
//     }
//     return "";
//   };

//   const handleSettingsClick = () => {
//     if (route === "internal") {
//       router.push("/internal/settings/product");
//     }
//     if (route === "widget") {
//       router.push("/widget/settings/profile");
//     }
//   };

//   const handleUpgradeClick = () => {
//     window.open(
//       `https://whr.ai/pricing?utm_source=${isEventeli ? "geo" : "gtm"}&utm_campaign=pricing&utm_medium=web&utm_term=navbar_upgrade_plan`,
//       "_blank"
//     );
//     GAEvent(
//       "",
//       "Plan Upgrade",
//       "Navbar",
//       `${isEventeli ? "geo" : "gtm"} | pricing | web | navbar_upgrade_plan`
//     );
//   };
// const signUpHandler=()=>{
//   router.push("/signup")
// }
  return (
    <header className="bg-background border-b">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex md:hidden items-center gap-2">
            <Link href="https://whr.ai/gtm">
            <Image src={HeroLogo} alt="logo" width={40} height={40} />
            </Link>
            
          <Link href="https://whr.ai/gtm">
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
            {/* {pathname.split("/")[1] === "internal"
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
              : geniroutes[pathname.split("/").slice(-1)[0]]} */}
              {/* {(pathname.split("/")[1] === "usercollection" && !isPublic) && "User Collection"} */}
               <Image src={WhrAIText} alt="nav-logo" className="h-6 w-auto" />
          </div>
          </Link>
        </div>
        <div className="hidden md:block">
          <Link href="whr.ai/gtm">
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
          </Link>
        </div>
        <div className="hidden lg:flex space-x-6 py-2 ml-6 px-8 rounded-3xl transition-all duration-500 ease-in-out bg-white" style={{boxShadow:"var(--shadow-medium)"}}>
          <Link href="https://whr.ai/geo" className="text-black hover:text-primary text-lg">
            Geo
          </Link>
          <Link href="https://whr.ai/gtm" className="text-black hover:text-primary text-lg">
            Gtm
          </Link>
          {/* <Link href="/geni" className="text-black hover:text-primary text-lg">
            Geni
          </Link> */}
          <Link
            href="https://whr.ai/about"
            className="text-black hover:text-primary text-lg"
          >
            About
          </Link>
          <Link
            href="https://whr.ai/pricing"
            className="text-black hover:text-primary text-lg"
          >
            Pricing
          </Link>
        </div>
        <div className="flex items-center gap-1">
          <Link href="/signup">
          <Button className="bg-primary px-[15px] py-[8px] rounded-[10px] text-white cursor-pointer">
            Sign Up
          </Button>
          </Link>
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

          
        </div>
      </div>
    </header>
  );
}
