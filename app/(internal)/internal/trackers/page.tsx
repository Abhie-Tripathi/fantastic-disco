'use client'
import React from "react";
import styles from "./page.style.module.css";
    // import MoreIcon from "/public/dots.svg";
    // import Image from "next/image";
    // import Add from "/public/add.svg";
import TrackerCard from "@/app/components/internal/trackers/TrackerCard";
// import Link from "next/link";
import { useTheme } from "@/context";
// import { usePathname } from "next/navigation";

const Trackers = () => {
    const { theme } = useTheme()
    // const pathName = usePathname();
    return (
        <div className={styles.body}>
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