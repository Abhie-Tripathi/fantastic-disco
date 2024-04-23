"use client";
import React from "react";
import styles from "./layout.style.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const pathName = usePathname();

    return (
        <div className={styles.container}>
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
    );
};

export default Layout;