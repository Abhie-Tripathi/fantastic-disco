'use client'
import React, { useState } from 'react'
import styles from './moreevent.style.module.css'
import EventCard from '../TemplateViews/previews/cardstyles/EventCard2'

const MoreEvents = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const items = [
        <EventCard key="1" cardBgColor='transparent' eventNameColor='white' locationColor='white' dateColor='white'/>,
        <EventCard key="2" cardBgColor='transparent' eventNameColor='white' locationColor='white' dateColor='white'/>,
        <EventCard key="3" cardBgColor='transparent' eventNameColor='white' locationColor='white' dateColor='white'/>,
        <EventCard key="4" cardBgColor='transparent' eventNameColor='white' locationColor='white' dateColor='white'/>,
        <EventCard key="5" cardBgColor='transparent' eventNameColor='white' locationColor='white' dateColor='white'/>,
        <EventCard key="6" cardBgColor='transparent' eventNameColor='white' locationColor='white' dateColor='white'/>,
    ];

    const itemsToShow = 2;
    const totalItems = items.length;

    const handleNext = () => {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + itemsToShow, totalItems - itemsToShow));
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - itemsToShow, 0));
    };

    return (
        <div className={styles.body}>
            <div className={styles.heading}>More Events</div>
            <div className={styles.carousel}>
                <button className={styles.navButton} onClick={handlePrev} disabled={currentIndex === 0}>
                    <LeftArrowIcon />
                </button>
                <div className={styles.carouselTrack} style={{ transform: `translateX(-${(currentIndex / totalItems) * 300}%)` }}>
                    {items.map((item) => (
                        <div className={styles.carouselItem} key={item.key}>
                            {item}
                        </div>
                    ))}
                </div>
                <button className={styles.navButton} onClick={handleNext} disabled={currentIndex >= totalItems - itemsToShow}>
                    <RightArrowIcon />
                </button>
            </div>
        </div>
    )
}
function LeftArrowIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="white"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" /></svg>
    )
}

function RightArrowIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="white"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" /></svg>
    )
}

export default MoreEvents