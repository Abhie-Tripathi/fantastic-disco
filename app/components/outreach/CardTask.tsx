import React from 'react'
import styles from './cardtask.style.module.css'
import CalendarIcon from '/public/calendar.svg'
import Image from 'next/image';
import addEventIcon from '/public/addEvent.svg'
import { useTheme } from '@/context';

interface CardTaskProps {
    name: string;
    draggable: boolean;
    onDragStart: (event: React.DragEvent<HTMLDivElement>, taskName: string) => void;
    handleModal: () => void
    onClick:() => void
}

const CardTask: React.FC<CardTaskProps> = ({ name, draggable, onDragStart, handleModal,onClick }) => {
    const {theme} = useTheme();
    const iconClass = theme === 'light' ? 'icons_light' : 'icon'
    return (
        <>
        <div className={styles.eventAdd_container}>
            <div className={styles.addMore_event} onClick={onClick}>
                <Image src={addEventIcon} alt="add" className={styles.addIcon} width={18} height={18} />
                <div className={styles.line}> <hr  className={styles.hr}/> </div>
            </div>
        </div>
        <div className={styles.card} draggable={draggable} onDragStart={(event) => onDragStart(event, name)} onClick={handleModal}>
            <div className={styles.heading}>{name}</div>
            <div className={styles.comapnyName}>10Times</div>
            <div className={styles.date}>
                <Image src={CalendarIcon} alt='cal' height={15} width={15} className={iconClass} />
                <div>1st Apr 2024 - 31st Apr 2024</div>
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