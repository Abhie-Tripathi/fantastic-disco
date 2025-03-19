import React from 'react'
import styles from './eventlistcard1.style.module.css'
import Image from 'next/image'
// import placeholder2 from '/public/placeholder2.png'
import placeholder2 from '/public/DemoBanner.png'
import locationIcon from '/public/location.svg'
import { PrefilledAddedEventsType } from '@/types/prefilledaddedeventtype'
import POP from '/public/partyPopIcon.svg'
import TradeshowIcon from '/public/tradeshowIcon.svg'

import WorkShopIcon from '/public/workshop.svg'
import ConferenceIcon from '/public/conference.svg'
import DefaultIcon from '/public/widgetDefaultIcon.svg'
import { LocationIcon } from '../LocationIcon'

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
  demoLocation: string;
  demoDate: string
  smallCard: boolean;
}
const EventListCard1 = ({
  cardBgColor = "#ffffff",
  cardBorderRadius = 20,
  fontSettings = {
    heading: { fontFamily: "arial", fontSize: 24, fontColor: "#000000", fontWeight: "bolder" },
    subheading: { fontFamily: "arial", fontSize: 16, fontColor: "#000000", fontWeight: "bolder" },
    body: { fontFamily: "arial", fontSize: 12, fontColor: "#000000", fontWeight: "bolder" }
  }, fetchedEvent, demoBanner, demoEventName, demoDescription, demoLocation, demoDate, smallCard }: CardProps) => {

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
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

  const description = fetchedEvent ? truncateText(fetchedEvent.description, 130) : demoDescription;
  const truncatedDescription = description.substring(0, 130) + (description.length > 130 ? "..." : "");
  const { day, month } = fetchedEvent ? formatStartDate(fetchedEvent.startDate) : { day: 1, month: "Jan" };
  return (
    <div className={smallCard ? styles.smallCard : styles.card} style={{ backgroundColor: cardBgColor, borderRadius: cardBorderRadius }}>
      {smallCard ? <Image width={160} height={170} src={fetchedEvent ? fetchedEvent.bannerUrl : demoBanner} alt='banner' className={`${styles.smallBanner} shadow-md`} style={{ objectFit: "cover" }} /> : <Image width={260} height={200} src={fetchedEvent ? fetchedEvent.bannerUrl : demoBanner} alt='banner' className={`${styles.banner} shadow-md`} style={{ objectFit: "cover" }} />}

      <div className={`${styles.detailsContainer} ${smallCard ? styles.smallDetailContainer : ""}`}>
        <div className={`${styles.date_location_nameContainer} ${smallCard ? styles.smalldate_location_nameContainer : ""}`}>
          <div className={`${styles.dateContainer} ${smallCard ? styles.smalldateContainer : ""}`}>
            {
              fetchedEvent?.eventType === "CHILD" ? <>
              <Image src={POP} alt=''/></> : fetchedEvent?.eventType === "PARENT" && fetchedEvent.event_type === "Tradeshow" ? 
              <Image src={TradeshowIcon} alt='' /> : fetchedEvent?.eventType === "PARENT" && fetchedEvent.event_type === "Conference" ? 
              <Image src={ConferenceIcon} alt='' /> : fetchedEvent?.eventType === "PARENT" && fetchedEvent.event_type === "Workshop" ? 
              <Image src={WorkShopIcon} alt='' /> : 
              <Image src={DefaultIcon} alt='' />
            }
          </div>

          <div className={styles.line}></div>
          <div className={styles.name_locationContainer}>
            <div className={styles.locationContainer}>
              <LocationIcon color={fontSettings.subheading.fontColor} iconSize={fontSettings?.subheading.fontSize || 14}/>
              <div
                className={styles.location}
                style={{
                  fontSize: fontSettings.subheading.fontSize,
                  color: fontSettings.subheading.fontColor,
                  fontFamily: fontSettings.subheading.fontFamily,
                  fontWeight: fontSettings.subheading.fontWeight,
                }}
                data-name={fetchedEvent&&fetchedEvent?.cityName + `${fetchedEvent?.cityName ? "," : ""}` + fetchedEvent?.countryName}
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

          </div>
        </div>
        <div className={styles.description} style={{ fontSize: fontSettings.body.fontSize, color: fontSettings.body.fontColor, fontFamily: fontSettings.body.fontFamily, fontWeight: fontSettings.body.fontWeight }} dangerouslySetInnerHTML={{ __html: truncatedDescription }}></div>
        <div className={styles.dateRange_typeContainer}>
          <div className={`${styles.pill} ${smallCard ? styles.smallPill : ""} ${styles.dateRange}`} style={{ fontSize:smallCard? 10 : fontSettings.body.fontSize }}>{fetchedEvent ? formatDate(fetchedEvent.startDate) + " - " + formatDate(fetchedEvent.endDate) : demoDate}</div>
          <div className={`${styles.pill} ${smallCard ? styles.smallPill : ""} ${styles.type1}`} style={{ fontSize:smallCard? 10 : fontSettings.body.fontSize }}>{fetchedEvent?.eventType === "PARENT" ? fetchedEvent.event_type : fetchedEvent?.eventType === "CHILD" ? fetchedEvent.participationType === "Brunch/Lunch/Dinner" ? "Bru../Lun../Din.." : fetchedEvent.participationType : "Tradeshow"}</div>
          <div className={`${styles.pill} ${smallCard ? styles.smallPill : ""} ${styles.type2}`} style={{ fontSize:smallCard? 10 : fontSettings.body.fontSize }}>{fetchedEvent?.eventType === "PARENT" ? fetchedEvent.eventFormat : fetchedEvent?.eventType === "CHILD" ? fetchedEvent.eventFormat : "Attending"}</div>
        </div>
      </div>
    </div>
  );
}

export default EventListCard1
