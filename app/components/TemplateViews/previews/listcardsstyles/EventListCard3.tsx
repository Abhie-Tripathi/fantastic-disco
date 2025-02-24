import React from 'react'
import styles from './eventlistcard3.style.module.css'
import Image from 'next/image'
// import placeholder2 from '/public/placeholder2.png'
import placeholder2 from '/public/DemoBanner.png'
import locationIcon from '/public/location_on.svg'
import { PrefilledAddedEventsType } from '@/types/prefilledaddedeventtype'
import { LocationIcon } from '../LocationIcon'
import { DateIcon } from '../DateIcon'

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
  fetchedEvent?: PrefilledAddedEventsType;
  demoBanner: string;
  demoEventName: string;
  demoDescription: string;
  demoLocation: string
  demoDate: string
  smallCard: boolean;
}
const EventListCard3 = ({
  cardBgColor = "#ffffff",
  cardBorderRadius = 20,
  fontSettings = {
    heading: { fontFamily: "arial", fontSize: 24, fontColor: "#000000", fontWeight: "bolder" },
    subheading: { fontFamily: "arial", fontSize: 16, fontColor: "#000000", fontWeight: "bolder" },
    body: { fontFamily: "arial", fontSize: 12, fontColor: "#000000", fontWeight: "bolder" }
  }, fetchedEvent, demoBanner, demoEventName, demoDescription, demoLocation, demoDate, smallCard }: CardProps) => {

  const formatDate = (date: string) => {
    const dateObj = new Date(date);

    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-US', { month: 'short' });
    const year = dateObj.getFullYear();

    // Function to get the appropriate suffix for the day
    const getDayWithSuffix = (day: number) => {
      const suffixes = ['th', 'st', 'nd', 'rd'];
      const value = day % 100;
      return day + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
    };

    return `${getDayWithSuffix(day)} ${month} ${year}`;
  };
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + '...';
  };
  const description = fetchedEvent ? truncateText(fetchedEvent.description, 150) : demoDescription;
  return (
    <div className={smallCard ? styles.smallCard : styles.card} style={{ backgroundColor: cardBgColor, borderRadius: cardBorderRadius }}>
      <div className={`${styles.bannerContainer} ${smallCard ? styles.smallBannerContainer : ""}`}>
      {smallCard ? <Image width={271} height={124} src={fetchedEvent ? fetchedEvent.bannerUrl : demoBanner} alt='placeholder' className={styles.smallBanner} />: <Image width={271} height={124} src={fetchedEvent ? fetchedEvent.bannerUrl : demoBanner} alt='placeholder' className={`${styles.banner} shadow-md`} />}


        <div className={`${styles.pill} ${smallCard ? styles.smallPill : ""} ${styles.type1}`} style={{ fontSize:smallCard? 10 : fontSettings.body.fontSize }}>{fetchedEvent?.eventType === "PARENT" ? "Main Event" : fetchedEvent?.eventType === "CHILD" ? "Side Event" : "Main Event"}</div>
        <div className={`${styles.pill} ${smallCard ? styles.smallPill : ""} ${styles.type2}`} style={{ fontSize:smallCard? 10 : fontSettings.body.fontSize }}>{fetchedEvent ? fetchedEvent?.event_type : "Tradeshow"}</div></div>

      <div className={styles.eventDetails}>
        {/* <div className={styles.eventName} style={{fontSize : fontSettings.heading.fontSize , color : fontSettings.heading.fontColor, fontFamily : fontSettings.heading.fontFamily, fontWeight : fontSettings.heading.fontWeight}}>{fetchedEvent ? fetchedEvent.name.substring(0,30) : demoEventName}</div> */}
        <div
          className={styles.eventName}
          style={{
            fontSize: fontSettings.heading.fontSize,
            color: fontSettings.heading.fontColor,
            fontFamily: fontSettings.heading.fontFamily,
            fontWeight: fontSettings.heading.fontWeight
          }}
          data-name={fetchedEvent && fetchedEvent.name}
        >
          {fetchedEvent
            ? `${fetchedEvent.name.substring(0, 15)}${fetchedEvent.name.length > 15 ? "..." : ""}`
            : demoEventName}
        </div>
        <div className={styles.location_dateContainer}>
          <div className={styles.locationContainer}>
            <LocationIcon color={fontSettings.subheading.fontColor} iconSize={fontSettings?.subheading.fontSize || 14}/>
            {/* <div className={styles.location} style={{fontSize : fontSettings.subheading.fontSize , color : fontSettings.subheading.fontColor, fontFamily : fontSettings.subheading.fontFamily, fontWeight : fontSettings.subheading.fontWeight}}>{fetchedEvent?.eventFormat==="Virtual"?"Virtual": fetchedEvent ? fetchedEvent.cityName + ", " + fetchedEvent.countryName :  demoLocation}</div> */}
            <div
              className={styles.location}
              style={{
                fontSize: fontSettings.subheading.fontSize,
                color: fontSettings.subheading.fontColor,
                fontFamily: fontSettings.subheading.fontFamily,
                fontWeight: fontSettings.subheading.fontWeight,
              }}
            >
              {fetchedEvent?.eventFormat === "Virtual"
                ? "Virtual"
                : fetchedEvent
                  ? (fetchedEvent.cityName + `${fetchedEvent.cityName ? "," : ""}` + fetchedEvent.countryName).length > 15
                    ? (fetchedEvent.cityName + `${fetchedEvent.cityName ? "," : ""}` + fetchedEvent.countryName).substring(0, 15) + "..."
                    : fetchedEvent.cityName + `${fetchedEvent.cityName ? "," : ""}` + fetchedEvent.countryName
                  : demoLocation}
            </div>
          </div>
          <div className={styles.dateContainer}>
            <DateIcon color={fontSettings.subheading.fontColor} iconSize={fontSettings?.subheading.fontSize || 14}/>
            <div className={styles.date} style={{ fontSize: fontSettings.subheading.fontSize, color: fontSettings.subheading.fontColor, fontFamily: fontSettings.subheading.fontFamily, fontWeight: fontSettings.subheading.fontWeight }}>{fetchedEvent ? formatDate(fetchedEvent.startDate) + " - " + formatDate(fetchedEvent.endDate) : demoDate}</div>
          </div>
        </div>
        <div className={styles.description} style={{ fontSize: fontSettings.body.fontSize, color: fontSettings.body.fontColor, fontFamily: fontSettings.body.fontFamily, fontWeight: fontSettings.body.fontWeight, maxHeight : smallCard ? 52 : 92 }} dangerouslySetInnerHTML={{ __html: description }}></div>
      </div>
    </div>
  );
}

export default EventListCard3
