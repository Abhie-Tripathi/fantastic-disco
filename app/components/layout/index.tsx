"use client";
import React from "react";
import styles from "./layout.style.module.css";
import { usePathname } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Navbar from "@/app/components/Navbar";
import { AuthContextProvider } from '@/context'

const noNav = ["/signin", "/signup"];
const noBackground = [
  "/signin",
  "/signup",
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();

  return (
    <AuthContextProvider>
      <>
        {!noNav.includes(pathName) && <Sidebar />}
        {!noNav.includes(pathName) && <Navbar />}
        <div
          className={`${!noNav.includes(pathName) ? styles.container : ""} ${
            !noBackground.includes(pathName) ? styles.background : ""
          }`}
        >
          {children}
        </div>
      </>
    </AuthContextProvider>
  );
};

export default Layout;