"use client";
import React, { useEffect, useState } from "react";
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
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
import { useRouter } from "next/navigation";
import { Skeleton } from "@mui/material";
import TrackerSkeleton from "@/app/components/Skeleton/dashboardskeleton/TrackerSkeleton";
import SavedEventsSkeleton from "@/app/components/Skeleton/dashboardskeleton/SavedEventsSkeleton";
import SkeletonCards from "@/app/components/Skeleton/dashboardskeleton/CardsSkeleton";
import CoordinateSkeleton from "@/app/components/Skeleton/dashboardskeleton/CoordinateSkeleton";
import NotificationSkeleton from "@/app/components/Skeleton/dashboardskeleton/NotificationSkeleton";

interface SavedEvent {
  title: string;
  id: string;
}

interface CordinateType {
  totalEvent: string;
  stats: {
    attendee: Number;
    speakers: Number;
    sponsors: Number;
    exhibitors: Number;
  };
}
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
  // { totalEvents: 2 },
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
  const iconClass = theme === "light" ? "icons_light" : "icon";
  const [trackerList, setTrackerList] = useState([]);
  const [savedEvantsList, setSavedEventsList] = useState<SavedEvent[]>([]);
  const [cordinateData, setCordinateData] = useState<CordinateType>();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const getListOfTrackers = async () => {
      // setIsLoading(true);
      try {
        const data: any = await myFetch(`${baseUrl}/tracker`);
        setTrackerList(data?.data?.trackerData);
      } catch (error) {
        console.error("Error while fetching trackers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getListOfTrackers();
  }, []);

  useEffect(() => {
    const getSavedEvents = async () => {
      // setIsLoading(true);
      try {
        const data = await myFetch(`${baseUrl}/tracker/saved-events`);
        console.log("sade", data?.data);
        setSavedEventsList(data?.data?.savedEvents);
      } catch (error) {
        console.error("Error while fetching saved events:", error);
      } finally {
        // setIsLoading(false);
      }
    };
    getSavedEvents();
  }, []);

  useEffect(() => {
    const getCordinateList = async () => {
      // setIsLoading(true);
      try {
        const data = await myFetch(`${baseUrl}/userInterest/totalParticipent`);
        console.log("cordinate", data?.data);
        setCordinateData(data.data);
      } catch (error) {
        console.error("Error while fetching cordinate list:", error);
      } finally {
        // setIsLoading(false);
      }
    };
    getCordinateList();
  }, []);

  useEffect(() => {
    const getOutReachData = async () => {
      try {
        const [response1, response2, response3] = await Promise.all([
          myFetch(`${baseUrl}/userInterest/enquiry?status=SHORTLISTED`),
          myFetch(`${baseUrl}/userInterest/enquiry?status=IN_NEGO`),
          myFetch(`${baseUrl}/userInterest/enquiry?status=CONFIRMED`),
        ]);
        console.log(
          "outreach_data",
          response1?.data?.enquiryData,
          response2?.data?.enquiryData,
          response3?.data?.enquiryData
        );
      } catch (error) {
        console.error("Error while fetching outreach list:", error);
      }
    };
    getOutReachData();
  }, []);

  const getImageSrc = (status: any) => {
    switch (status) {
      case "ACTIVE":
        return NewEvent;
      case "CANCEL":
        return Timer;
      case "POSTPOND":
        return CircleCross;
      default:
        return "";
    }
  };

  const unsavedEvent = (id: string) => {
    const remainingItem = savedEvantsList.filter((item) => item.id !== id);
    setSavedEventsList(remainingItem);
  };

  console.log("cordinateData", cordinateData);

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
            {isLoading ? (
              <SkeletonCards />
            ) : (
              cardsData.map((card) => (
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
                    <Image
                      src={GotoIcon}
                      alt="goto"
                      className={`${iconClass} ${styles.goto_icon}`}
                    />
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
              ))
            )}
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
          {isLoading ? (
            <>
              <NotificationSkeleton />
            </>
          ) : (
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
          )}
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
            {isLoading ? (
              <>
                <TrackerSkeleton />
              </>
            ) : (
              trackerList?.slice(0, 1).map((item: any, id) => (
                <Link href={`/internal/trackers/${item.id}`} key={id}>
                  <div className={styles.tracker_card_header} key={id}>
                    <span key={id}>{`${item.name}`} </span>

                    <Image
                      src={GotoIcon}
                      alt="goto"
                      className={`${iconClass}`}
                    />
                  </div>
                  <div className={styles.event_cards_container}>
                    <div className={styles.desktop_trackerCard_container}>
                      {item?.filterValue?.status?.map((card_status: any) => (
                        <div key={item.id} className={styles.eventCard}>
                          <div className={styles.eventCard_title}>
                            <Image src={NewEvent} alt="status" />
                            <span>{card_status}</span>
                          </div>

                          <div className={styles.eventCard_stats}>
                            <div className={styles.eventCard_stats_no}>
                              {/* {trackerCard.stats} */}
                              {item.filterValue.event_rank_gte}
                            </div>
                            <div className={styles.eventCard_description}>
                              Events
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.mobile_trackerCard_container}>
                      {trackerCardsData.map((trackerCard, key) => (
                        <div className={styles.mobile_eventCard} key={key}>
                          <div className={styles.mobile_eventCard_title}>
                            {trackerCard.title}
                          </div>
                          <div className={styles.mobile_eventStats_container}>
                            {trackerCard.stats} Events
                          </div>
                        </div>
                      ))}
                    </div>
                    <PolarAreaChart
                      className={styles.events_stats_polarChart}
                    />
                  </div>
                </Link>
              ))
            )}
          </div>
          <div
            className={`${styles.tracker_card} ${
              theme === "light" && styles.tracker_content_light
            }`}
          >
            {isLoading ? (
              <>
                <TrackerSkeleton />
              </>
            ) : (
              trackerList?.slice(1, 2).map((item: any, id) => (
                <Link href={`/internal/trackers/${item.id}`} key={id}>
                  <div className={styles.tracker_card_header} key={id}>
                    <span key={id}>{`${item.name}`} </span>

                    <Image
                      src={GotoIcon}
                      alt="goto"
                      className={`${iconClass}`}
                    />
                  </div>
                  <div className={styles.event_cards_container}>
                    <div className={styles.desktop_trackerCard_container}>
                      {item?.filterValue?.status?.map((card_status: any) => (
                        <div key={item.id} className={styles.eventCard}>
                          <div className={styles.eventCard_title}>
                            <Image src={NewEvent} alt="status" />
                            <span>{card_status}</span>
                          </div>

                          <div className={styles.eventCard_stats}>
                            <div className={styles.eventCard_stats_no}>
                              {/* {trackerCard.stats} */}
                              {item.filterValue.event_rank_gte}
                            </div>
                            <div className={styles.eventCard_description}>
                              Events
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.mobile_trackerCard_container}>
                      {trackerCardsData.map((trackerCard, key) => (
                        <div className={styles.mobile_eventCard} key={key}>
                          <div className={styles.mobile_eventCard_title}>
                            {trackerCard.title}
                          </div>
                          <div className={styles.mobile_eventStats_container}>
                            {trackerCard.stats} Events
                          </div>
                        </div>
                      ))}
                    </div>
                    <PolarAreaChart
                      className={styles.events_stats_polarChart}
                    />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <span className={styles.body_divider}></span>
        <div className={styles.savedEvent_coordinateContainer}>
          <div className={styles.savedEventsContainer}>
            <div className={styles.savedEventsHeader}>
              <Image src={Bookmark} alt="save" className={iconClass} />
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  router.push("internal/trackers/savedevents");
                }}
              >
                Saved Events
              </div>
            </div>
            {isLoading ? (
              <SavedEventsSkeleton />
            ) : (
              <div
                className={`${styles.savedEventsData} ${
                  theme === "light" && styles.savedEventsData_light
                }`}
              >
                {savedEvantsList?.map((event, key) => (
                  <div
                    className={`${styles.savedEvent} ${
                      theme === "light" && styles.savedEvent_light
                    }`}
                    key={key}
                  >
                    <div>{event.title}</div>
                    <div
                      onClick={() => {
                        unsavedEvent(event.id);
                      }}
                    >
                      <BookmarkIcon fillColor={"#ff851b"} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div
            className={`${styles.linkCard_container} ${styles.coordinateCard}`}
          >
            {isLoading ? (
              <>
                <CoordinateSkeleton />
              </>
            ) : (
              <Link href={"/internal/coordinate"} className={styles.linkCard}>
              <div className={styles.linkCard_header}>
                <div className={styles.linkCard_header_title}>
                  <Image src={DatasetIcon} alt="data" className={iconClass} />
                  <span>Coordiante</span>
                </div>
                <Image src={GotoIcon} alt="goto" className={`${iconClass}`} />
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
