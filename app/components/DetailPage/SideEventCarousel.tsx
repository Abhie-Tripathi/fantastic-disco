import React, { useState } from 'react'
import styles from './sideeventcarousel.style.module.css'
import { EventsType } from '@/types/alleventtype'
import SideEventCard from './SideEventCard'
import { useRouter } from 'next/navigation'

interface Props {
    childrenData: EventsType[]
}

const SideEventCarousel = ({ childrenData }: Props) => {

    const router = useRouter()
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleCardClick = (id: string) => {
        router.push(`https://console.dev.eventgeni.com/detailpage/${id}`)
    }

    const banners = childrenData.map((event, index) => (
        <div onClick={() => handleCardClick(event.eventId)} key={index} className={styles.sideEventCard}>
            <SideEventCard event={event} />
        </div >
    ))
    const demoBanners = [
        <div className={styles.sideEventCard} key={1}><SideEventCard event={childrenData[0]} /></div>,
        <div className={styles.sideEventCard} key={2}><SideEventCard event={childrenData[0]} /></div>,
        <div className={styles.sideEventCard} key={3}><SideEventCard event={childrenData[0]} /></div>,

    ]
    const handleNext = () => {
        if (currentIndex < banners.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    };
    return (
        <div className={styles.sliderContainer}>
            <button className={styles.navButton} onClick={handlePrev} disabled={currentIndex === 0}>
                <LeftArrowIcon />
            </button>
            <div className={styles.cards}>
                {demoBanners.map((banner, index) => {
                    const isActive = currentIndex === index;
                    return (
                        <div
                            key={index}
                            className={`${styles.card} ${isActive ? styles.active : ''}`}
                            style={{ display: isActive ? 'block' : 'none' }} // Hide inactive cards
                        >
                            {banner}
                        </div>
                    );
                })}

            </div>
            <button className={styles.navButton} onClick={handleNext} disabled={currentIndex === banners.length - 1}>
                <RightArrowIcon />
            </button>
        </div>
    )
}

export default SideEventCarousel

function LeftArrowIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="black"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" /></svg>
    )
}

function RightArrowIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="black"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" /></svg>
    )
}
