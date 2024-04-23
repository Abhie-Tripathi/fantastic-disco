"use client";
import React from "react";
import styles from "./page.style.module.css";
import MoreIcon from "/public/dots.svg";
import Image from "next/image";
import Add from "/public/add.svg";
import TrackerCard from "@/app/components/internal/trackers/TrackerCard";
import Link from "next/link";

const eventData = [
    {
        title: "Sydney Royal Easter Show",
        organizer: "Royal Agricultural Society of NSW",
        new: true,
        startdate: "14 Nov 2024",
        enddate: "04 Apr 2024",
        location: "Sydney, Australia",
        category: "Entertainment & Media",
        est_audience: "15,000 - 25000",
        intl_audience: "Low",
    },
    {
        title: "Sydney Royal Easter Show",
        organizer: "Royal Agricultural Society of NSW",
        new: true,
        startdate: "14 Nov 2024",
        enddate: "04 Apr 2024",
        location: "Sydney, Australia",
        category: "Entertainment & Media",
        est_audience: "15,000 - 25000",
        intl_audience: "Low",
    },
    {
        title: "Sydney Royal Easter Show",
        organizer: "Royal Agricultural Society of NSW",
        new: true,
        startdate: "14 Nov 2024",
        enddate: "04 Apr 2024",
        location: "Sydney, Australia",
        category: "Entertainment & Media",
        est_audience: "15,000 - 25000",
        intl_audience: "Low",
    },
    {
        title: "Sydney Royal Easter Show",
        organizer: "Royal Agricultural Society of NSW",
        new: true,
        startdate: "14 Nov 2024",
        enddate: "04 Apr 2024",
        location: "Sydney, Australia",
        category: "Entertainment & Media",
        est_audience: "15,000 - 25000",
        intl_audience: "Low",
    },
    {
        title: "Sydney Royal Easter Show",
        organizer: "Royal Agricultural Society of NSW",
        new: true,
        startdate: "14 Nov 2024",
        enddate: "04 Apr 2024",
        location: "Sydney, Australia",
        category: "Entertainment & Media",
        est_audience: "15,000 - 25000",
        intl_audience: "Low",
    },
    {
        title: "Sydney Royal Easter Show",
        organizer: "Royal Agricultural Society of NSW",
        new: true,
        startdate: "14 Nov 2024",
        enddate: "04 Apr 2024",
        location: "Sydney, Australia",
        category: "Entertainment & Media",
        est_audience: "15,000 - 25000",
        intl_audience: "Low",
    },
];

const Trackers = () => {
    return (
        <div>
            <div className={styles.trackers_container}>
                <div className={styles.trackers_header}>
                    <div className={styles.trackers_header_title}>Your Trackers</div>
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