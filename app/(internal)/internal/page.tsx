"use client";
import React, { Suspense, useState } from "react";
import styles from "./page.style.module.css";
import Research from '/public/internal/research.svg'
import Image from "next/image";
import GotoIcon from "/public/rightArrow.svg";
import NewEvent from "/public/thunder.svg";
import Explore from "/public/search.svg";
import Location from "/public/location.svg";
import LocationPoint from "/public/locationPointer.svg";
import Timer from "/public/clock.svg";
import CircleCross from "/public/close.svg";
import Link from "next/link";
import ExhibitIcon from '/public/internal/exhibit.svg'
import DatasetIcon from '/public/dataset.svg'
import Loading from "@/app/components/UI/Loading";
import PolarAreaChart from "@/app/components/internal/trackers/PolarAreaChart/PolarArea";
import LineChart from "@/app/components/internal/eventtrends/chart/LineChart";

const cardsData = [
  {
    icon: Research,
    title: "Continue Research",
    heading: "Bengaluru",
    description: "Bengaluru, Karnataka, India (1.34 mi radius)",
    link: "/internal/search/events",
    tags: []
    // backgroundIcon: SearchBackground,
  },
  {
    icon: ExhibitIcon,
    title: "Outreach",
    heading: "",
    description:
      "Pending events to look at : 3",
    link: "/internal/outreach",
    tags: []
    // backgroundIcon: NotificationBackground,
  },
  {
    icon: DatasetIcon,
    title: "Coordinate",
    heading: "",
    description:
      "Total Events : 8",
    link: "/internal/coordinate",
    tags: [
      { "name": "Exhibitors", "count": 1 },
      { "name": "Sponsors", "count": 3 },
      { "name": "Speakers", "count": 3 },
      { "name": "Attendee", "count": 1 }
    ]
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
          {/* <div className={styles.primary_description}>
            Unlock the possibilities of EventGTM
          </div> */}
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
                <div className={styles.linkCard_tagsOuterContainer}>
                  {card.tags.map((tag, key) => (
                    <div className={styles.linkCard_tagsInnerContainer} key={key}>
                      <div className={styles.linkCard_tagsName} >{tag.name}</div>
                      <div className={styles.linkCard_tagsCount} >{tag.count}</div>
                    </div>
                  ))}
                </div>

              </Link>
            ))}
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