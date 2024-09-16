import React from 'react'
import styles from './eventlistcard1.style.module.css'
import Image from 'next/image'
import placeholder2 from '/public/placeholder2.png'
import locationIcon from '/public/location.svg'
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

  const description = fetchedEvent ? truncateText(fetchedEvent.description, 130) : "Some Description";
  const { day, month } = fetchedEvent ? formatStartDate(fetchedEvent.startDate) : { day: 1, month: "Jan" };
  return (
    <div className={styles.card} style={{ backgroundColor: cardBgColor, borderRadius: cardBorderRadius }}>
      <Image width={260} height={200} src={fetchedEvent ? fetchedEvent.bannerUrl : placeholder2} alt='banner' className={styles.banner} style={{objectFit : "cover"}}/>
      <div className={styles.detailsContainer}>
        <div className={styles.date_location_nameContainer}>
          <div className={styles.dateContainer}>
            <span className={styles.date} style={{ fontSize: fontSettings.heading.fontSize }}>{day}</span>
            <span className={styles.month} style={{ fontSize: fontSettings.heading.fontSize }}>{month}</span>
          </div>
          <div className={styles.line}></div>
          <div className={styles.name_locationContainer}>
            <div className={styles.locationContainer}>
              <LocationIcon color={fontSettings.subheading.fontColor}/>
              <div className={styles.location} style={{ fontSize: fontSettings.subheading.fontSize, color: fontSettings.subheading.fontColor, fontFamily: fontSettings.subheading.fontFamily, fontWeight: fontSettings.subheading.fontWeight }}>{fetchedEvent ? fetchedEvent.cityName + ", " + fetchedEvent.countryName : "Corpus Christi, USA"}</div>
            </div>
            <div className={styles.eventName} style={{ fontSize: fontSettings.heading.fontSize, color: fontSettings.heading.fontColor, fontFamily: fontSettings.heading.fontFamily, fontWeight: fontSettings.heading.fontWeight }}>{fetchedEvent ? `${fetchedEvent.name.substring(0,30)} ${fetchedEvent.name.length > 30 ?"...":""}` : "Join Gifts World Expo 2024"}</div>
          </div>
        </div>
        <div className={styles.description} style={{ fontSize: fontSettings.body.fontSize, color: fontSettings.body.fontColor, fontFamily: fontSettings.body.fontFamily, fontWeight: fontSettings.body.fontWeight }} dangerouslySetInnerHTML={{ __html: description }}></div>
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

interface IconProps{
  color : string;
}

function LocationIcon({color}: IconProps) {
  return (
    <svg  xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" fill={color} /></svg>
  )
}