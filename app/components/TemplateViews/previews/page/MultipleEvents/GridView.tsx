import React from 'react'
import styles from './gridview.style.module.css'
import EventCard from '../../../EventCard'

const GridView = () => {
    return (
            <div className={styles.gridView}>
                <EventCard />
                <EventCard />
                <EventCard />
                <EventCard />
                <EventCard />
            </div>
    )
}

export default GridView