'use client';
import React, { useState } from 'react';
import styles from './page.style.module.css';
import Link from 'next/link';
import RightArrow from '/public/rightarrow.svg'
import Image from 'next/image';

interface Event {
    id: number;
    name: string;
    date: string;
    location: string;
}

const Page: React.FC = () => {
    const events = ([
        { id: 1, name: 'Event 1', date: '2024-06-01', location: 'Location 1' },
        { id: 2, name: 'Event 2', date: '2024-06-15', location: 'Location 2' },
        { id: 3, name: 'Event 3', date: '2024-07-01', location: 'Location 3' },]);

    const [btnClick, setBtnClick] = useState<boolean>(false);
    return (
        <div className={styles.body}>
            <div className={styles.websiteContainer}>
                <div className={styles.websiteContent}>Get Started</div>
                <div className={styles.websiteContentTwo}>Enter your Website</div>
                <input type="text" className={styles.websiteInput} placeholder="Enter Website URL" />
                <button type="button" className={styles.btn} onClick={()=>setBtnClick(true)}>Extract</button>
            </div>
            <div className={styles.rightContent}>
                <div className={styles.eventHeading}>Your Events</div>
                {btnClick && (
                    <div className={styles.events_btnContainer}>
                        <ul className={styles.eventList}>
                            {events.map(event => (
                                <li key={event.id} className={styles.eventItem}>
                                    <div className={styles.eventName}>{event.name}</div>
                                    <div className={styles.eventDate}>{event.date}</div>
                                    <div className={styles.eventLocation}>{event.location}</div>
                                </li>
                            ))}
                        </ul>
                        <Link href={"/templates"} className={styles.nextBtn}>
                            <div>Add Widget</div>
                            <Image src={RightArrow} alt='right'/>
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Page