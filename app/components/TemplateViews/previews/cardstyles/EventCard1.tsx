import React from 'react'
import styles from './eventcard1.style.module.css'
import Image from 'next/image'
// import placeholder2 from '/public/placeholder2.png'
import placeholder2 from '/public/demobanner.png'


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
    demoEventName:string;
    demoBanner:string;
    demoDescription:string
    demoLocation:string
    demoDate:string
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

    return (
        <div className={styles.card} style={{ backgroundColor: cardBgColor, borderRadius: cardBorderRadius }}>
            <Image width={291} height={185} src={fetchedEvent ? fetchedEvent.bannerUrl : demoBanner} alt='placeholder' className={styles.banner} />
            <div className={styles.date_location_nameContainer}>
                <div className={styles.dateContainer}><span className={styles.date} style={{ fontSize: fontSettings.heading.fontSize }}>{day}</span>
                    <span className={styles.month} style={{ fontSize: fontSettings.heading.fontSize }}>{month}</span></div>
                <div className={styles.line}></div>
                <div className={styles.name_locationContainer}>
                    <div className={styles.locationContainer}>
                        {/* <Image src={locationIcon} alt='location' /> */}
                        <LocationIcon color={fontSettings.subheading.fontColor}/>
                        <div className={styles.location} style={{ fontSize: fontSettings.subheading.fontSize, color: fontSettings.subheading.fontColor, fontFamily: fontSettings.subheading.fontFamily, fontWeight: fontSettings.subheading.fontWeight }}>{fetchedEvent ? fetchedEvent.cityName + ", " + fetchedEvent.countryName : demoLocation}</div>
                    </div>
                    <div className={styles.eventName} style={{ fontSize: fontSettings.heading.fontSize, color: fontSettings.heading.fontColor, fontFamily: fontSettings.heading.fontFamily, fontWeight: fontSettings.heading.fontWeight }}>{fetchedEvent ? fetchedEvent.name.substring(0,15) : demoEventName}</div>
                </div>
            </div>
            <div className={styles.dividerLine}></div>
            <div className={styles.dateRange_typeContainer}>
                <div className={`${styles.pill} ${styles.dateRange}`} style={{ fontSize: fontSettings.body.fontSize }}>{fetchedEvent ? formatDate(fetchedEvent.startDate) + " - " + formatDate(fetchedEvent.endDate) : demoDate}</div>
                <div className={`${styles.pill} ${styles.type1}`} style={{ fontSize: fontSettings.body.fontSize }}>Tradeshow</div>
                <div className={`${styles.pill} ${styles.type2}`} style={{ fontSize: fontSettings.body.fontSize }}>Attending</div>
            </div>
        </div>
    )
}

export default EventCard1

interface IconProps {
    color: string;
}

function LocationIcon({ color }: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" fill={color} /></svg>
    )
}