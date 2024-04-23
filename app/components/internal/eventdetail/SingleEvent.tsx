import Image from 'next/image';
import React from 'react'
import styles from './singleevent.style.module.css'
import WorkIcon from '/public/work.svg'

interface EventData {
    id: number;
    imageUrl: string;
    name: string;
    description: string;
}
const SingleEvent = (props: EventData) => {
    return (
        <div className={styles.container}>
            <Image src={props.imageUrl} alt='pic' width={200} height={180} className={styles.image} />
            <div className={styles.detailContainer}>
                <div className={styles.eventName}>{props.name}</div>
                <div className={styles.organiser}>
                    <Image src={WorkIcon} alt='work' />
                    <div>Campus</div>
                </div>
                <div className={styles.statusContainer}>
                    <div className={styles.statusHeading}>Status</div>
                    <div className={styles.statusValue}>Shortlisted</div>
                </div>
            </div>
        </div>
    )
}

export default SingleEvent