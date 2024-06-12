import React, { useState } from 'react'
import styles from './widgetcard.style.module.css'
import Calendar from '/public/vector.svg'
import Image from 'next/image'
import Spinner from '/public/Icon.svg'
import Delete from '/public/delete.svg'
import RightArrow from '/public/rightArrow.svg'
import Link from 'next/link'

interface WidgetProps{
    status : string;
    statusIcon : string;
}

const WidgetCard = ({status, statusIcon} : WidgetProps) => {

    return (
        <div className={styles.body}>
            <div className={styles.headerSection}>
                <div className={styles.name_statusContainer}>
                    <div className={styles.iconCircle}>
                        <Image src={Spinner} alt='spinner' />
                    </div>
                    <div className={styles.widgetName}>Page Widget</div>
                    <div className={styles.widgetHeading}>(Your Widget Name)</div>
                    <div className={styles.statusBtn}>
                        <div className={`${statusIcon === "green" ? styles.activeFlag : statusIcon==="red" ? styles.inactiveFlag : styles.inprogressFlag} ${styles.statusFlag}`}></div>
                        <div className={`${statusIcon === "green" ? styles.activeStatus : statusIcon==="red" ? styles.inactiveStatus : styles.inprogressStatus} ${styles.status}`}>{status}</div>
                    </div>
                </div>
                <Image src={Delete} alt='delete' className={styles.delete} />
            </div>
            <div className={styles.footerSection}>
                <div className={styles.dateContainer}>
                    <div style={{ display: "flex" }}><Image src={Calendar} alt="calendar" /></div>
                    <div className={styles.date}>1st Apr 2024</div>
                    <div>-</div>
                    <div className={styles.date}>30th Apr 2024</div>
                </div>
                <Link href={"/templates/edit/5sra857xa7s"} className={styles.viewDetailsContainer}>
                    <div className={styles.viewDetailsHeading}>Edit</div>
                    <Image src={RightArrow} alt='->' className={styles.viewDetailsIcon} />
                </Link>

            </div>
        </div>
    )
}

export default WidgetCard