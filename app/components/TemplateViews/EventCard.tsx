import React from 'react'
import styles from './eventcard.style.module.css'
import Image from 'next/image'
import placeholder from '/public/placeholder.png'

const EventCard = () => {
    return (
        <div className={styles.card}>
            <Image src={placeholder} alt="author" className={styles.banner}/>
            <div className={styles.content}>
                <div className={styles.tag}>Type</div>
                <div className={styles.date}>Date</div>
                <div className={styles.eventName}>Event Name</div>
                <div className={styles.location}>Location</div>
                <div className={styles.btn}>
                    <div>Register</div>
                </div>
            </div>
        </div>
    )
}

export default EventCard