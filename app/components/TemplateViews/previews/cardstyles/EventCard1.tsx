import React from 'react'
import styles from './eventcard1.style.module.css'
import Image from 'next/image'
import placeholder2 from '/public/placeholder2.png'
import locationIcon from '/public/location_on.svg'

interface FontSettings {
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    fontWeight: string;
}
interface CardProps {
    cardBgColor? : string;
    cardBorderRadius? : number;
    fontSettings?: {
        heading: FontSettings;
        subheading: FontSettings;
        body: FontSettings;
    };
}

const EventCard1 = ({
    cardBgColor = "#ffffff",
    cardBorderRadius = 20,
    fontSettings = {
      heading: { fontFamily: "arial", fontSize: 24, fontColor: "#000000", fontWeight: "bolder" },
      subheading: { fontFamily: "arial", fontSize: 16, fontColor: "#000000", fontWeight: "bolder" },
      body: { fontFamily: "arial", fontSize: 12, fontColor: "#000000", fontWeight: "bolder" }
    },
}: CardProps) => {

    return (
        <div className={styles.card} style={{backgroundColor : cardBgColor, borderRadius: cardBorderRadius}}>
            <Image src={placeholder2} alt='placeholder' className={styles.banner}/>
            <div className={styles.date_location_nameContainer}>
                <div className={styles.dateContainer}><span className={styles.date} style={{fontSize : fontSettings.heading.fontSize}}>29</span>
                <span className={styles.month} style={{fontSize : fontSettings.heading.fontSize}}>Jan</span></div>
                <div className={styles.line}></div>
                <div className={styles.name_locationContainer}>
                    <div className={styles.locationContainer}>
                        <Image src={locationIcon} alt='location'/>
                        <div className={styles.location} style={{fontSize : fontSettings.subheading.fontSize , color : fontSettings.subheading.fontColor, fontFamily : fontSettings.subheading.fontFamily, fontWeight : fontSettings.subheading.fontWeight}}>Corpus Christi, USA</div>
                    </div>
                    <div className={styles.eventName} style={{fontSize : fontSettings.heading.fontSize , color : fontSettings.heading.fontColor, fontFamily : fontSettings.heading.fontFamily, fontWeight : fontSettings.heading.fontWeight}}>Join Gifts World Expo 2024</div>
                </div>
            </div>
            <div className={styles.dividerLine}></div>
            <div className={styles.dateRange_typeContainer}>
                <div className={`${styles.pill} ${styles.dateRange}`} style={{fontSize : fontSettings.body.fontSize}}>29 Jan - 5 Feb</div>
                <div className={`${styles.pill} ${styles.type1}`} style={{fontSize : fontSettings.body.fontSize}}>Tradeshow</div>
                <div className={`${styles.pill} ${styles.type2}`} style={{fontSize : fontSettings.body.fontSize}}>Attending</div>
            </div>
        </div>
    )
}

export default EventCard1
