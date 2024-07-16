"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./eventInsight.style.module.css";
import Image from "next/image";
import { useTheme } from "@/context";
import LocationIcon from "/public/location.svg";
import { Buildings, Location } from "geist-icons";
import Overview from "@/app/components/internal/insightPage/Overview";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
// import Loading from "@/app/components/UI/Loading";

const InsightsPage = () => {
  const [eventDetail, setEventDetail] = useState<any>();
  const pathName = usePathname();
  const pageParams = pathName.split("/");
  const eventId = pageParams[pageParams.length - 1];
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";

  const [tabs, setTabs] = useState<any>([
    { name: "Overview", status: "open", active: true },
    // { name: "Event Details", status: "open", active: false },
    // { name: "Intelligence Data", status: "open", active: false },
    // { name: "Audience Data", status: "open", active: false },
    // { name: "More", status: "open", active: false },
  ]);

  const setActiveTab = (tabId: number) => {
    setTabs(
      tabs.map((tab: any, index: number) => ({
        ...tab,
        active: index === tabId,
      }))
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await myFetch(
        `${baseUrl}/event/search?eventId=${eventId}`
      );
      if (error) {
        console.log(error);
        return;
      }
      if (data) {
        setEventDetail(data?.events[0]);
      }
    };
    fetchData();
  }, [eventId]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.containerLeft}>
          <div className={styles.eventLogo}>
            <Image
              src={
                "https://miro.medium.com/v2/resize:fit:1400/1*nmMagIDyextUFs5J9aGnPw.jpeg"
              }
              alt="logo"
              width={230}
              height={230}
              className={styles.image}
            />
          </div>
          <div className={styles.eventTitle}>
            {eventDetail?.name}
          </div>
          <div className={styles.date_loactionContainer}>
            <div className={styles.dateContainer}>
              <div className={styles.dateIconContainer}>
                <div className={styles.iconMonth}>Jan</div>
                <div className={styles.iconDate}>24</div>
              </div>
              <div className={styles.dateDetails}>
                <div className={styles.date}>Saturday, Jan 24</div>
                <div className={styles.time}>2:00 PM - 9:00 PM GMT+2</div>
              </div>
            </div>
            <div className={styles.locationContainer}>
              <div className={styles.locationIconContainer}>
                {/* <Image
                  src={LocationIcon}
                  alt="location"
                  className={iconClass}
                  height={18}
                  width={18}
                /> */}
                <Location color={theme === "dark" ? "white" : ""} />
              </div>
              <div className={styles.dateDetails}>
                <div className={styles.date}>
                  Via Angelo della Pergola, 11/4
                </div>
                <div className={styles.time}>Milano, Lombardia</div>
              </div>
            </div>
            <div className={styles.locationContainer}>
              <div className={styles.locationIconContainer}>
                {/* <Image
                  src={Buildings}
                  alt="location"
                  className={iconClass}
                  height={18}
                  width={18}
                /> */}
                <Buildings color={theme === "dark" ? "white" : ""} />
              </div>
              <div className={styles.dateDetails}>
                <div className={styles.organiser}>
                  San Antonio Space Center, Texas, Florida
                </div>
              </div>
            </div>
          </div>
          <button className={styles.interestBtn}>
            I'm Interested in this event
          </button>
          <div className={styles.contactBtn}>
            <div>Contact the Host</div>
            <div>Report Event</div>
          </div>
        </div>
        <div className={styles.containerRight}>
          <div className={styles.tabsContainer}>
            {tabs.map((tab: any, index: number) => (
              <div
                className={`${styles.tabItem} ${
                  tab.active ? styles.tabActive : ""
                }`}
                onClick={() => setActiveTab(index)}
              >
                {tab.name}
              </div>
            ))}
          </div>
          <div className={styles.tabContent}>
            <Overview eventDetail={eventDetail} />
          </div>
        </div>
      </div>
    </>
  );
};

export default InsightsPage;
