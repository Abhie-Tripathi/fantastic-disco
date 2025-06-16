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
    <div className="flex flex-col items-center ">
      <TrackerContextProvider>
      {children}
      </TrackerContextProvider>
    </div>
  );
};

export default Layout;