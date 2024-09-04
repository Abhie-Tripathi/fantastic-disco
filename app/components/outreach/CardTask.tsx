import React from 'react'
import styles from './cardtask.style.module.css'
import CalendarIcon from '/public/calendar.svg'
import Image from 'next/image';
import addEventIcon from '/public/addEvent.svg'
import { useTheme } from '@/context';
import { formatEventDates } from '@/utils/dateFormat';

interface CardTaskProps {
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
    handleModal: (id: string, enquiryId: string, enquiryStatus: string) => void
    onClick:() => void
}

const CardTask: React.FC<CardTaskProps> = ({ name, draggable, eventLocation , eventCompany, eventStartDate, eventEndDate, eventId, enquiryId, enquiryStatus, onDragStart, handleModal,onClick }) => {
    const {theme} = useTheme();
    const iconClass = theme === 'light' ? 'icons_light' : 'icon';
    // const startDate = formatDate(eventStartDate);
    // const endDate = formatDate(eventEndDate);
    return (
        <>
        <div className={styles.eventAdd_container}>
            <div className={styles.addMore_event} onClick={onClick}>
                <Image src={addEventIcon} alt="add" className={styles.addIcon} width={18} height={18} />
                <div className={styles.line}> <hr  className={styles.hr}/> </div>
            </div>
        </div>
        <div className={`${styles.card} card`} draggable={draggable} onDragStart={(event) => onDragStart(event, name)} onClick={()=>handleModal(eventId, enquiryId, enquiryStatus)} style={{gap:"var(--spacing-sm)"}}>
            <div className={styles.heading}>{name}</div>
            <div className={styles.comapnyName}>{eventCompany}</div>
            <div className={styles.date}>
                <Image src={CalendarIcon} alt='cal' height={15} width={15} className='icons'/>
                <div>{formatEventDates(eventStartDate,eventEndDate)}</div>
            </div>
            <div className={styles.typeOfEventContainer}>
                <div className={styles.typeOfEvent}>Exhibting</div>
                <div className={styles.typeOfEvent}>Attendee</div>
            </div>

        </div>
        </>
    )
}

export default CardTask