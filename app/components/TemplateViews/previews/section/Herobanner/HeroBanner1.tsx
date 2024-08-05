import React from 'react'
import styles from './herobanner1.style.module.css'
import Image from 'next/image'
import placeholder2 from '/public/placeholder2.png'
import locationIcon from '/public/location_on.svg'
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
    selectedBtn? : "primary" | "secondary"
}

const HeroBanner1: React.FC<Props> = ({ cardBgColor = "#ffffff",
    cardBorderRadius = 2,
    fontSettings = {
        heading: { fontFamily: "arial", fontSize: 24, fontColor: "#000000", fontWeight: "bolder" },
        subheading: { fontFamily: "arial", fontSize: 16, fontColor: "#000000", fontWeight: "bolder" },
        body: { fontFamily: "arial", fontSize: 12, fontColor: "#000000", fontWeight: "bolder" }
    },
    buttonSettings = {
        primary: { buttonColor: "#0072F5", fontColor: "#000000", borderRadius: 4, borderColor: "#0072F5", buttonText: "Meet Us" },
        secondary: { fontColor: "#000000", borderRadius: 4, borderColor: "#6750a4", buttonText: "Meet Us" }
    },selectedBtn ="primary" }: Props) => {

    return (
        <div className={styles.card} style={{ backgroundColor: cardBgColor, borderRadius: cardBorderRadius }}>
            <Image src={placeholder2} alt='banner' className={styles.banner} />
            <div className={styles.detailsContainer}>
                <div className={styles.name_locationContainer}>
                    <div className={styles.locationContainer}>
                        <Image src={locationIcon} alt='location' />
                        <div className={styles.location} style={{ fontSize: fontSettings.subheading.fontSize, color: fontSettings.subheading.fontColor, fontFamily: fontSettings.subheading.fontFamily, fontWeight: fontSettings.subheading.fontWeight }}>Corpus Christi, USA</div>
                    </div>
                    <div className={styles.eventName} style={{ fontSize: fontSettings.heading.fontSize, color: fontSettings.heading.fontColor, fontFamily: fontSettings.heading.fontFamily, fontWeight: fontSettings.heading.fontWeight }}>Join Gifts World Expo 2024</div>
                </div>
                <div className={styles.date_type_btnContainer}>
                    <div className={styles.dateTypeContainer}>
                        <div className={styles.dateContainer}><span className={styles.date}>29</span>
                            <span className={styles.month}>Jan</span></div>
                        <div className={styles.typeContainer}>
                            <div className={`${styles.pill} ${styles.type1}`}>Tradeshow</div>
                        </div>
                    </div>
                    <button
                        className={styles.btn}
                        style={{
                            color: selectedBtn === "primary" ? buttonSettings.primary.fontColor : buttonSettings.secondary.fontColor,
                            backgroundColor: selectedBtn === "primary" ? buttonSettings.primary.buttonColor : "transparent",
                            borderRadius: selectedBtn === "primary" ? buttonSettings.primary.borderRadius : buttonSettings.secondary.borderRadius,
                            borderColor: selectedBtn === "primary" ? buttonSettings.primary.borderColor : buttonSettings.secondary.borderColor
                        }}
                    >
                        {selectedBtn === "primary" ? buttonSettings.primary.buttonText : buttonSettings.secondary.buttonText}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default HeroBanner1