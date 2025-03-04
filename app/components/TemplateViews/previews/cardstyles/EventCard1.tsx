import React from 'react'
import styles from './eventcard1.style.module.css'
import Image from 'next/image'
// import placeholder2 from '/public/placeholder2.png'
import placeholder2 from '/public/demobanner.png'
import POP from '/public/partyPopIcon.svg'
import TradeshowIcon from '/public/tradeshowIcon.svg'
import WorkShopIcon from '/public/workshop.svg'
import ConferenceIcon from '/public/conference.svg'
import DefaultIcon from '/public/widgetDefaultIcon.svg'

import locationIcon from '/public/location_on.svg'
import { PrefilledAddedEventsType } from '@/types/prefilledaddedeventtype'
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
    fetchedEvent?: PrefilledAddedEventsType
    demoEventName: string;
    demoBanner: string;
    demoDescription: string
    demoLocation: string
    demoDate: string
}

const EventCard1 = ({
    cardBgColor = "#ffffff",
    cardBorderRadius = 20,
    fontSettings = {
        heading: { fontFamily: "arial", fontSize: 24, fontColor: "#000000", fontWeight: "bolder" },
        subheading: { fontFamily: "arial", fontSize: 16, fontColor: "#000000", fontWeight: "bolder" },
        body: { fontFamily: "arial", fontSize: 12, fontColor: "#000000", fontWeight: "bolder" }
    }, fetchedEvent,
    demoBanner,
    demoEventName,
    demoDescription,
    demoLocation,
    demoDate

}: CardProps) => {

    const formatStartDate = (dateString: string) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const date = new Date(dateString);
        const day = date.getDate();
        const month = months[date.getMonth()];
        return { day, month };
    };
    const { day, month } = fetchedEvent ? formatStartDate(fetchedEvent.startDate) : { day: 1, month: "Jan" };
    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
        return new Date(date).toLocaleDateString('en-US', options);
    };
    const formatLocation = (event : any) => {
        if (event?.eventFormat === "Virtual") {
            return "Virtual";
        }
    
        const location = `${event?.cityName} ${event?.cityName && ","} ${event?.countryName}`;
        return location.length > 20 ? `${location.slice(0, 17)}...` : location;
    };

    return (
        <div className={styles.card} style={{ backgroundColor: cardBgColor, borderRadius: cardBorderRadius }}>
            <Image
                width={291} height={185}
                src={fetchedEvent ? fetchedEvent.bannerUrl : demoBanner} alt='placeholder'
                className={`${styles.banner} shadow-md`} />
            <div className={styles.date_location_nameContainer}>
                {/* <div className={styles.dateContainer}><span className={styles.date} style={{ fontSize: fontSettings.heading.fontSize }}>{day}</span>
                    <span className={styles.month} style={{ fontSize: fontSettings.heading.fontSize }}>{month}</span></div> */}
                <div className={styles.dateContainer}>
                    {
                        fetchedEvent?.eventType === "CHILD" ? <><Image src={POP} alt='' /></> : fetchedEvent?.eventType === "PARENT" && fetchedEvent.event_type === "Tradeshow" ? <Image src={TradeshowIcon} alt='' /> : fetchedEvent?.eventType === "PARENT" && fetchedEvent.event_type === "Conference" ? <Image src={ConferenceIcon} alt='' /> : fetchedEvent?.eventType === "PARENT" && fetchedEvent.event_type === "Workshop" ? <Image src={WorkShopIcon} alt='' /> : <Image src={DefaultIcon} alt='' />
                    }
                </div>
                <div className={styles.line}></div>
                <div className={styles.name_locationContainer}>
                    <div style={{display:"flex"}} className={`${styles.locationContainer} ${styles.eventName}`} data-name={ fetchedEvent && `${fetchedEvent?.cityName} ${fetchedEvent?.cityName && ","} ${fetchedEvent?.countryName}`}>
                        {/* <Image src={locationIcon} alt='location' /> */}
                        <LocationIcon color={fontSettings.subheading.fontColor} iconSize={fontSettings?.subheading.fontSize || 14}/>
                        <div className={styles.location} style={{ fontSize: fontSettings.subheading.fontSize, color: fontSettings.subheading.fontColor, fontFamily: fontSettings.subheading.fontFamily, fontWeight: fontSettings.subheading.fontWeight }}>
                        {fetchedEvent ? formatLocation(fetchedEvent) : demoLocation}</div>
                    </div>
                    <div className={styles.eventName}  data-name={fetchedEvent && fetchedEvent.name} style={{ fontSize: fontSettings.heading.fontSize, color: fontSettings.heading.fontColor, fontFamily: fontSettings.heading.fontFamily, fontWeight: fontSettings.heading.fontWeight }}>
                        {/* {fetchedEvent ? fetchedEvent.name.substring(0, 15) : demoEventName} */}
                        {fetchedEvent
              ? `${fetchedEvent.name.substring(0, 15)}${fetchedEvent.name.length > 15 ? "..." : ""}`
              : demoEventName}
                        </div>
                </div>
            </div>
            <div className={styles.dividerLine}></div>
            <div className={styles.dateRange_typeContainer}>
                <div className={`${styles.pill} ${styles.dateRange}`} style={{ fontSize: fontSettings.body.fontSize }}>{fetchedEvent ? formatDate(fetchedEvent.startDate) + " - " + formatDate(fetchedEvent.endDate) : demoDate}</div>
                <div className={`${styles.pill} ${styles.type1}`} style={{ fontSize: fontSettings.body.fontSize }}>{fetchedEvent ? fetchedEvent?.event_type : "Tradeshow"}</div>
                <div className={`${styles.pill} ${styles.type2}`} style={{ fontSize: fontSettings.body.fontSize }}>{fetchedEvent ? fetchedEvent?.eventFormat : "In-Person"}</div>
            </div>
        </div>
    )
}

export default EventCard1