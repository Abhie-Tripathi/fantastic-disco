import React from 'react'
import styles from './eventcard1.style.module.css'
import Image from 'next/image'
import placeholder from '/public/placeholder.png'
import locationIcon from '/public/location_on.svg'

interface CardProps {
    cardRadius?: number;
    cardBgColor?: string;
    eventNameColor?: string;
    eventNameSize?: number;
    dateFontSize?: number;
    locationFontSize?: number;
    btnBgColor?: string;
    btnFontColor?: string;
    btnBorderWidth?: number;
    btnBorderColor?: string;
    btnRadius?: number;
    btnFontSize?: number;
}

const EventCard1 = ({
    cardRadius = 8, // default value
    cardBgColor = '#1a1a1a', // default value
    eventNameColor = '#ffffff', // default value
    eventNameSize = 24, // default value
    dateFontSize = 14, // default value
    locationFontSize = 14, // default value
    btnBgColor = '#007BFF', // default value
    btnFontColor = '#ffffff', // default value
    btnBorderWidth = 1, // default value
    btnBorderColor = '#007BFF', // default value
    btnRadius = 5, // default value
    btnFontSize = 16 // default value
}: CardProps) => {

    return (
        <div className={styles.card}>
            <Image src={placeholder} alt='placeholder' className={styles.banner}/>
            <div className={styles.date_location_nameContainer}>
                <div className={styles.dateContainer}><span className={styles.date}>29</span>
                <span className={styles.month}>Jan</span></div>
                <div className={styles.line}></div>
                <div className={styles.name_locationContainer}>
                    <div className={styles.locationContainer}>
                        <Image src={locationIcon} alt='location'/>
                        <div className={styles.location}>Corpus Christi, USA</div>
                    </div>
                    <div className={styles.eventName}>Join Gifts World Expo 2024</div>
                </div>
            </div>
            <div className={styles.dividerLine}></div>
            <div className={styles.dateRange_typeContainer}>
                <div className={`${styles.pill} ${styles.dateRange}`}>29 Jan - 5 Feb</div>
                <div className={`${styles.pill} ${styles.type1}`}>Tradeshow</div>
                <div className={`${styles.pill} ${styles.type2}`}>Attending</div>
            </div>
        </div>
    )
}

export default EventCard1
