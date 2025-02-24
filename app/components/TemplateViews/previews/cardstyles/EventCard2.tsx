import React from 'react'
import styles from './eventcard2.style.module.css'
import Image from 'next/image'
import placeholder2 from '/public/placeholder2.png'
import locationIcon from '/public/location_on.svg'
import person1 from "@/public/person1.svg";
import person2 from "@/public/person2.svg";
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
    cardBorderRadius?: number
    fontSettings?: {
        heading: FontSettings;
        subheading: FontSettings;
        body: FontSettings;
    };
    fetchedEvent?: PrefilledAddedEventsType
    demoEventName: string;
    demoBanner: string
    demoDescription: string
    demoLocation: string
    demoDate: string
}

const EventCard2 = ({
    cardBgColor = "#ffffff",
    cardBorderRadius = 20,
    fontSettings = {
        heading: { fontFamily: "arial", fontSize: 24, fontColor: "#000000", fontWeight: "bolder" },
        subheading: { fontFamily: "arial", fontSize: 14, fontColor: "#000000", fontWeight: "bolder" },
        body: { fontFamily: "arial", fontSize: 12, fontColor: "#000000", fontWeight: "bolder" }
    }, fetchedEvent,
    demoEventName,
    demoBanner,
    demoDescription,
    demoLocation,
    demoDate
}: CardProps) => {

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
    const formatLocation = (event: any) => {
        if (event?.eventFormat === "Virtual") {
            return "Virtual";
        }

        const location = `${event?.cityName} ${event?.cityName && ","} ${event?.countryName}`;
        return location.length > 20 ? `${location.slice(0, 17)}...` : location;
    };
    return (
        <div className={styles.card} style={{ backgroundColor: cardBgColor, borderRadius: cardBorderRadius }}>
            <div className={styles.event_name_container}>
            <div className={styles.eventName} data-name={fetchedEvent && fetchedEvent.name}  style={{ fontSize: fontSettings.heading.fontSize, color: fontSettings.heading.fontColor, fontFamily: fontSettings.heading.fontFamily, fontWeight: fontSettings.heading.fontWeight }}> {fetchedEvent
                ? fetchedEvent.name.length > 30
                    ? `${fetchedEvent.name.substring(0, 30)}...`
                    : fetchedEvent.name
                : demoEventName}</div>
            </div>
            
            <div className={styles.location_dateContainer}>
                <div className={styles.locationContainer}>
                    <LocationIcon color={fontSettings.subheading.fontColor} iconSize={fontSettings?.subheading.fontSize || 14}/>
                    <div className={styles.location} style={{ fontSize: fontSettings.subheading.fontSize, color: fontSettings.subheading.fontColor, fontFamily: fontSettings.subheading.fontFamily, fontWeight: fontSettings.subheading.fontWeight }}>{fetchedEvent ? formatLocation(fetchedEvent) : demoLocation}</div>
                </div>
                <div className={styles.dateContainer}>
                    <DateIcon color={fontSettings.subheading.fontColor} iconSize={fontSettings?.subheading.fontSize || 14}/>
                    <div className={styles.date} style={{ fontSize: fontSettings.subheading.fontSize, color: fontSettings.subheading.fontColor, fontFamily: fontSettings.subheading.fontFamily, fontWeight: fontSettings.subheading.fontWeight }}>{fetchedEvent ? formatDate(fetchedEvent.startDate) + " - " + formatDate(fetchedEvent.endDate) : demoDate}</div>
                </div>
            </div>
            <Image width={280} height={124} src={fetchedEvent ? fetchedEvent.bannerUrl : demoBanner} alt='placeholder' className={`${styles.banner} shadow-md`} />
            <div className={styles.dividerLine}></div>
            <div className={styles.type_peopleContainer}>
                <div className={styles.typeContainer}>
                    <div className={`${styles.pill} ${styles.type1}`} style={{ fontSize: fontSettings.body.fontSize }}>{fetchedEvent?.eventType === "PARENT" ? "Main Event" : fetchedEvent?.eventType === "CHILD" ? "Side Event" : "Main Event"}</div>
                    <div className={`${styles.pill} ${styles.type1}`} style={{ fontSize: fontSettings.body.fontSize }}>{fetchedEvent ? fetchedEvent?.event_type : "Tradeshow"}</div>
                    <div className={`${styles.pill} ${styles.type2}`} style={{ fontSize: fontSettings.body.fontSize }}>{fetchedEvent ? fetchedEvent?.eventFormat : "In-Person"}</div>
                </div>
                {/* <div className={styles.circles}>
                    <div className={styles.circle} data-name="John Doe">
                        <Image className={styles.image} src={person1} alt="person1" />
                    </div>
                    <div
                        className={styles.circle}
                        style={{ marginLeft: "-5px" }}
                        data-name="Jane Smith"
                    >
                        <Image className={styles.image} src={person2} alt="person2" />
                    </div>
                    <div className={styles.circle} data-name="John Doe">
                        <Image className={styles.image} src={person1} alt="person1" style={{ marginLeft: "-5px" }} />
                    </div>
                    <div
                        className={styles.circle}
                        style={{ marginLeft: "-5px" }}
                        data-name="Jane Smith"
                    >
                        <Image className={styles.image} src={person2} alt="person2" />
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default EventCard2
