import React from 'react'
import styles from './gridview.style.module.css'
import EventCard from '../../EventCard'


interface Props {
    setPreview: (id: string) => void;
}

const GridView = ({ setPreview }: Props) => {
    return (
        <div className={styles.body}>
            <div className={styles.heading_btnContainer}>
                <div className={styles.heading}>Grid View</div>
                <div className={styles.closeBtn} onClick={() => setPreview("")}>x</div>
            </div>
            <div className={styles.gridView}>
                <EventCard />
                <EventCard />
                <EventCard />
                <EventCard />
                <EventCard />
            </div>
        </div>
    )
}

export default GridView