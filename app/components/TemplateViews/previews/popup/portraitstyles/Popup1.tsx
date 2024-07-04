import React from 'react'
import styles from './popup1.style.module.css'
import Image from 'next/image'
import placeholder2 from '/public/placeholder2.png'
import locationIcon from '/public/location_on.svg'

const Popup1 = () => {
    return (
        <div className={styles.card}>
            <Image src={placeholder2} alt='placeholder' className={styles.banner} />
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
            <div className={styles.dividerLine}></div>
            <div className={styles.dateRange_typeContainer}>
                <div className={`${styles.pill} ${styles.dateRange}`}>29 Jan - 5 Feb</div>
                <div className={`${styles.pill} ${styles.type1}`}>Tradeshow</div>
                <div className={`${styles.pill} ${styles.type2}`}>Attending</div>
            </div>
            <div className={styles.desc}>Amidst this gathering, immerse yourself in an atmosphere of collaboration and creative energy, as manufacturers, retailers, and distributors unite.....</div>
            <div className={styles.btnContainer}>
                <button className={styles.btn}>Register</button>
            </div>
        </div>
    )
}

export default Popup1