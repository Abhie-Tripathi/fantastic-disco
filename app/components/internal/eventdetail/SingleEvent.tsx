import Image from 'next/image';
import React from 'react'
import styles from './singleevent.style.module.css'
import WorkIcon from '/public/work.svg'
import { useTheme } from '@/context';
// import Link from 'next/link';

interface EventData {
    id: string;
    imageUrl: string;
    name: string;
    description: string;
    logoUrl?:string;
}
const SingleEvent = (props: EventData) => {
    const {theme} = useTheme();
    
    const iconClass = theme === 'light' ? 'icons_light' : 'icon'
    return (
        <div className={styles.container}>
            {props?.logoUrl && 
            <div className={styles.image_container}>
            <Image src={props?.logoUrl} alt='pic' className={styles.image} width={230} height={230}/>
            </div>
            }
            <div className={styles.detailContainer}>
                <div className={styles.eventName}>{props.name}</div>
                {/* <Link className={`${styles.eventName} hover:text-primary cursor-pointer`} href={`/internal/event/${props.id}`} target="_blank">{props.name}</Link> */}
                {/* <div className={styles.organiser}>
                    <Image src={WorkIcon} alt='work' className={iconClass} />
                    <div>Campus</div>
                </div> */}
            </div>
        </div>
    )
}

export default SingleEvent