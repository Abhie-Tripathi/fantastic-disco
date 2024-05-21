import React from 'react'
import styles from './eventlistcard.style.module.css'
import calendarIcon from "/public/calendar.svg";
import locationIcon from "/public/location.svg";
import placeholder from '/public/placeholder.png'
import Image from 'next/image';

const EventListCard = () => {
    return (
        <div className={styles.card}>
            <div className={styles.cardImg_container}>
                <Image
                    src={placeholder}
                    alt="eventImage"
                    width={238}
                    height={192}
                    className={styles.cardImg}
                />
            </div>
            <div className={styles.cardDetails}>
                <div className={styles.eventHeader}>
                    <div className={styles.eventName}>Event Name</div>
                    <div className='desktop_view' >
                        {/* <div className={styles.pills}>
                            {eventCtas.map((item, index) => (
                                <div key={index} className={styles.pill}>
                                    {item}
                                </div>
                            ))}
                        </div> */}
                    </div>
                </div>
                <div className={styles.eventDesc}>
                    Event Description
                </div>
                <div className={styles.locationAndDateContainer}>
                    <div className={styles.eventLocation}>
                        <Image
                            src={locationIcon}
                            alt="locationIcon"
                            width={24}
                            height={24}
                        />
                        <div>Location</div>
                    </div>
                    <div className={styles.eventDate}>
                        <Image
                            src={calendarIcon}
                            alt="calendarIcon"
                            width={14}
                            height={14}
                        />
                        <div>Date</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventListCard