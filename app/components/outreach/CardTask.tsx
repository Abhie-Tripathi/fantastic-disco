import React from 'react'
import styles from './cardtask.style.module.css'

interface CardTaskProps {
    name: string;
    draggable: boolean;
    onDragStart: (event: React.DragEvent<HTMLDivElement>, taskName: string) => void;
}

const CardTask: React.FC<CardTaskProps> = ({ name, draggable, onDragStart }) => {
    return (
        <div
            className={styles.card}
            draggable={draggable}
            onDragStart={(event) => onDragStart(event, name)}
        >
            {name}
        </div>
    )
}

export default CardTask