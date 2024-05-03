"use client";
import React from "react";
import styles from "./page.style.module.css";
import Research from "/public/internal/research.svg";
import Image from "next/image";
import GotoIcon from "/public/rightArrow.svg";
import NewEvent from "/public/thunder.svg";
import Timer from "/public/clock.svg";
import CircleCross from "/public/close.svg";
import Link from "next/link";
import ExhibitIcon from "/public/internal/exhibit.svg";
import DatasetIcon from "/public/dataset.svg";
import BellIcon from "/public/bell.svg";
import PolarAreaChart from "@/app/components/internal/trackers/PolarAreaChart/PolarArea";
import Trend from "/public/internal/trend.svg";
import Bookmark from "/public/bookmark.svg";
import BookmarkIcon from "@/app/components/Table/icons/bookmark";
import { useTheme } from "@/context";

const cardsData = [
  {
    icon: Research,
    title: "Continue Research",
    heading: "Bengaluru",
    description: ["Bengaluru, Karnataka, India (1.34 mi radius)"],
    link: "/internal/search/events",
    tags: [],
    // backgroundIcon: SearchBackground,
  },
  {
    icon: ExhibitIcon,
    title: "Outreach",
    heading: "",
    description: [
      "Pending events to look at : 3",
      "Shortlisted Events : 3",
      "Pre Finalised Events : 1",
    ],
    link: "/internal/outreach",
    tags: [],
    // backgroundIcon: NotificationBackground,
  },
  {
    icon: Trend,
    title: "Create tracker",
    heading: "",
    description: [
      "Track key events in real-time to make informed decisions and seize opportunities as they arise.",
    ],
    link: "/internal/trackers/create",
    tags: [],
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

const coordinateCardTags = [
  { name: "Exhibitors", count: 1 },
  { name: "Sponsors", count: 3 },
  { name: "Speakers", count: 3 },
  { name: "Attendee", count: 1 },
];

const notifications = [
  "@Walterwhite recommended you as a Speaker for Las vegas Event",
  "@Gusfring recommended you as a Atendee for Pollos Event",
  "@Pinkman recommended you as a Speaker for expo Event",
  "@Asackshra recommended you as a Speaker for Las vegas Event",
  "@Asackshra recommended you as a Speaker for Las vegas Event",
];

const savedEvents = [
  "Horn Ok Food Festival",
  "Theatre Festival",
  "Film Festival",
  "Auto Expo",
  "TED X",
];

const Dashboard = () => {
  const { theme } = useTheme();
  const iconClass = theme === "light" ? 'icons_light' : 'icon';


  // INstagram temporray
  const handleClick = () => {
    const url = 'https://share-functionality.vercel.app/';
    window.open(`https://www.instagram.com/create/story/?url=${encodeURIComponent(url)}`);
      };

  return (
    <div
      className={`${styles.container} ${
        theme === "light" ? styles.container_light : ""
      }`}
    >
      <div className={styles.header_container}>
        <div className={styles.primary_container}>
          <div className={styles.primary_header}>Welcome back!</div>
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
                  <Image src={GotoIcon} alt="goto" className={iconClass} />
                </div>

                {card?.heading && (
                  <div key={card.title} className={styles.linkCard_heading}>
                    {card.heading}
                  </div>
                )}
                <div className={styles.linkCard_description}>
                  {card.description.map((desc, key) => (
                    <div key={key}>{desc}</div>
                  ))}
                </div>
                <div className={styles.linkCard_tagsOuterContainer}>
                  {/* {card.tags.map((tag, key) => (
                    <div className={styles.linkCard_tagsInnerContainer} key={key}>
                      <div className={styles.linkCard_tagsName} >{tag.name}</div>
                      <div className={styles.linkCard_tagsCount} >{tag.count}</div>
                    </div>
                  ))} */}
                </div>
              </Link>
            ))}
          </div>
        </div>
        <span className={styles.divider}></span>
        <div className={styles.notification_container}>
          <div className={styles.notification_header_title}>
            <Image
              src={BellIcon}
              alt="notificationsicon"
              className={iconClass}
            />
            <span>Notification</span>
          </div>
          <div className={styles.notification_card}>
            {notifications.map((notification, key) => (
              <div
                key={key}
                className={`${styles.notification} ${
                  theme === "light" && styles.notification_light
                }`}
              >
                {notification}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.body_container}>
        <div className={styles.trackers_container}>
          <div
            className={`${styles.tracker_container_header} ${
              theme === "light" ? styles.tracker_content_light : ""
            }`}
          >
            {/* <Image src={Stars} alt="stars" /> */}
            <div>Here &apos;s what&apos;s new since you last checked in</div>
          </div>
          <div
            className={`${styles.tracker_card} ${
              theme === "light" && styles.tracker_content_light
            }`}
          >
            <div className={styles.tracker_card_header}>
              <span>Tracker 1 - Events in Bangalore</span>
              <Image src={GotoIcon} alt="goto" className={iconClass} />
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
          <div
            className={`${styles.tracker_card} ${
              theme === "light" && styles.tracker_content_light
            }`}
          >
            <div className={styles.tracker_card_header}>
              <span>Tracker 2 - Events in Allahabad</span>
              <Image src={GotoIcon} alt="goto" className={iconClass} />
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
        <div className={styles.savedEvent_coordinateContainer}>
          <div className={styles.savedEventsContainer}>
            <div className={styles.savedEventsHeader}>
              <Image src={Bookmark} alt="save" className={iconClass} />
              <div>Saved Events</div>
            </div>
            <div
              className={`${styles.savedEventsData} ${
                theme === "light" && styles.savedEventsData_light
              }`}
            >
              {savedEvents.map((event, key) => (
                <div
                  className={`${styles.savedEvent} ${
                    theme === "light" && styles.savedEvent_light
                  }`}
                  key={key}
                >
                  <div>{event}</div>
                  <BookmarkIcon fillColor={"#ff851b"} />
                </div>
              ))}
            </div>
          </div>
          <div
            className={`${styles.linkCard_container} ${styles.coordinateCard}`}
          >
            <Link href={"/internal/coordinate"} className={styles.linkCard}>
              <div className={styles.linkCard_header}>
                <div className={styles.linkCard_header_title}>
                  <Image src={DatasetIcon} alt="data" className={iconClass} />
                  <span>Coordiante</span>
                </div>
                <Image src={GotoIcon} alt="goto" className={iconClass} />
              </div>
              <div className={styles.linkCard_description}>
                <div>Total Events : 8</div>
              </div>
              <div className={styles.linkCard_tagsOuterContainer}>
                {coordinateCardTags.map((tag, key) => (
                  <div className={styles.linkCard_tagsInnerContainer} key={key}>
                    <div className={styles.linkCard_tagsName}>{tag.name}</div>
                    <div className={styles.linkCard_tagsCount}>{tag.count}</div>
                  </div>
                ))}
              </div>
            </Link>
          </div>
        </div>
      </div>
      {/* Instagram temporaray */}
      <button onClick={handleClick}>Share on Instagram</button>
      
    </div>
  );
};

export default Dashboard;
