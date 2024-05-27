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

interface CordinateType {
  id: number;
  name: string;
  count: string;
}

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
  const [savedEvantsList, setSavedEventsList] = useState<SavedEvent[]>([]);
  const [cordinateData, setCordinateData] = useState<CordinateType[]>([]);
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

  const getSavedEvents = async () => {
    try {
      const data = await myFetch(`${baseUrl}/tracker/saved-events`);
      console.log("saved_events", data?.data);
      setSavedEventsList(data?.data?.savedEvents);
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
        setCordinateData(data?.data?.slice(1, data?.data.length));
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
    <div
      className={styles.container}
    >
      <div className={styles.header_container}>
        <div className={styles.primary_container}>
          <div className={styles.primary_header}>Welcome back!</div>
          {isLoading ? (
            <>
              <SkeletonCards />
            </>
          ) : (
            <div className={styles.linkCard_container}>
              <Link href={`internal/search/events`} className={styles.linkCard}>
                <div className={styles.linkCard_header}>
                  <div className={styles.linkCard_header_title}>
                    <Image src={Research} alt="search" />
                    <span>Continue Research</span>
                  </div>
                  <Image
                    src={GotoIcon}
                    alt="goto"
                    className={`${iconClass} ${styles.goto_icon}`}
                  />
                </div>

                <div className={styles.linkCard_heading}>
                  <span>Bengaluru</span>
                </div>

                <div className={styles.linkCard_description}>
                  <div>
                    <span>Bengaluru, Karnataka, India(1.34mi radius)</span>
                  </div>
                </div>
                <div className={styles.linkCard_tagsOuterContainer}></div>
              </Link>

              <Link href={"internal/outreach"} className={styles.linkCard}>
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
                  <div className={styles.outreach_count}>
                    <span>Pending events to look at: {pendingEvent}</span>
                    <span>Shortlisted Events: {shortlisted}</span>
                    <span>Pre Finalised Events: {prefinal}</span>
                  </div>
                </div>
                <div className={styles.linkCard_tagsOuterContainer}></div>
              </Link>

              <Link
                href={"/internal/trackers/create"}
                className={styles.linkCard}
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
                    Track key events in real-time to make informed decisions and
                    seize opportunities as they arise.
                  </div>
                </div>
                <div className={styles.linkCard_tagsOuterContainer}></div>
              </Link>
            </div>
          )}

          {/* Old One */}
          {/* <div className={styles.linkCard_container}>
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
                  </div>
                </Link>
              ))
            )}
          </div> */}
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
                        unsavedEvent(event?.eventGroupId);
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
                  <div>Total Events : {totalEvent}</div>
                </div>
                <div className={styles.linkCard_tagsOuterContainer}>
                  {cordinateData &&
                    cordinateData?.map((tag, key) => (
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
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
