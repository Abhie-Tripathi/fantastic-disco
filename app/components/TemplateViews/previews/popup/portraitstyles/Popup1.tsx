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
import { useRouter } from 'next/navigation'
import { LocationIcon } from '../../LocationIcon'

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
    widgetId?: string;
}

const Popup1: React.FC<Props> = ({ cardBgColor = "#ffffff",
    cardBorderRadius,
    fontSettings,
    buttonSettings, selectedBtn, fetchedAddedEvents, smallCard,demoEventName, demoBanner, demoDescription, demoLocation,closeButtonSetting,demoDate, widgetId }: Props) => {
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
    
    const router = useRouter();
    const handleCardClick = (eventId: string, widgetId: string) => {
      router.push(`/detailpage?widgetId=${widgetId}&eventId=${eventId}`);
    };
  

    return (
        <div className={smallCard ? styles.smallCard : styles.card} style={{ backgroundColor: cardBgColor, borderRadius: cardBorderRadius }}>
            <Image src={fetchedAddedEvents && fetchedAddedEvents.length > 0 ? fetchedAddedEvents[0].bannerUrl : demoBanner} alt='banner' 
            width={200}
            height={smallCard ? 170 : 220}
            className={`w-full ${styles.banner} ${smallCard ? 'h-[170px]' : 'h-[220px]'} rounded-b-[50px] shadow-md`}
            />
            <div className={`${styles.date_location_nameContainer} ${smallCard ?styles.smalldate_location_nameContainer:"" }`}>
                {/* <div className={smallCard ? styles.smallDateContainer : styles.dateContainer}>
                    <span className={styles.date} style={{ fontSize: smallCard ? 16 : fontSettings?.heading.fontSize }}>{day}</span>
                    <span className={styles.month} style={{ fontSize: smallCard ? 16 : fontSettings?.heading.fontSize }}>{month}</span>
                </div> */}
                 <div className={styles.dateContainer}>
                    
                    {
                        fetchedAddedEvents![0]?.eventType === "CHILD" ? <><Image src={POP} alt=''/></>:fetchedAddedEvents![0]?.eventType === "PARENT" && fetchedAddedEvents![0].event_type==="Tradeshow" ? <Image src={TradeshowIcon} alt=''/>:fetchedAddedEvents![0]?.eventType === "PARENT" && fetchedAddedEvents![0].event_type==="Conference" ? <Image src={ConferenceIcon} alt=''/>: fetchedAddedEvents![0]?.eventType === "PARENT" && fetchedAddedEvents![0].event_type==="Workshop" ?<Image src={WorkShopIcon} alt=''/>:<Image src={DefaultIcon} alt=''/>
                    }
                </div>
                <div className={styles.line}></div>
                <div className={styles.name_locationContainer}>
                    <div className={styles.locationContainer}>
                        <LocationIcon color={fontSettings?.subheading.fontColor || "black"} iconSize={fontSettings?.subheading.fontSize || 14}/>
                        <div className={styles.location} style={{ fontSize: fontSettings?.subheading.fontSize, color: fontSettings?.subheading.fontColor, fontFamily: fontSettings?.subheading.fontFamily, fontWeight: fontSettings?.subheading.fontWeight }}>{fetchedAddedEvents && fetchedAddedEvents.length > 0 ? (fetchedAddedEvents[0]?.eventFormat==="Virtual"?"Virtual": fetchedAddedEvents[0].cityName + ", " + fetchedAddedEvents[0].countryName).substring(0,30) : demoLocation}</div>
                    </div>
                    <div data-name={fetchedAddedEvents![0]? fetchedAddedEvents![0].name :demoEventName} className={`${styles.eventName} ${smallCard ? styles.smallName : ""}`} style={{ fontSize: smallCard ? 16 : fontSettings?.heading.fontSize, color: fontSettings?.heading.fontColor, fontFamily: fontSettings?.heading.fontFamily, fontWeight: fontSettings?.heading.fontWeight }}>{fetchedAddedEvents && fetchedAddedEvents.length > 0 ? `${fetchedAddedEvents[0].name.substring(0,20)} ${fetchedAddedEvents[0].name.length > 20 ? "..." : ""}` : demoEventName}</div>
                </div>
            </div>
            <div className={styles.dividerLine}></div>
            <div className={styles.dateRange_typeContainer}>
                <div className={`${styles.pill} ${styles.dateRange}`} style={{ fontSize: fontSettings?.body.fontSize }}>{fetchedAddedEvents && fetchedAddedEvents.length ? formatDate(fetchedAddedEvents[0].startDate) + " - " + formatDate(fetchedAddedEvents[0].endDate) : demoDate}</div>
                <div className={`${styles.pill} ${styles.type1}`} style={{ fontSize: fontSettings?.body.fontSize }}>
                    {fetchedAddedEvents![0]?.eventType === "PARENT"? fetchedAddedEvents![0].event_type: fetchedAddedEvents![0]?.eventType === "CHILD" ?fetchedAddedEvents![0].event_type:"Tradeshow"}
                </div>
                <div className={`${styles.pill} ${styles.type2}`} style={{ fontSize: fontSettings?.body.fontSize }}>{fetchedAddedEvents![0]?.eventType === "PARENT"? fetchedAddedEvents![0].eventFormat: fetchedAddedEvents![0]?.eventType==="SUB" ?fetchedAddedEvents![0].eventFormat:"In-Person"}</div>
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
                onClick={() => handleCardClick(fetchedAddedEvents ? fetchedAddedEvents[0].id : "", widgetId ? widgetId : "")}
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
