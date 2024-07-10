'use client'
import React, { useState } from 'react'
import styles from './moreevent.style.module.css'
import EventCard from '../TemplateViews/previews/cardstyles/EventCard1'

const MoreEvents = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const items = [
        <EventCard key="1" />,
        <EventCard key="2" />,
        <EventCard key="3" />,
        <EventCard key="4" />,
        <EventCard key="5" />,
        <EventCard key="6" />,
    ];

    const itemsToShow = 3;
    const totalItems = items.length;

    const handleNext = () => {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + itemsToShow, totalItems - itemsToShow));
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - itemsToShow, 0));
    };

    return (
        <div className={styles.body}>
            <div className={styles.header}>
                <button className={styles.carouselButton} onClick={handlePrev} disabled={currentIndex === 0}>
                    Prev
                </button>
                <div className={styles.heading}>More Events</div>
                <button className={styles.carouselButton} onClick={handleNext} disabled={currentIndex >= totalItems - itemsToShow}>
                    Next
                </button>
            </div>
            <div className={styles.carousel}>

                <div className={styles.carouselTrack} style={{ transform: `translateX(-${(currentIndex / totalItems) * 100}%)` }}>
                    {items.map((item) => (
                        <div className={styles.carouselItem} key={item.key}>
                            {item}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default MoreEvents