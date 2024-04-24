'use client'
import React, { useState } from 'react'
import styles from './eventdesc.style.module.css'
import Image from 'next/image'
import PeopleIcon from '/public/people.svg'
import ClockIcon from '/public/clock.svg'
import LocationIcon from '/public/location.svg'
import Placehodler from '/public/placeholder.png'

interface Props{
    open : boolean
}

const Organiser = ({open} : Props) => {
    const [accordianToggle, setAccordianToggle] = useState(open)
    return (
        <div className={styles.container}>
            <div className={styles.header} onClick={() => setAccordianToggle(!accordianToggle)}>
                <Image src={PeopleIcon} alt='page' />
                <div>Organiser Details</div>
            </div>
            {accordianToggle && <div className={styles.accordian}>
                <div className={styles.organiserContainer}>
                    <Image src={Placehodler} alt='placeholder' className={styles.orgLogo} />
                    <div className={styles.organiserNameContainer}>
                        <div style={{ fontSize: 14 }}>GooCampus</div>
                        <div style={{ fontSize: 12, color: "#999999" }}>Supercharge your online meetings</div>
                    </div>
                </div>
                <div className={styles.locationContainer}>
                    <Image src={LocationIcon} alt='location' />
                    <div className={styles.location}>Bengaluru, Karnataka</div>
                </div>
                <div className={styles.eventStats}>
                    <div className={styles.upcomingEvent}>
                        <Image src={ClockIcon} alt='clock' height={17} width={17} />
                        <div>Upcoming Events : 00</div>
                    </div>
                    <div className={styles.eventsHosted}>
                        <Image src={ClockIcon} alt='clock' height={17} width={17}/>
                        <div>Events Hosted : 12</div>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default Organiser