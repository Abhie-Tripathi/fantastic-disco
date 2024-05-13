"use client";
import React from "react";
import styles from "./page.style.module.css";
import MoreIcon from "/public/dots.svg";
import Image from "next/image";
import Add from "/public/add.svg";
import TrackerCard from "@/app/components/internal/trackers/TrackerCard";
import Link from "next/link";
import { useTheme } from "@/context";
import { usePathname } from "next/navigation";

const Trackers = () => {
    const { theme } = useTheme()
    const pathName = usePathname();
    return (
        <div className={styles.body}>
            <div className={styles.header_container}>
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
                <div className={styles.trackers_header}>
                    <div className={styles.trackers_header_more_button}>
                        <Image src={MoreIcon} alt="moreicon" />
                    </div>
                    <Link
                        href="trackers/create"
                        className={styles.trackers_header_newtracker_button}
                    >
                        <Image src={Add} alt="addicon" />
                        New Tracker
                    </Link>
                </div>
            </div>
            <div className={styles.trackers_card_container}>
                <TrackerCard />
                <TrackerCard />
                <TrackerCard />
                <TrackerCard />
            </div>
        </div>
    );
};

export default Trackers;