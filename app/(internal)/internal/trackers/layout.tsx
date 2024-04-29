"use client";
import React from "react";
import styles from "./layout.style.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const pathName = usePathname();
    const {theme} = useTheme()

    return (
        <div style={{ paddingTop: "70px", paddingLeft : "74px"}}>
        <div className={`${styles.container} ${theme === 'light' ? styles.container_light : ""}`}>
            <div className={styles.tab_container}>
                <Link
                    href="/internal/trackers"
                    className={`${styles.tab} ${pathName == "/internal/trackers" ? styles.active : ""
                        }`}
                >
                    Trackers
                </Link>
                <Link
                    href="/internal/trackers/savedevents"
                    className={`${styles.tab} ${pathName == "/internal/trackers/savedevents" ? styles.active : ""
                        }`}
                >
                    Saved Events
                </Link>
            </div>

            {children}
        </div>
        </div>
    );
};

export default Layout;