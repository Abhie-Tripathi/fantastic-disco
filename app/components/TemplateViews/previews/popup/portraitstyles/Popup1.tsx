import React from 'react'
import styles from './popup1.style.module.css'
import Image from 'next/image'
import placeholder2 from '/public/placeholder2.png'
import locationIcon from '/public/location_on.svg'
import { PrefilledAddedEventsType } from '@/types/prefilledaddedeventtype'
import { ButtonSettingsState } from '@/types/buttoncustomizetypes'

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
    selectedBtn?: "primary" | "secondary"
    fetchedAddedEvents?: PrefilledAddedEventsType[];
    smallCard: boolean;
}

const Popup1: React.FC<Props> = ({ cardBgColor = "#ffffff",
    cardBorderRadius,
    fontSettings,
    buttonSettings, selectedBtn, fetchedAddedEvents, smallCard }: Props) => {
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
    const description = fetchedAddedEvents && fetchedAddedEvents.length ? truncateText(fetchedAddedEvents[0].description, 150) : "Some Description";
    const { day, month } = fetchedAddedEvents && fetchedAddedEvents.length ? formatStartDate(fetchedAddedEvents[0].startDate) : { day: 1, month: "Jan" };
    return (
        <div className={smallCard ? styles.smallCard : styles.card} style={{ backgroundColor: cardBgColor, borderRadius: cardBorderRadius }}>
            <Image src={fetchedAddedEvents && fetchedAddedEvents.length > 0 ? fetchedAddedEvents[0].bannerUrl : placeholder2} alt='banner' width={300} height={smallCard ? 170 : 220} className={styles.banner} />
            <div className={styles.date_location_nameContainer}>
                <div className={smallCard ?  styles.smallDateContainer :styles.dateContainer}>
                    <span className={styles.date} style={{ fontSize: smallCard ? 16 : fontSettings?.heading.fontSize }}>{day}</span>
                    <span className={styles.month} style={{ fontSize: smallCard ? 16 : fontSettings?.heading.fontSize }}>{month}</span>
                </div>
                <div className={styles.line}></div>
                <div className={styles.name_locationContainer}>
                    <div className={styles.locationContainer}>
                        <Image src={locationIcon} alt='location' />
                        <div className={styles.location} style={{ fontSize: fontSettings?.subheading.fontSize, color: fontSettings?.subheading.fontColor, fontFamily: fontSettings?.subheading.fontFamily, fontWeight: fontSettings?.subheading.fontWeight }}>{fetchedAddedEvents && fetchedAddedEvents.length > 0 ? fetchedAddedEvents[0].cityName + ", " + fetchedAddedEvents[0].countryName : "Corpus Christi, USA"}</div>
                    </div>
                    <div className={styles.eventName} style={{ fontSize: smallCard ? 16 : fontSettings?.heading.fontSize, color: fontSettings?.heading.fontColor, fontFamily: fontSettings?.heading.fontFamily, fontWeight: fontSettings?.heading.fontWeight }}>{fetchedAddedEvents && fetchedAddedEvents.length > 0 ? fetchedAddedEvents[0].name : "Join Gifts World Expo 2024"}</div>
                </div>
            </div>
            <div className={styles.dividerLine}></div>
            <div className={styles.dateRange_typeContainer}>
                <div className={`${styles.pill} ${styles.dateRange}`} style={{ fontSize: fontSettings?.body.fontSize }}>{fetchedAddedEvents && fetchedAddedEvents.length ? formatDate(fetchedAddedEvents[0].startDate) + " - " + formatDate(fetchedAddedEvents[0].endDate) : "29 Jan - 5 Feb"}</div>
                <div className={`${styles.pill} ${styles.type1}`} style={{ fontSize: fontSettings?.body.fontSize }}>Tradeshow</div>
                <div className={`${styles.pill} ${styles.type2}`} style={{ fontSize: fontSettings?.body.fontSize }}>Attending</div>
            </div>
            <div
                className={styles.desc}
                style={{
                    fontSize: fontSettings?.body.fontSize,
                    color: fontSettings?.body.fontColor,
                    fontFamily: fontSettings?.body.fontFamily,
                    fontWeight: fontSettings?.body.fontWeight,
                }}
                dangerouslySetInnerHTML={{ __html: description }}
            />
            <div className={styles.btnContainer}>
                <button
                    className={smallCard ? styles.smallBtn :styles.btn}
                    style={{
                        fontSize : smallCard ? 14 : fontSettings?.subheading.fontSize,
                        color: selectedBtn === "primary" ? buttonSettings?.primary.fontColor : buttonSettings?.secondary.fontColor,
                        backgroundColor: selectedBtn === "primary" ? buttonSettings?.primary.buttonColor : "transparent",
                        borderRadius: selectedBtn === "primary" ? buttonSettings?.primary.borderRadius : buttonSettings?.secondary.borderRadius,
                        borderColor: selectedBtn === "primary" ? buttonSettings?.primary.borderColor : buttonSettings?.secondary.borderColor,
                    }}
                >
                    {selectedBtn === "primary" ? buttonSettings?.primary.buttonText : buttonSettings?.secondary.buttonText}
                </button>
            </div>
        </div>
    )
}

export default Popup1