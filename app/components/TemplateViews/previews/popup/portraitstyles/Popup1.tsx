import React from 'react'
import styles from './popup1.style.module.css'
import Image from 'next/image'
import placeholder2 from '/public/placeholder2.png'
import locationIcon from '/public/location_on.svg'

interface FontSettings {
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    fontWeight: string;
  }
  
  interface ButtonSettings {
    buttonColor: string;
    fontColor: string;
    borderRadius: number;
    borderColor: string;
    buttonText: string;
  }
  interface Props {
    cardBgColor?: string;
    cardBorderRadius?: number;
    fontSettings?: {
        heading: FontSettings;
        subheading: FontSettings;
        body: FontSettings;
    };
    buttonSettings?: {
        primary: ButtonSettings;
        secondary: ButtonSettings;
    };
}

const Popup1: React.FC<Props> = ({ cardBgColor = "#ffffff",
    cardBorderRadius = 2,
    fontSettings = {
      heading: { fontFamily: "arial", fontSize: 24, fontColor: "#000000", fontWeight: "bolder" },
      subheading: { fontFamily: "arial", fontSize: 16, fontColor: "#000000", fontWeight: "bolder" },
      body: { fontFamily: "arial", fontSize: 12, fontColor: "#000000", fontWeight: "bolder" }
    },
    buttonSettings = {
      primary: { buttonColor: "#0072F5", fontColor: "#000000", borderRadius: 4, borderColor: "#0072F5", buttonText: "Meet Us" },
      secondary: { buttonColor: "#6750a4", fontColor: "#000000", borderRadius: 4, borderColor: "#6750a4", buttonText: "Meet Us" }
    } }: Props) => {
    return (
        <div className={styles.card} style={{backgroundColor : cardBgColor, borderRadius: cardBorderRadius}}>
            <Image src={placeholder2} alt='placeholder' className={styles.banner} />
            <div className={styles.date_location_nameContainer}>
                <div className={styles.dateContainer}><span className={styles.date}>29</span>
                    <span className={styles.month}>Jan</span></div>
                <div className={styles.line}></div>
                <div className={styles.name_locationContainer}>
                    <div className={styles.locationContainer}>
                        <Image src={locationIcon} alt='location' />
                        <div className={styles.location} style={{fontSize : fontSettings.subheading.fontSize , color : fontSettings.subheading.fontColor, fontFamily : fontSettings.subheading.fontFamily, fontWeight : fontSettings.subheading.fontWeight}}>Corpus Christi, USA</div>
                    </div>
                    <div className={styles.eventName} style={{fontSize : fontSettings.heading.fontSize , color : fontSettings.heading.fontColor, fontFamily : fontSettings.heading.fontFamily, fontWeight : fontSettings.heading.fontWeight}}>Join Gifts World Expo 2024</div>
                </div>
            </div>
            <div className={styles.dividerLine}></div>
            <div className={styles.dateRange_typeContainer}>
                <div className={`${styles.pill} ${styles.dateRange}`}>29 Jan - 5 Feb</div>
                <div className={`${styles.pill} ${styles.type1}`}>Tradeshow</div>
                <div className={`${styles.pill} ${styles.type2}`}>Attending</div>
            </div>
            <div className={styles.desc} style={{fontSize : fontSettings.body.fontSize , color : fontSettings.body.fontColor, fontFamily : fontSettings.body.fontFamily, fontWeight : fontSettings.body.fontWeight}}>Amidst this gathering, immerse yourself in an atmosphere of collaboration and creative energy, as manufacturers, retailers, and distributors unite.....</div>
            <div className={styles.btnContainer}>
                <button className={styles.btn} style={{color : buttonSettings.primary.fontColor, backgroundColor : buttonSettings.primary.buttonColor, borderRadius :buttonSettings.primary.borderRadius , borderColor : buttonSettings.primary.borderColor}}>{buttonSettings.primary.buttonText}</button>
            </div>
        </div>
    )
}

export default Popup1