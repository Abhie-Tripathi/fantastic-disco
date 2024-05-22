import Image from 'next/image';
import React from 'react'
import styles from './singleevent.style.module.css'
import WorkIcon from '/public/work.svg'
import { useTheme } from '@/context';

interface EventData {
    id: string;
    imageUrl: string;
    name: string;
    description: string;
}
const SingleEvent = (props: EventData) => {
    const {theme} = useTheme();
    const iconClass = theme === 'light' ? 'icons_light' : 'icon'
    return (
        <div className={styles.container}>
            <Image src={props.imageUrl} alt='pic' width={200} height={180} className={styles.image} />
            <div className={styles.detailContainer}>
                <div className={styles.eventName}>{props.name}</div>
                <div className={styles.organiser}>
                    <Image src={WorkIcon} alt='work' className={iconClass} />
                    <div>Campus</div>
                </div>
            </div>
        </div>
    )
}

export default SingleEvent