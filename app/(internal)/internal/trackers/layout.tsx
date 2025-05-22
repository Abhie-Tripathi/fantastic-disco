"use client";
import React, { useState } from "react";
import styles from "./layout.style.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context";
import { TrackerContextProvider } from "@/context/tracker";
// import Image from "next/image";
// import MoreIcon from "/public/dots.svg";
// import Add from "/public/add.svg";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  const { theme } = useTheme()
// const [modal,setModal]=useState(false);
  return (
    <div className="md:min-w-[810px] flex flex-col gap-[35px] items-center min-h-[calc(100vh-67px)]">
     
      <TrackerContextProvider>
      {children}
      </TrackerContextProvider>
    </div>
  );
};

export default Layout;