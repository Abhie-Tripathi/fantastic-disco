import React from 'react'
import styles from './eventlistcard1.style.module.css'
import Image from 'next/image'
import placeholder2 from '/public/placeholder2.png'
import locationIcon from '/public/location_on.svg'
import { PrefilledAddedEventsType } from '@/types/prefilledaddedeventtype' 

interface FontSettings {
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  fontWeight: string;
}
interface CardProps {
  cardBgColor?: string;
  cardBorderRadius?: number;
  fontSettings?: {
    heading: FontSettings;
    subheading: FontSettings;
    body: FontSettings;
  };
  fetchedEvent?: PrefilledAddedEventsType
}
const EventListCard1 = ({
  cardBgColor = "#ffffff",
  cardBorderRadius = 20,
  fontSettings = {
    heading: { fontFamily: "arial", fontSize: 24, fontColor: "#000000", fontWeight: "bolder" },
    subheading: { fontFamily: "arial", fontSize: 16, fontColor: "#000000", fontWeight: "bolder" },
    body: { fontFamily: "arial", fontSize: 12, fontColor: "#000000", fontWeight: "bolder" }
  }, fetchedEvent }: CardProps) => {

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: '2-digit', month: 'short' };
    return new Date(date).toLocaleDateString('en-US', options);
  };
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + '...';
  };

  const formatStartDate = (dateString: string) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    return { day, month };
  };

  const description = fetchedEvent ? truncateText(fetchedEvent.description, 150) : "Some Description";
  const { day, month } = fetchedEvent ? formatStartDate(fetchedEvent.startDate) : { day: 1, month: "Jan" };
  return (
    <div className={styles.card} style={{ backgroundColor: cardBgColor, borderRadius: cardBorderRadius }}>
      <Image width={275} height={200} src={fetchedEvent ? fetchedEvent.bannerUrl : placeholder2} alt='banner' className={styles.banner} />
      <div className={styles.detailsContainer}>
        <div className={styles.date_location_nameContainer}>
          <div className={styles.dateContainer}>
            <span className={styles.date} style={{ fontSize: fontSettings.heading.fontSize }}>{day}</span>
            <span className={styles.month} style={{ fontSize: fontSettings.heading.fontSize }}>{month}</span>
          </div>
          <div className={styles.line}></div>
          <div className={styles.name_locationContainer}>
            <div className={styles.locationContainer}>
              <Image src={locationIcon} alt='location' />
              <div className={styles.location} style={{ fontSize: fontSettings.subheading.fontSize, color: fontSettings.subheading.fontColor, fontFamily: fontSettings.subheading.fontFamily, fontWeight: fontSettings.subheading.fontWeight }}>{fetchedEvent ? fetchedEvent.cityName + ", " + fetchedEvent.countryName : "Corpus Christi, USA"}</div>
            </div>
            <div className={styles.eventName} style={{ fontSize: fontSettings.heading.fontSize, color: fontSettings.heading.fontColor, fontFamily: fontSettings.heading.fontFamily, fontWeight: fontSettings.heading.fontWeight }}>{fetchedEvent ? fetchedEvent.name : "Join Gifts World Expo 2024"}</div>
          </div>
        </div>
        <div className={styles.description} style={{ fontSize: fontSettings.body.fontSize, color: fontSettings.body.fontColor, fontFamily: fontSettings.body.fontFamily, fontWeight: fontSettings.body.fontWeight }}>
          {description}</div>
        <div className={styles.dateRange_typeContainer}>
          <div className={`${styles.pill} ${styles.dateRange}`} style={{ fontSize: fontSettings.body.fontSize }}>{fetchedEvent ? formatDate(fetchedEvent.startDate) + " - " + formatDate(fetchedEvent.endDate) : "29 Jan - 5 Feb"}</div>
          <div className={`${styles.pill} ${styles.type1}`} style={{ fontSize: fontSettings.body.fontSize }}>Tradeshow</div>
          <div className={`${styles.pill} ${styles.type2}`} style={{ fontSize: fontSettings.body.fontSize }}>Attending</div>
        </div>
      </div>
    </div>
  );
}

export default EventListCard1