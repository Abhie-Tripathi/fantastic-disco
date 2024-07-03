import React from 'react'
import styles from './eventlistcard1.style.module.css'
import Image from 'next/image'
import placeholder2 from '/public/placeholder2.png'
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

const EventListCard1 = ({
  cardRadius = 10,
  cardBgColor = '#6750a4',
  eventNameColor = '#000',
  eventNameSize = 16,
  dateFontSize = 12,
  locationFontSize = 12,
  btnBgColor = '#007bff',
  btnFontColor = '#fff',
  btnBorderWidth = 1,
  btnBorderColor = '#007bff',
  btnRadius = 5,
  btnFontSize = 14 }: CardProps) => {
  return (
    <div className={styles.card}>
      <Image src={placeholder2} alt='banner' className={styles.banner} />
      <div className={styles.detailsContainer}>
        <div className={styles.date_location_nameContainer}>
          <div className={styles.dateContainer}><span className={styles.date}>29</span>
            <span className={styles.month}>Jan</span></div>
          <div className={styles.line}></div>
          <div className={styles.name_locationContainer}>
            <div className={styles.locationContainer}>
              <Image src={locationIcon} alt='location' />
              <div className={styles.location}>Corpus Christi, USA</div>
            </div>
            <div className={styles.eventName}>Join Gifts World Expo 2024</div>
          </div>
        </div>
        <div className={styles.description}>Amidst this gathering, immerse yourself in an atmosphere of collaboration and creative energy, as manufacturers, retailers, and distributors unite.....</div>
        <div className={styles.dateRange_typeContainer}>
          <div className={`${styles.pill} ${styles.dateRange}`}>29 Jan - 5 Feb</div>
          <div className={`${styles.pill} ${styles.type1}`}>Tradeshow</div>
          <div className={`${styles.pill} ${styles.type2}`}>Attending</div>
        </div>
      </div>
    </div>
  );
}

export default EventListCard1