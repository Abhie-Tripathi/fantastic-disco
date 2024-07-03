import React from 'react'
import styles from './herobanner1.style.module.css'
import Image from 'next/image'
import placeholder2 from '/public/placeholder2.png'
import locationIcon from '/public/location_on.svg'


interface EditProps {
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

const HeroBanner1: React.FC<EditProps> = ({
    cardRadius,
    cardBgColor,
    eventNameColor,
    eventNameSize,
    dateFontSize,
    locationFontSize,
    btnBgColor,
    btnFontColor,
    btnBorderWidth,
    btnBorderColor,
    btnRadius,
    btnFontSize,
}) => {

    return (
        <div className={styles.card}>
            <Image src={placeholder2} alt='banner' className={styles.banner} />
            <div className={styles.detailsContainer}>
                <div className={styles.name_locationContainer}>
                    <div className={styles.locationContainer}>
                        <Image src={locationIcon} alt='location' />
                        <div className={styles.location}>Corpus Christi, USA</div>
                    </div>
                    <div className={styles.eventName}>Join Gifts World Expo 2024</div>
                </div>
                <div className={styles.date_type_btnContainer}>
                    <div className={styles.dateTypeContainer}>
                        <div className={styles.dateContainer}><span className={styles.date}>29</span>
                            <span className={styles.month}>Jan</span></div>
                        <div className={styles.typeContainer}>
                            <div className={`${styles.pill} ${styles.type1}`}>Tradeshow</div>
                        </div>
                    </div>
                    <button className={styles.registerBtn}>Register</button>
                </div>

            </div>
        </div>
    );
}

export default HeroBanner1