import React from 'react'
import styles from './herobanner.style.module.css'
import placeholder from '/public/placeholder.png'
import Image from 'next/image'

const HeroBanner = () => {
    return (
        <div className={styles.heroBanner}>
            <div className={styles.eventContainer}>
                <div className={styles.eventDetails}>
                    <div className={styles.date}>Date</div>
                    <div className={styles.name}>Name Of Event</div>
                    <div className={styles.location}>Country</div>
                    <div className={styles.desc}>Your Description</div>
                </div>
                <Image className={styles.eventImg} src={placeholder} alt="Event" />
            </div>
        </div>
    )
}

export default HeroBanner