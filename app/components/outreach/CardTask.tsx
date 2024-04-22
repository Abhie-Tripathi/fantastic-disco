import React from 'react'
import styles from './cardtask.style.module.css'
import CalendarIcon from '/public/calendar.svg'
import Image from 'next/image';

interface CardTaskProps {
    name: string;
    draggable: boolean;
    onDragStart: (event: React.DragEvent<HTMLDivElement>, taskName: string) => void;
}

const CardTask: React.FC<CardTaskProps> = ({ name, draggable, onDragStart }) => {
    return (
        <div className={styles.card} draggable={draggable} onDragStart={(event) => onDragStart(event, name)}>
            <div className={styles.heading}>{name}</div>
            <div className={styles.comapnyName}>10Times</div>
            <div className={styles.date}>
                <Image src={CalendarIcon} alt='cal' height={15} width={15}/>
                <div>1st Apr 2024 - 31st Apr 2024</div>
            </div>
            
        </div>
    )
}

export default CardTask