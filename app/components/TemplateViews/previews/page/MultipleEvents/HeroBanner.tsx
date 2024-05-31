import React, { useEffect } from 'react'
import styles from './herobanner.style.module.css'
import placeholder from '/public/placeholder.png'
import Image from 'next/image'


interface HeroBannerProps {
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

const HeroBanner: React.FC<HeroBannerProps> = ({
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
        <div
            className={styles.heroBanner}
            style={{ borderRadius: `${cardRadius}px`, backgroundColor: cardBgColor }}
        >
            <div className={styles.eventDetails}>
                <div
                    className={styles.date}
                    style={{ fontSize: `${dateFontSize}px` }}
                >
                    Date
                </div>
                <div
                    className={styles.name}
                    style={{ color: eventNameColor, fontSize: `${eventNameSize}px` }}
                >
                    Name Of Event
                </div>
                <div className={styles.detail_btnContainer}>
                    <div className={styles.location_descContainer}>
                        <div
                            className={styles.location}
                            style={{ fontSize: `${locationFontSize}px` }}
                        >
                            Country
                        </div>
                        <div className={styles.desc}>Your Description</div>
                    </div>
                    <div
                        className={styles.btn}
                        style={{
                            backgroundColor: btnBgColor,
                            color: btnFontColor,
                            borderWidth: `${btnBorderWidth}px`,
                            borderColor: btnBorderColor,
                            borderRadius: `${btnRadius}px`,
                            fontSize: `${btnFontSize}px`,
                            borderStyle: 'solid',
                        }}
                    >
                        Register
                    </div>
                </div>
            </div>
            <Image className={styles.eventImg} src={placeholder} alt="Event" />
        </div>
    );
}

export default HeroBanner