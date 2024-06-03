import React from 'react'
import styles from './scrollview.style.module.css'
import EventCard from '../EventCard';

interface Props{
    type : string;
}

const ScrollView = ({type}: Props) => {
    return (
        <div className={type === "top" ? styles.topBody : styles.leftBody}>
            <div className={type === "top" ? styles.horizontalScroll : styles.verticalScroll}>
                <EventCard />
                <EventCard />
                <EventCard />
                <EventCard />
                <EventCard />
                <EventCard />
            </div>
            <div className={styles.website}>Rest of the website</div>
        </div>
    )
}

export default ScrollView