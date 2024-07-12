"use client";
import React, { useEffect, useRef, useState } from "react";

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
import TrackerSkeleton from "@/app/components/Skeleton/dashboardskeleton/TrackerSkeleton";
import SavedEventsSkeleton from "@/app/components/Skeleton/dashboardskeleton/SavedEventsSkeleton";
import SkeletonCards from "@/app/components/Skeleton/dashboardskeleton/CardsSkeleton";
import CoordinateSkeleton from "@/app/components/Skeleton/dashboardskeleton/CoordinateSkeleton";
import NotificationSkeleton from "@/app/components/Skeleton/dashboardskeleton/NotificationSkeleton";

interface SavedEvent {
  title: string;
  eventGroupId: string;
}

interface Outreach {
  pending: number;
  shortlisted: number;
  Prefinal: number;
}

interface CoordinateType {
  id: number;
  name: string;
  count: string;
}

const trackerCardsData = [
  {
    icon: NewEvent,
    title: "New",
    stats: "0",
  },
  {
    icon: Timer,
    title: "Active",
    stats: "0",
  },
  {
    icon: CircleCross,
    title: "Expired",
    stats: "0",
  },
];

const notifications = [
  "@Walterwhite recommended you as a Speaker for Las vegas Event",
  "@Gusfring recommended you as a Atendee for Pollos Event",
  "@Pinkman recommended you as a Speaker for expo Event",
  "@Asackshra recommended you as a Speaker for Las vegas Event",
  "@Asackshra recommended you as a Speaker for Las vegas Event",
];

const Dashboard = () => {
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";
  const [trackerList, setTrackerList] = useState([]);
  const [savedEventsList, setSavedEventsList] = useState<SavedEvent[]>([]);
  const [coordinateData, setCoordinateData] = useState<CoordinateType[]>([]);
  const [outReachData, setOutReachData] = useState<Outreach[]>([]);
  const [pendingEvent, setPendingEvents] = useState("");
  const [shortlisted, setShortListed] = useState("");
  const [prefinal, setPrefinal] = useState("");
  const [totalEvent, setTotalEvents] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const getListOfTrackers = async () => {
      try {
        const { data, error } = await myFetch(`${baseUrl}/tracker`);
        console.log("TrackerList", data);
        setTrackerList(data.trackerData);
      } catch (error) {
        console.error("Error while fetching trackers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getListOfTrackers();
  }, []);

  const getSavedEvents = async () => {
    try {
      const { data } = await myFetch(`${baseUrl}/tracker/saved-events?limit=4`);
      console.log("saved_events", data?.data);
      setSavedEventsList(data?.result);
    } catch (error) {
      console.error("Error while fetching saved events:", error);
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    getSavedEvents();
  }, []);

  useEffect(() => {
    const getCordinateList = async () => {
      try {
        const data = await myFetch(`${baseUrl}/userInterest/totalParticipent`);
        console.log("cordinate", data?.data?.slice(1, data?.data.length));
        // setCordinateData(data.data[]);
        setTotalEvents(data?.data[0]?.totalEvent);
        setCoordinateData(data?.data?.slice(1, data?.data.length));
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
        setPendingEvents(response1?.data?.enquiryData.length);
        setShortListed(response2?.data?.enquiryData?.length);
        setPrefinal(response3?.data?.enquiryData?.length);
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

  const unsavedEvent = async (id: string) => {
    try {
      const response = await myFetch(`${baseUrl}/tracker/saved-events/${id}`, {
        method: "DELETE",
      });
      if (response) {
        getSavedEvents();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header_container}>
          <div className={styles.primary_container}>
            <div className={styles.primary_header}>Welcome back!</div>
            <div className={styles.secondary_header}>
              Unlock the possibility of EventGeni
            </div>
            {isLoading ? (
              <>
                <SkeletonCards />
              </>
            ) : (
              <div className={styles.linkCard_container}>
                <Link
                  href={`internal/search/events`}
                  className={`${styles.linkCard} card`}
                >
                  <div className={styles.linkCard_header}>
                    <div className={styles.linkCard_header_title}>
                      <Image src={Research} alt="search" />
                      <span>Research</span>
                    </div>
                    <Image
                      src={GotoIcon}
                      alt="goto"
                      className={`${iconClass} ${styles.goto_icon}`}
                    />
                  </div>

                  <div className={styles.linkCard_heading}>
                    {/* <span>Bengaluru</span> */}
                  </div>

                  <div className={styles.linkCard_description}>
                    Discover insights on business trends filtered by geography
                    and category, all in one glance.
                  </div>
                  <div className={styles.linkCard_tagsOuterContainer}></div>
                </Link>

                <Link
                  href={"internal/outreach"}
                  className={`${styles.linkCard} card`}
                >
                  <div className={styles.linkCard_header}>
                    <div className={styles.linkCard_header_title}>
                      <Image src={ExhibitIcon} alt="search" />
                      <span>Outreach</span>
                    </div>
                    <Image
                      src={GotoIcon}
                      alt="goto"
                      className={`${iconClass} ${styles.goto_icon}`}
                    />
                  </div>

                  <div className={styles.linkCard_heading}></div>

                  <div className={styles.linkCard_description}>
                    {pendingEvent || shortlisted || prefinal ? (
                      <div className={styles.outreach_count}>
                        <span>Pending events to look at: {pendingEvent}</span>
                        <span>Shortlisted Events: {shortlisted}</span>
                        <span>Pre Finalised Events: {prefinal}</span>
                      </div>
                    ) : (
                      <div className={styles.linkCard_description}>
                        Connect efficiently with stakeholders and amplify
                        engagement.
                      </div>
                    )}
                  </div>
                  <div className={styles.linkCard_tagsOuterContainer}></div>
                </Link>

                <Link
                  href={"/internal/trackers/create"}
                  className={`${styles.linkCard} card`}
                >
                  <div className={styles.linkCard_header}>
                    <div className={styles.linkCard_header_title}>
                      <Image src={Trend} alt="search" />
                      <span>Create Tracker</span>
                    </div>
                    <Image
                      src={GotoIcon}
                      alt="goto"
                      className={`${iconClass} ${styles.goto_icon}`}
                    />
                  </div>

                  <div
                    key={"card.title"}
                    className={styles.linkCard_heading}
                  ></div>

                  <div className={styles.linkCard_description}>
                    <div>
                      Track key events in real-time to make informed decisions
                      and seize opportunities as they arise.
                    </div>
                  </div>
                  <div className={styles.linkCard_tagsOuterContainer}></div>
                </Link>
              </div>
            )}
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
              <div style={{ flex: 1 }}>
                <NotificationSkeleton />
              </div>
            ) : (
              <div className={`${styles.notification_card} card`}>
                {/* {notifications.map((notification, key) => (
                  <div
                    key={key}
                    className={`${styles.notification} ${
                      theme === "light" && styles.notification_light
                    }`}
                  >
                    {notification}
                  </div>
                ))} */}
                <div className={styles.notification_defaultText}>
                  Stay updated with all your notifications in one place. No new
                  notification found.
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.body_container}>
          <div className={styles.trackers_container}>
            <div className={`${styles.tracker_container_header} `}>
              <div>Here &apos;s what&apos;s new since you last checked in</div>
            </div>

            {isLoading ? (
              <TrackerSkeleton />
            ) : trackerList.length > 0 ? (
              trackerList.map((tracker: any) => (
                <Link
                  href={`/internal/trackers/${tracker.id}/trackedEvents`}
                  className={`${styles.tracker_card} card `}
                  key={tracker.id}
                >
                  <>
                    <div className={styles.tracker_card_header}>
                      <span>{tracker.name}</span>
                      <Image src={GotoIcon} alt="goto" className={iconClass} />
                    </div>

                    <div className={styles.desktop_trackerCard_container}>
                      <div className={`${styles.eventCard} card`}>
                        <div className={styles.eventCard_title}>
                          <Image src={NewEvent} alt="newevent" />
                          <span>New</span>
                        </div>
                        <div className={styles.eventCard_stats}>
                          <div className={styles.eventCard_stats_no}>
                            {tracker?.groupedEventsCountByStatus
                              ?.groupedEventsByStatus?.new || 0}
                          </div>
                          <div className={styles.eventCard_description}>
                            Events
                          </div>
                        </div>
                      </div>

                      <div className={`${styles.eventCard} card`}>
                        <div className={styles.eventCard_title}>
                          <Image src={Timer} alt="active" />
                          <span>Active</span>
                        </div>
                        <div className={styles.eventCard_stats}>
                          <div className={styles.eventCard_stats_no}>
                            {tracker?.groupedEventsCountByStatus
                              ?.groupedEventsByStatus?.active || 0}
                          </div>
                          <div className={styles.eventCard_description}>
                            Events
                          </div>
                        </div>
                      </div>

                      <div className={`${styles.eventCard} card`}>
                        <div className={styles.eventCard_title}>
                          <Image src={CircleCross} alt="expired" />
                          <span>Expired</span>
                        </div>
                        <div className={styles.eventCard_stats}>
                          <div className={styles.eventCard_stats_no}>
                            {tracker?.groupedEventsCountByStatus
                              ?.groupedEventsByStatus?.expired || 0}
                          </div>
                          <div className={styles.eventCard_description}>
                            Events
                          </div>
                        </div>
                      </div>

                      {/* <PolarAreaChart
                        className={styles.events_stats_polarChart}
                      /> */}
                    </div>
                  </>
                </Link>
              ))
            ) : (
              <div className={styles.tracker_card_defaultText}>
                {/* <div className={styles.tracker_card_header}>
              <span>Tracker 1 - Events in Bangalore</span>
              <Image src={GotoIcon} alt="goto" />
            </div> */}

                <div className={styles.event_cards_container}>
                  <div className={styles.linkCard_description}>
                    Track key events in real-time to make informed decisions and
                    seize opportunities as they arise.
                  </div>
                </div>
              </div>
            )}
          </div>

          <span className={styles.body_divider}></span>
          <div className={styles.savedEvent_coordinateContainer}>
            <div className={styles.savedEventsContainer}>
              <div className={`${styles.tracker_container_header}`}>
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
                  className={`${styles.savedEventsData} card`}
                  style={{ padding: "unset" }}
                >
                  {savedEventsList?.length > 0 ? (
                    savedEventsList?.map((event: any) => (
                      <div
                        className={`${styles.savedEvent} ${
                          theme === "light" && styles.savedEvent_light
                        }`}
                        key={event.id}
                      >
                        <div>{event.name}</div>
                        <div
                          onClick={() => {
                            unsavedEvent(event?.eventGroupId);
                          }}
                        >
                          <BookmarkIcon fillColor={"#ff851b"} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: "13px", fontSize: "14px" }}>
                      Stay informed about the latest industry events and save
                      them to stay updated on event updates.
                    </div>
                  )}
                </div>
              )}
            </div>
            <div
              className={`${styles.linkCard_container} ${styles.coordinateCard}`}
            >
              <div className={`${styles.tracker_container_header}`}>
                Event shortlisting and Co-ordination
              </div>

              {isLoading ? (
                <>
                  <CoordinateSkeleton />
                </>
              ) : (
                <Link
                  href={"/internal/coordinate"}
                  className={`${styles.linkCard} card`}
                >
                  <div className={styles.linkCard_header}>
                    <div className={styles.linkCard_header_title}>
                      <Image
                        src={DatasetIcon}
                        alt="data"
                        className={iconClass}
                      />
                      <span>Coordinate</span>
                    </div>
                    <Image
                      src={GotoIcon}
                      alt="goto"
                      className={`${iconClass}`}
                    />
                  </div>
                  {coordinateData.length > 0 ? (
                    <>
                      <div className={styles.linkCard_description}>
                        <div>Total Events : {totalEvent}</div>
                      </div>
                      <div className={styles.linkCard_tagsOuterContainer}>
                        {coordinateData.map((tag, key) => (
                          <div
                            className={styles.linkCard_tagsInnerContainer}
                            key={key}
                          >
                            <div className={styles.linkCard_tagsName}>
                              {tag.name}
                            </div>
                            <div className={styles.linkCard_tagsCount}>
                              {tag.count}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className={styles.linkCard_description}>
                      An effective event communication and relationship
                      management dashboard that keeps your team on the same page
                      and makes coordination both internally and with events
                      team easy and manageable.
                    </div>
                  )}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
