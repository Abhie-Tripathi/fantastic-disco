"use client";
import React, { useState, useEffect } from "react";
import styles from "./calendarList.module.css";
import RightArrow from "/public/rightArrow.svg";
import FilterIcon from "/public/filterIcon.svg";
import CrossIcon from "/public/close.svg";
// import eventData from "../../../../public/data/demoEvent.json";
import Link from "next/link";
import Image from "next/image";
import FestivalIcon from "/public/festivalIcon.svg";
import { formatDateRange } from "@/utils/dateFormat";
import { myFetch } from "@/utils/myFetch";
import { baseUrl, headers } from "@/constants";
import { useTheme } from "@/context";
import Loading from "../../UI/Loading";

interface eventDataType {
  name: string;
  startDate: string;
  endDate: string;
  location: { cityName: string };
}
interface Props {
  filters: string;
  startDate: string;
  endDate: string;
}

const EventListCard = (event: any) => {
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";
  return (
    <div className={'card'}>
      <div className={styles.eventListCard_title}>{event.event.name}</div>
      <div className={styles.eventListCard_location}>
        {event.event?.location?.cityName}
      </div>
      <div className={styles.eventListCard_date}>
        {formatDateRange(event.event?.startDate, event.event?.endDate)}
      </div>
      <div className={styles.eventListCard_footer}>
        <div className={styles.eventListCard_footer_info}>
          {/* <div className={styles.eventListCard_category}>
            <Image className={iconClass} src={FestivalIcon} alt="festival" />
            <span style={{color:"black"}}>{event?.event?.company}</span>
          </div> */}
          {/* <span style={{ color: "grey" }}>|</span> */}
          <div className={`${styles.eventListCard_label} ${styles.truncateText_1}`} >{event.event?.categories[0]?.name}</div>
          {event.event?.categories.length > 1 &&
            <small className={styles.catCount}>
              {`+${event.event?.categories.length -1}`}
            </small>
          }
        </div>
        {/* <Link href={`/detailpage`}>
          View Details
        </Link> */}
      </div>
    </div>
  );
};

const CalendarList = ({ filters, startDate, endDate }: Props) => {
  const [showList, setShowList] = useState(false);
  const [fullView, setFullView] = useState(true);

  const [eventData, setEventData] = useState<eventDataType[]>([]);
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";

  const [currPage, setCurrPage] = useState(1);
  const [isListLoaded, setIsListLoaded] = useState<boolean>(true);
  const [loadMoreDisabled, setLoadMoreDisabled] = useState<boolean>(false);

  const handleLoadMoreEvents = async() => {
    try {
      const apiUrl = `${baseUrl}/event/search?startDate=2013-01-01,${startDate}&endDate=${startDate},2090-01-01&offset=${(currPage - 1)*10}&max=10&${filters}`;
      setLoadMoreDisabled(true);
      setIsListLoaded(false);

      const apiData = await myFetch(apiUrl, {
        method: "GET",
        headers: headers,
      });
      if(apiData.data) {
        setEventData((prev)=>[...prev, ...apiData.data.events]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadMoreDisabled(false);
      setIsListLoaded(true);
    }
  }

  const fetchEventsData = async () => {
    try {
      // const apiUrl = `${baseUrl}/event/search?groupBy=2024-03-01,2024-03-30`;
      const apiUrl = `${baseUrl}/event/search?startDate=2013-01-01,${startDate}&endDate=${startDate},2090-01-01&${filters}`;
      const apiData = await myFetch(apiUrl, {
        method: "GET",
        headers: headers,
      });
      if (apiData.data) {
        setEventData(apiData.data.events);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    if (startDate != '') {
      if (startDate !== '0')
        fetchEventsData();
      setShowList(true);
      setCurrPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate]);

  useEffect(() => {
    if(currPage>1)
      handleLoadMoreEvents();
  }, [currPage]);

  return (
    <>
      {fullView && (
        <div className={styles.eventList_container}>
          {/* <button
            onClick={() => setShowList(!showList)}
            className={styles.event_list_button}
          >
            EVENTS LIST
          </button> */}
          <div
            className={`${styles.eventList} ${showList ? styles.active : ""}`}
          >
            <div className={styles.eventList_header}>
              <span>Results</span>
              <button onClick={() => setShowList(!showList)} >
                <Image src={CrossIcon} alt="filter" />
              </button>
            </div>

            <div className={styles.eventList_list}>
              {eventData && eventData?.map((event, key) => (
                <EventListCard key={key} event={event} />
              ))}
              {eventData && eventData.length == 0 && 'No events'}
              { !isListLoaded &&
                <div style={{paddingBottom:'10px'}}><Loading /></div>
              }
            </div>
            <div style={{textAlign:'center', padding:'10px'}}>
              <button disabled={loadMoreDisabled} className={styles.loadMoreBtn} onClick={() => setCurrPage((page) => page + 1)} >
                Load More
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CalendarList;