"use client";
import React, { useState } from "react";
import styles from "./layout.style.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context";
import Image from "next/image";
import MoreIcon from "/public/dots.svg";
import Add from "/public/add.svg";

const Layout = ({ children }: { children: React.ReactNode }) => {
//   const pathName = usePathname();
//   const { theme } = useTheme()
// const [modal,setModal]=useState(false);
  return (
    <div className={`${styles.container}`}>
        <div className={styles.bar}>
            <div className={styles.leftNav}>
            Events in Bangalore
            </div>
            <div className={styles.rightNav}>
                <div>Bengaluru, Karnataka, India (1.34 mi radius) </div>
            </div>
        </div>
      {children}
    </div>
  );
};

export default Layout;