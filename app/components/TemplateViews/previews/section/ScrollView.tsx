import React from 'react'
import styles from './scrollview.style.module.css'
import EventCard from '../cardstyles/EventCard1';

interface Props{
    type : string;
}

const ScrollView = ({type}: Props) => {
    return (
        <div className={type === "top" ? styles.topBody : type === "left" ? styles.leftBody : ""}>
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