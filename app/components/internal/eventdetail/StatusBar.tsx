'use client'
import React from 'react'
import styles from './eventdesc.style.module.css'
import Image from 'next/image'
import statusIcon1 from '/public/internal/status_arrow.svg'
import statusIcon2 from '/public/internal/status_arrow2.svg'
import tickIcon from "/public/internal/circle_tick.svg";

const StatusBar = () => {

    return (
        <div className={styles.statusContainer}>
            <div className={styles.statusCard}>
                <Image src={statusIcon1} className={styles.statusCard_img} alt='page' />
                <div className={styles.statusText} >
                    <Image width={14} height={14} src={tickIcon} alt="downarrow" />
                    Shortlisted </div>
            </div>
            <div className={styles.statusCard}>
                <Image src={statusIcon2} className={styles.statusCard_img} alt='page' />
                <div className={styles.statusText} >In Progress</div>
            </div>
            <div className={styles.statusCard}>
                <Image src={statusIcon2} className={styles.statusCard_img} alt='page' />
                <div className={styles.statusText} >Finalised</div>
            </div>
            <div className={styles.statusCard}>
                <Image src={statusIcon2} className={styles.statusCard_img} alt='page' />
                <div className={styles.statusText} >Cancelled</div>
            </div>
        </div>
    )
}

export default StatusBar