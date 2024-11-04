import React from 'react'
import styles from './popup1.style.module.css'
import Image from 'next/image'
// import placeholder2 from '/public/placeholder.png'
import placeholder2 from '/public/DemoBanner.png'
import locationIcon from '/public/location_on.svg'
import { PrefilledAddedEventsType } from '@/types/prefilledaddedeventtype'
import { ButtonSettingsState } from '@/types/buttoncustomizetypes'
import POP from '/public/partyPopIcon.svg'
    import TradeshowIcon from '/public/tradeshowIcon.svg'
import WorkShopIcon from '/public/workshop.svg'
import ConferenceIcon from '/public/conference.svg'
import DefaultIcon from '/public/widgetDefaultIcon.svg'

interface FontSettings {
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    fontWeight: string;
}

interface Props {
    cardBgColor?: string;
    cardBorderRadius?: number;
    fontSettings?: {
        heading: FontSettings;
        subheading: FontSettings;
        body: FontSettings;
    };
    buttonSettings?: ButtonSettingsState
    closeButtonSetting?:ButtonSettingsState
    selectedBtn?: "primary" | "secondary"
    fetchedAddedEvents?: PrefilledAddedEventsType[];
    smallCard: boolean;
    demoBanner:string;
    demoEventName:string,
    demoDescription:string
    demoLocation:string
    demoDate:string
}

const Popup1: React.FC<Props> = ({ cardBgColor = "#ffffff",
    cardBorderRadius,
    fontSettings,
    buttonSettings, selectedBtn, fetchedAddedEvents, smallCard,demoEventName, demoBanner, demoDescription, demoLocation,closeButtonSetting,demoDate }: Props) => {
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
    const description = fetchedAddedEvents && fetchedAddedEvents.length ? truncateText(fetchedAddedEvents[0].description, 150) : demoDescription;
    const { day, month } = fetchedAddedEvents && fetchedAddedEvents.length ? formatStartDate(fetchedAddedEvents[0].startDate) : { day: 1, month: "Jan" };
    const truncatedDescription = description.substring(0, 150) + (description.length > 150 ? "..." : "");
    return (
        <div className={smallCard ? styles.smallCard : styles.card} style={{ backgroundColor: cardBgColor, borderRadius: cardBorderRadius }}>
            <Image src={fetchedAddedEvents && fetchedAddedEvents.length > 0 ? fetchedAddedEvents[0].bannerUrl : demoBanner} alt='banner' width={300} height={smallCard ? 170 : 220} className={styles.banner} />
            <div className={`${styles.date_location_nameContainer} ${smallCard ?styles.smalldate_location_nameContainer:"" }`}>
                {/* <div className={smallCard ? styles.smallDateContainer : styles.dateContainer}>
                    <span className={styles.date} style={{ fontSize: smallCard ? 16 : fontSettings?.heading.fontSize }}>{day}</span>
                    <span className={styles.month} style={{ fontSize: smallCard ? 16 : fontSettings?.heading.fontSize }}>{month}</span>
                </div> */}
                 <div className={styles.dateContainer}>
                    
                    {
                        fetchedAddedEvents![0]?.eventType === "SUB" ? <><Image src={POP} alt=''/></>:fetchedAddedEvents![0]?.eventType === "MAIN" && fetchedAddedEvents![0].event_type==="Tradeshow" ? <Image src={TradeshowIcon} alt=''/>:fetchedAddedEvents![0]?.eventType === "MAIN" && fetchedAddedEvents![0].event_type==="Conference" ? <Image src={ConferenceIcon} alt=''/>: fetchedAddedEvents![0]?.eventType === "MAIN" && fetchedAddedEvents![0].event_type==="Workshop" ?<Image src={WorkShopIcon} alt=''/>:<Image src={DefaultIcon} alt=''/>
                    }
                </div>
                <div className={styles.line}></div>
                <div className={styles.name_locationContainer}>
                    <div className={styles.locationContainer}>
                        <LocationIcon color={fontSettings?.subheading.fontColor || "black"} />
                        <div className={styles.location} style={{ fontSize: fontSettings?.subheading.fontSize, color: fontSettings?.subheading.fontColor, fontFamily: fontSettings?.subheading.fontFamily, fontWeight: fontSettings?.subheading.fontWeight }}>{fetchedAddedEvents && fetchedAddedEvents.length > 0 ? (fetchedAddedEvents[0]?.eventFormat==="Virtual"?"Virtual": fetchedAddedEvents[0].cityName + ", " + fetchedAddedEvents[0].countryName).substring(0,30) : demoLocation}</div>
                    </div>
                    <div className={`${styles.eventName} ${smallCard ? styles.smallName : ""}`} style={{ fontSize: smallCard ? 16 : fontSettings?.heading.fontSize, color: fontSettings?.heading.fontColor, fontFamily: fontSettings?.heading.fontFamily, fontWeight: fontSettings?.heading.fontWeight }}>{fetchedAddedEvents && fetchedAddedEvents.length > 0 ? `${fetchedAddedEvents[0].name.substring(0,40)} ${fetchedAddedEvents[0].name.length > 40 ? "..." : ""}` : demoEventName}</div>
                </div>
            </div>
            <div className={styles.dividerLine}></div>
            <div className={styles.dateRange_typeContainer}>
                <div className={`${styles.pill} ${styles.dateRange}`} style={{ fontSize: fontSettings?.body.fontSize }}>{fetchedAddedEvents && fetchedAddedEvents.length ? formatDate(fetchedAddedEvents[0].startDate) + " - " + formatDate(fetchedAddedEvents[0].endDate) : demoDate}</div>
                <div className={`${styles.pill} ${styles.type1}`} style={{ fontSize: fontSettings?.body.fontSize }}>{fetchedAddedEvents![0]?.eventType === "MAIN"? fetchedAddedEvents![0].event_type: fetchedAddedEvents![0]?.eventType === "SUB" ?fetchedAddedEvents![0].participationType:"Tradeshow"}</div>
                <div className={`${styles.pill} ${styles.type2}`} style={{ fontSize: fontSettings?.body.fontSize }}>{fetchedAddedEvents![0]?.eventType === "MAIN"? fetchedAddedEvents![0].eventFormat: fetchedAddedEvents![0]?.eventType==="SUB" ?fetchedAddedEvents![0].eventFormat:"Attending"}</div>
            </div>
            <div
                className={`${styles.description} ${smallCard ? styles.smallDescription : ""}`}
                style={{
                    fontSize: fontSettings?.body.fontSize,
                    color: fontSettings?.body.fontColor,
                    fontFamily: fontSettings?.body.fontFamily,
                    fontWeight: fontSettings?.body.fontWeight,
                }}
                dangerouslySetInnerHTML={{ __html: truncatedDescription }}
            />
            <div className={styles.btnContainer}>
                <button
                    className={smallCard ? styles.smallBtn : styles.btn}
                    style={{
                        fontSize: smallCard ? 12 : fontSettings?.subheading.fontSize,
                        color: selectedBtn === "primary" ? buttonSettings?.primary.fontColor : buttonSettings?.secondary.fontColor,
                        backgroundColor: selectedBtn === "primary" ? buttonSettings?.primary.buttonColor : "transparent",
                        borderRadius: selectedBtn === "primary" ? buttonSettings?.primary.borderRadius : buttonSettings?.secondary.borderRadius,
                        borderColor: selectedBtn === "primary" ? buttonSettings?.primary.borderColor : buttonSettings?.secondary.borderColor,
                    }}
                >
                    {selectedBtn === "primary" ? buttonSettings?.primary.buttonText : buttonSettings?.secondary.buttonText}
                </button>

                <button
                    className={smallCard ? styles.smallBtn : styles.btn}
                    style={{
                        fontSize: smallCard ? 12 : fontSettings?.subheading.fontSize,
                        color: selectedBtn === "primary" ? closeButtonSetting?.primary.fontColor : closeButtonSetting?.secondary.fontColor,
                        backgroundColor: selectedBtn === "primary" ? closeButtonSetting?.primary.buttonColor : "transparent",
                        borderRadius: selectedBtn === "primary" ? closeButtonSetting?.primary.borderRadius : closeButtonSetting?.secondary.borderRadius,
                        border: "none"
                    }}
                >
                    {selectedBtn === "primary" ? closeButtonSetting?.primary.buttonText : closeButtonSetting?.secondary.buttonText}
                </button>
            </div>
        </div>
    )
}

export default Popup1

interface IconProps {
    color: string;
}
function LocationIcon({ color }: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" fill={color} /></svg>
    )
}