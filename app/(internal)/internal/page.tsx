"use client";
import React, { Suspense, useState } from "react";
import styles from "./page.style.module.css";
import SearchIcon from "/public/search.svg";
import Image from "next/image";
import GotoIcon from "/public/rightArrow.svg";
import NotificationIcon from "/public/bell.svg";
import TrackerIcon from "/public/internal/trend.svg";
import NotificationsIcon from "/public/bell.svg";
// import Warning from "/public/warning.svg";
import Weather from "/public/weather.svg";
// import Stars from "/public/stars.svg";
import NewEvent from "/public/thunder.svg";
import Explore from "/public/search.svg";
import Location from "/public/location.svg";
import LocationPoint from "/public/locationPointer.svg";
import Timer from "/public/clock.svg";
import CircleCross from "/public/close.svg";
import Link from "next/link";
import ExhibitIcon from '/public/internal/exhibit.svg'
// import SearchBackground from "/public/search_background.svg";
// import NotificationBackground from "/public/notification_background.svg";
// import TrendsBackground from "/public/trends_background.svg";
import Loading from "@/app/components/UI/Loading";
import PolarAreaChart from "@/app/components/internal/trackers/PolarAreaChart/PolarArea";
import LineChart from "@/app/components/internal/eventtrends/chart/LineChart";

const cardsData = [
  {
    icon: SearchIcon,
    title: "Continue Search",
    heading: "Bengaluru",
    description: "Bengaluru, Karnataka, India (1.34 mi radius)",
    link: "/internal/search/events",
    // backgroundIcon: SearchBackground,
  },
  {
    icon: ExhibitIcon,
    title: "Outreach",
    heading: "",
    description:
      "Quickly manage and prioritize your notifications to focus on what matters most.",
    link: "/internal/outreach",
    // backgroundIcon: NotificationBackground,
  },
  {
    icon: TrackerIcon,
    title: "Create tracker",
    heading: "",
    description:
      "Track key events in real-time to make informed decisions and seize opportunities as they arise.",
    link: "/internal/trackers/create",
    // backgroundIcon: TrendsBackground,
  },
];

const trackerCardsData = [
  {
    icon: NewEvent,
    title: "New",
    stats: "115",
  },
  {
    icon: Timer,
    title: "Active",
    stats: "74",
  },
  {
    icon: CircleCross,
    title: "Expired",
    stats: "41",
  },
];

const Dashboard = () => {
  const [activeChipY, setActiveChipY] = useState("Predicted Attendance");
  const [activeChipX, setActiveChipX] = useState("Date");
  return (
    <div className={styles.container}>
      <div className={styles.header_container}>
        <div className={styles.primary_container}>
          <div className={styles.primary_header}>Welcome back!</div>
          <div className={styles.primary_description}>
            Unlock the possibilities of EventGTM
          </div>
          <div className={styles.linkCard_container}>
            {cardsData.map((card) => (
              <Link
                href={card.link}
                className={styles.linkCard}
                key={card.title}
              >
                <div className={styles.linkCard_header}>
                  <div className={styles.linkCard_header_title}>
                    <Image src={card.icon} alt="search" />
                    <span>{card.title}</span>
                  </div>
                  <Image src={GotoIcon} alt="goto" />
                </div>

                {card?.heading && (
                  <div key={card.title} className={styles.linkCard_heading}>
                    {card.heading}
                  </div>
                )}
                <div className={styles.linkCard_description}>
                  {card.description}
                </div>

                {/* <Image
                  className={styles.linkCard_backgroundImage}
                  src={card.backgroundIcon}
                  alt={card.title}
                /> */}
              </Link>
            ))}
          </div>
        </div>
        <span className={styles.divider}></span>
        <div className={styles.notification_container}>
          <div className={styles.notification_header}>
            <div className={styles.notification_header_title}>
              <Image src={NotificationsIcon} alt="notificationsicon" />
              <span>Notification</span>
            </div>
            <div className={styles.notification_status}>
              {/* <Image src={Warning} alt="warning" /> */}
              <span>Moderate</span>
            </div>
          </div>
          <div className={styles.notification_card}>
            <div className={styles.linkCard_header}>
              <div className={styles.linkCard_header_title}>
                <Image src={Weather} alt="search" />
                <span>Weather Alert</span>
              </div>
              <div className={styles.viewButton}>View</div>
            </div>

            <div className={styles.notification_description}>
              Potential impact on events due to moderate severe weather
              conditions in your area.
            </div>
          </div>
        </div>
      </div>

      <div className={styles.body_container}>
        <div className={styles.trackers_container}>
          <div className={styles.tracker_container_header}>
            {/* <Image src={Stars} alt="stars" /> */}
            <div>Here &apos;s what&apos;s new since you last checked in</div>
          </div>
          <div className={styles.tracker_card}>
            <div className={styles.tracker_card_header}>
              <span>Tracker 1 - Events in Bangalore</span>
              <Image src={GotoIcon} alt="goto" />
            </div>

            <div className={styles.event_cards_container}>
              {trackerCardsData.map((trackerCard) => (
                <div key={trackerCard.title} className={styles.eventCard}>
                  <div className={styles.eventCard_title}>
                    <Image src={trackerCard.icon} alt="newevent" />
                    <span>{trackerCard.title}</span>
                  </div>
                  <div className={styles.eventCard_stats}>
                    <div className={styles.eventCard_stats_no}>
                      {trackerCard.stats}
                    </div>
                    <div className={styles.eventCard_description}>Events</div>
                  </div>
                </div>
              ))}

              <PolarAreaChart className={styles.events_stats_polarChart} />
            </div>
          </div>

          <div className={styles.tracker_card}>
            <div className={styles.tracker_card_header}>
              <span>Tracker 2 - Events in Allahabad</span>
              <Image src={GotoIcon} alt="goto" />
            </div>
            <div className={styles.event_cards_container}>
              {trackerCardsData.map((trackerCard) => (
                <div key={trackerCard.title} className={styles.eventCard}>
                  <div className={styles.eventCard_title}>
                    <Image src={trackerCard.icon} alt="newevent" />
                    <span>{trackerCard.title}</span>
                  </div>
                  <div className={styles.eventCard_stats}>
                    <div className={styles.eventCard_stats_no}>
                      {trackerCard.stats}
                    </div>
                    <div className={styles.eventCard_description}>Events</div>
                  </div>
                </div>
              ))}
              <PolarAreaChart className={styles.events_stats_polarChart} />
            </div>
          </div>
        </div>

        <span className={styles.body_divider}></span>

        <div className={styles.trends_container}>
          <div className={styles.trends_container_header}>
            <Image src={Explore} alt="explore" />
            <div>Explore some latest and trending events near you!</div>
            <button>Explore</button>
          </div>

          <div className={styles.trends_location_container}>
            <Image src={Location} alt="location" />
            <span>Bengaluru, Karnataka, India (1.34 mi radius)</span>
            <button>
              <Image src={LocationPoint} alt="locationpoint" />
              <span>Choose Location</span>
            </button>
          </div>

          <div className={styles.tab_container}>
            <div className={`${styles.tab} ${styles.active}`}>
              Predicted Attendance
            </div>
            <div className={styles.tab}>No of Events</div>
          </div>
          <Suspense fallback={<Loading />}>
            <LineChart activeChipY={activeChipY} activeChipX={activeChipX} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;