'use client'
import React, { useState } from 'react'
import styles from './eventdesc.style.module.css'
import Image from 'next/image'
import PageIcon from '/public/page.svg'
import CalendarIcon from '/public/calendar.svg'
import LocationIcon from '/public/location.svg'
import { useTheme } from '@/context'

interface DetailsProps {
    description: string;
    open : boolean;
}

const EventDescription = ({ description,open }: DetailsProps) => {
    const [accordianToggle, setAccordianToggle] = useState(open)
    const {theme} = useTheme()
    const iconClass = theme === 'light' ? 'icons_light' : 'icon'
    return (
        <div className={`${styles.container} ${theme === 'light' ? styles.container_light : ""}`}>
            <div className={styles.header} onClick={()=>setAccordianToggle(!accordianToggle)}>
                <Image src={PageIcon} alt='page' className={iconClass} />
                <div>Event Details</div>
            </div>
            {accordianToggle && <div className={styles.accordian}>
                    <div className={`${styles.dateContainer} ${theme === 'light' ? styles.dateContainer_light : ""}`}>
                        <Image src={CalendarIcon} alt='date' className={iconClass} />
                        <div className={styles.date}>1st Apr 2024 - 30th Apr 2024</div>
                    </div>
                <div className={`${styles.locationContainer} ${theme === 'light' ? styles.locationContainer_light : ""}`}>
                    <Image src={LocationIcon} alt='location' className={iconClass} />
                    <div className={styles.location}>Bengaluru, Karnataka</div>
                </div>
                <div className={`${styles.descContainer} ${theme === 'light' ? styles.descContainer_light : ""}`}>
                    <div className={styles.descHeading}>Description</div>
                    <div className={styles.description}>{description}</div>
                </div>
            </div>}
        </div>
    )
}

export default EventDescription