import React from 'react'
import styles from './herobanner.style.module.css'
import placeholder from '/public/placeholder.png'
import Image from 'next/image'

interface Props {
    setPreview: (id: string) => void;
}

const HeroBanner = ({ setPreview }: Props) => {
    return (
        <div className={styles.body}>
            <div className={styles.heading_btnContainer}>
                <div className={styles.heading}>Hero Banner</div>
                <div className={styles.closeBtn} onClick={() => setPreview("")}>x</div>
            </div>
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
        </div>
    )
}

export default HeroBanner