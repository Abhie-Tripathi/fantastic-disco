import React from 'react'
import styles from './herobanner3.style.module.css';
import Image from 'next/image'
import placeholder2 from '/public/placeholder2.png'
import locationIcon from '/public/location_on.svg'


const HeroBanner3 = () => {
    return (
        <div className={styles.card}>
            <div className={styles.bannerContainer}>
                <Image src={placeholder2} alt='placeholder' className={styles.banner} />
                <div className={styles.type}>Workshop</div>
            </div>
            <div className={styles.eventDetails}>
                <div className={styles.eventName}>East Midlands Young Planners</div>
                <div className={styles.location_date_btnContainer}>
                    <div className={styles.location_dateContainer}>
                        <div className={styles.locationContainer}>
                            <Image src={locationIcon} alt='location' />
                            <div className={styles.location}>Corpus Christi, USA</div>
                        </div>
                        <div className={styles.dateContainer}>
                            <DateIcon />
                            <div className={styles.date}>1st Apr 2024 - 20th Apr 2024</div>
                        </div>
                    </div>
                    <button className={styles.registerBtn}>Register</button>
                </div>
            </div>
        </div>
    );
}

export default HeroBanner3

function DateIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="15" viewBox="0 -960 960 960" width="15"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" fill="black" /></svg>
    )
}