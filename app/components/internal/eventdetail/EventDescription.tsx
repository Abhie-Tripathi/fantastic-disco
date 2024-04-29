'use client'
import React, { useState } from 'react'
import styles from './eventdesc.style.module.css'
import Image from 'next/image'
import PageIcon from '/public/page.svg'
import CalendarIcon from '/public/calendar.svg'
import LocationIcon from '/public/location.svg'
import person2 from '@/public/person2.svg'
import person1 from '@/public/person1.svg'
import { useTheme } from '@/context'

interface DetailsProps {
    description: string;
    open : boolean;
}

const EventDescription = ({ description,open }: DetailsProps) => {
    const [accordianToggle, setAccordianToggle] = useState(open)
    const {theme} = useTheme()
    return (
        <div className={`${styles.container} ${theme === 'light' ? styles.container_light : ""}`}>
            <div className={styles.header} onClick={()=>setAccordianToggle(!accordianToggle)}>
                <Image src={PageIcon} alt='page' />
                <div>Event Details</div>
            </div>
            {accordianToggle && <div className={styles.accordian}>
                <div className={styles.statusDateContainer}>
                    <div className={`${styles.dateContainer} ${theme === 'light' ? styles.dateContainer_light : ""}`}>
                        <Image src={CalendarIcon} alt='date' />
                        <div className={styles.date}>1st Apr 2024 - 30th Apr 2024</div>
                    </div>
                    <div className={styles.statusContainer}>
                        <div className={styles.statusHeading}>Status</div>
                        <div className={styles.statusValue}>Shortlisted</div>
                    </div>
                </div>
                <div className={`${styles.locationContainer} ${theme === 'light' ? styles.locationContainer_light : ""}`}>
                    <Image src={LocationIcon} alt='location' />
                    <div className={styles.location}>Bengaluru, Karnataka</div>
                </div>
                <div className={`${styles.descContainer} ${theme === 'light' ? styles.descContainer_light : ""}`}>
                    <div className={styles.descHeading}>Description</div>
                    <div className={styles.description}>{description}</div>
                </div>
                <div className={styles.speakersContainer}>
                    <div className={styles.speakerHeading}>Speakers</div>
                    <div className={styles.circles}>
                        <div className={styles.circle} data-name="John Doe">
                            <Image className={styles.image} src={person1} alt="person1" />
                        </div>
                        <div className={styles.circle} style={{ marginLeft: "-15px", width: "45px", height: "45px" }} data-name="Ravi Tripathi">
                            RT
                        </div>
                        <div className={styles.circle} style={{ marginLeft: "-15px" }} data-name="Jane Smith">
                            <Image className={styles.image} src={person2} alt="person2" />
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default EventDescription