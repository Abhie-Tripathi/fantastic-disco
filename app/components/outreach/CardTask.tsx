import React from 'react'
import styles from './cardtask.style.module.css'
import CalendarIcon from '/public/calendar.svg'
import Image from 'next/image';
import addEventIcon from '/public/addEvent.svg'
import { useTheme } from '@/context';
import { formatEventDates } from '@/utils/dateFormat';
import { Calendar } from 'geist-icons';

interface CardTaskProps {
    task: any;
    name: string;
    draggable: boolean;
    eventLocation: string;
    eventCompany: string;
    eventStartDate: string;
    eventEndDate: string;
    eventId: string;
    enquiryId: string;
    enquiryStatus: string;
    onDragStart: (event: React.DragEvent<HTMLDivElement>, taskName: string) => void;
    handleModal: (id: string, enquiryId: string, enquiryStatus: string, task: any) => void;
    onClick: () => void;
    interests?: {
        EXHIBITOR: number;
        SPONSOR: number;
        SPEAKER: number;
        ATTENDING: number;
    };
}


const CardTask: React.FC<CardTaskProps> = ({ name, draggable, eventLocation , eventCompany, eventStartDate, eventEndDate, eventId, enquiryId, enquiryStatus, onDragStart, handleModal,onClick, interests, task }) => {
    const {theme} = useTheme();
    const iconClass = theme === 'light' ? 'icons_light' : 'icon';
    // const startDate = formatDate(eventStartDate);
    // const endDate = formatDate(eventEndDate);
    return (
        <>
        {/* <div className={styles.eventAdd_container}>
            <div className={styles.addMore_event} onClick={onClick}>
        <div className={styles.eventAdd_container}>
            <div className={styles.addMore_event} >
                <Image src={addEventIcon} alt="add" className={styles.addIcon} width={18} height={18} />
                <div className={styles.line}> <hr  className={styles.hr}/> </div>
            </div>
    </div> */}
        <div className={`${styles.card} card`} draggable={draggable} onDragStart={(event) => onDragStart(event, name)} onClick={()=>handleModal(eventId, enquiryId, enquiryStatus, task)} style={{gap:"4px"}}>
            <div className={styles.heading}>{name}</div>
            <div className={styles.companyName}>{eventCompany}</div>
            <div className={styles.date}>
            <Calendar height={'12px'} width={'12px'} color="var(--primary-text-color)"/>
                <div style={{marginTop:'3px'}}>{formatEventDates(eventStartDate,eventEndDate)}</div>
            </div>
            <div className={styles.typeOfEventContainer}>
    {interests && interests.EXHIBITOR > 0 && <div className={styles.typeOfEvent}>Exhibit</div>}
    {interests && interests.SPONSOR > 0 && <div className={styles.typeOfEvent}>Sponsor</div>}
    {interests && interests.SPEAKER > 0 && <div className={styles.typeOfEvent}>Speak</div>}
    {interests  && interests.ATTENDING > 0 && <div className={styles.typeOfEvent}>Attend</div>}
</div>

        </div>
        </>
    )
}

export default CardTask