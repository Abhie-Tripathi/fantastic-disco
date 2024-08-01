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
import Link from "next/link";
import Loading from "@/app/components/UI/Loading";

function extractDay(startDate: Date): string {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekdays[startDate.getDay()];
}

function extractMonth(startDate: Date): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[startDate.getMonth()];
}

function extractDayOfMonth(startDate: Date): number {
  return startDate.getDate();
}

function parseTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  const timezoneOffset = date.getTimezoneOffset();
  const timezoneSign = timezoneOffset > 0 ? "-" : "+";
  const timezoneHours = Math.floor(Math.abs(timezoneOffset) / 60);
  const timezoneMinutes = Math.abs(timezoneOffset) % 60;
  const timezoneString = `GMT${timezoneSign}${pad(timezoneHours)}:${pad(
    timezoneMinutes
  )}`;

  return `${hours12}:${pad(minutes)} ${ampm} ${timezoneString}`;
}

function pad(number: number): string {
  return (number < 10 ? "0" : "") + number;
}

function formatEventDates(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start.getFullYear() === end.getFullYear()) {
      if (start.getMonth() === end.getMonth()) {
          if (start.getDate() === end.getDate()) {
              return new Date(startDate).toLocaleDateString("en-GB", {
                weekday: 'long',
                month: "short",
                day: "2-digit",
                year: "numeric",
              });
          } else {
              return (
                new Date(startDate).toLocaleDateString("en-GB", {
                  weekday: 'long',
                  month: "short",
                  day: "2-digit",
                }) + ' - ' +
                new Date(endDate).toLocaleDateString("en-GB", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })
              );
          }
      } else {
          return (
            new Date(startDate).toLocaleDateString("en-GB", {
              weekday: 'long',
              month: "short",
              day: "2-digit",
            }) + ' - ' +
            new Date(endDate).toLocaleDateString("en-GB", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
          );
      }
  } else {
      return (
        new Date(startDate).toLocaleDateString("en-GB", {
          weekday: 'long',
          month: "short",
          day: "2-digit",
          year: "numeric",
        }) + ' - ' +
        new Date(endDate).toLocaleDateString("en-GB", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      );
  }
}

const InsightsPage = () => {
  const [eventDetail, setEventDetail] = useState<any>();
  const pathName = usePathname();
  const pageParams = pathName.split("/");
  const eventId = pageParams[pageParams.length - 1];
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";

  const [eventStart, setEventStart] = useState<Date>(new Date());

  const [tabs, setTabs] = useState<any>([
    { name: "Overview", status: "open", active: true },
    // { name: "Event Details", status: "open", active: false },
    // { name: "Intelligence Data", status: "open", active: false },
    // { name: "Audience Data", status: "open", active: false },
    // { name: "More", status: "open", active: false },
  ]);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

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
      try{
        setIsLoaded(false);
        const { data, error } = await myFetch(
          `${baseUrl}/event/search?eventId=${eventId}&eventRank=0,1000`
        );
        if (error) {
          console.log(error);
          return;
        }
        if (data) {
          setEventDetail(data?.events[0]);
          setEventStart(new Date(data?.events[0].startDate));
        }
      } catch (error) {
        console.error("Error saving data:", error);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchData();
  }, [eventId]);

  if (!isLoaded) {
    return (<div style={{padding: '40px'}}><Loading /></div>);
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.containerLeft}>
          {/* <div className={styles.eventLogo}>
            <Image
              src={
                "https://miro.medium.com/v2/resize:fit:1400/1*nmMagIDyextUFs5J9aGnPw.jpeg"
              }
              alt="logo"
              width={230}
              height={230}
              className={styles.image}
            />
          </div> */}
          <div className={styles.eventTitle}>{eventDetail?.name}</div>
          <div className={styles.date_loactionContainer}>
            <div className={styles.dateContainer}>
              <div className={styles.dateIconContainer}>
                <div className={styles.iconMonth}>
                  {extractMonth(eventStart)}
                </div>
                <div className={styles.iconDate}>
                  {extractDayOfMonth(eventStart)}
                </div>
              </div>
              <div className={styles.dateDetails} style={{alignSelf:'unset'}}>
                <div className={styles.date}>
                  {formatEventDates(eventDetail.startDate, eventDetail.endDate)}
                </div>
                {/* <div className={styles.time}>{parseTime(eventStart)}</div> */}
              </div>
            </div>
            <div className={styles.locationContainer}>
              <div className={styles.locationIconContainer}>
                <Location color={theme === "dark" ? "white" : ""} />
              </div>
              <div className={styles.dateDetails}>
                <div className={styles.date}>
                  {eventDetail?.location?.venueAddress}
                </div>
                <div className={styles.time}>
                  {eventDetail?.location?.cityName &&
                  eventDetail?.location?.countryName
                    ? eventDetail.location.cityName +
                      ", " +
                      eventDetail.location?.countryName
                    : eventDetail?.location?.countryName}
                </div>
              </div>
            </div>
            <div className={styles.locationContainer}>
              <div className={styles.locationIconContainer}>
                <Buildings color={theme === "dark" ? "white" : ""} />
              </div>
              <div className={styles.dateDetails}>
                <div className={styles.date}>
                  {eventDetail?.organizer?.name &&
                    eventDetail?.organizer?.name }
                  
                  {/* San Antonio Space Center, Texas, Florida */}
                </div>
                <div className={styles.time}>
                  {eventDetail?.organizer?.cityName &&
                    eventDetail?.organizer?.countryName
                      ? eventDetail.organizer.cityName +
                        ", " +
                        eventDetail.organizer?.countryName
                      : eventDetail?.organizer?.countryName
                  }
                </div>
              </div>
            </div>
          </div>
          {/* <button className={styles.interestBtn}>
            I'm Interested in this event
          </button> */}
          <div className={styles.contactBtn}>
            {eventDetail?.organizer?.website &&
              <div>
                <Link href={eventDetail.organizer.website} target="_blank" >Contact the Host</Link>
            </div>
            }
            {/* <div>Report Event</div> */}
          </div>
        </div>
        <div className={styles.containerRight}>
          <div className={styles.tabsContainer}>
            {tabs.map((tab: any, index: number) => (
              <div
                key={index}
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
