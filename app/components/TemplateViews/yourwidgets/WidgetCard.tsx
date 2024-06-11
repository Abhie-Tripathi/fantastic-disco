import React, { useState } from 'react'
import styles from './widgetcard.style.module.css'
import Calendar from '/public/vector.svg'
import Image from 'next/image'
import Spinner from '/public/Icon.svg'
import Delete from '/public/delete.svg'
import DownArrow from '/public/internal/arrow_drop_down.svg'

interface WidgetProps{
    status : string;
    statusIcon : string;
}

const WidgetCard = ({status, statusIcon} : WidgetProps) => {
    const [accordian, setAccordian] = useState(false)
    return (
        <div className={styles.body}>
            <div className={styles.headerSection}>
                <div className={styles.name_statusContainer}>
                    <div className={styles.iconCircle}>
                        <Image src={Spinner} alt='spinner' />
                    </div>
                    <div className={styles.widgetName}>Page Widget</div>
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
                <div className={styles.viewDetailsContainer} onClick={() => setAccordian(!accordian)}>
                    <div className={styles.viewDetailsHeading}>Edit</div>
                    <Image src={DownArrow} alt='down' className={styles.viewDetailsIcon} />
                </div>
            </div>
        </div>
    )
}

export default WidgetCard