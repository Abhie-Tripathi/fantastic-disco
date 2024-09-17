import React, { useState, useEffect, useRef, ElementType } from 'react';
import styles from './caraouselview.style.module.css';
import EventCard1 from '../../cardstyles/EventCard1';
import EventCard2 from '../../cardstyles/EventCard2';
import EventCard3 from '../../cardstyles/EventCard3';
import { PrefilledAddedEventsType } from '@/types/prefilledaddedeventtype'
import { useRouter } from 'next/navigation';

interface FontSettings {
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    fontWeight: string;
}

interface Props {
    isFullScreen: boolean;
    cardBorderRadius?: number;
    cardBgColor?: string;
    selectedCard?: string;
    fontSettings?: {
        heading: FontSettings;
        subheading: FontSettings;
        body: FontSettings;
    };
    fetchedAddedOtherData?: PrefilledAddedEventsType[];
    widgetId?: string;
}

const CarouselView = ({ selectedCard, isFullScreen, cardBgColor, cardBorderRadius, fontSettings, fetchedAddedOtherData, widgetId }: Props) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    let EventCard: ElementType;

    switch (selectedCard) {
        case 'style1':
            EventCard = EventCard1;
            break;
        case 'style2':
            EventCard = EventCard2;
            break;
        default:
            EventCard = EventCard3; // Or some default component or message
    }

    const demoBanners = [
        <EventCard key="1" cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} />,
        <EventCard key="2" cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} />,
        <EventCard key="3" cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} />,
        <EventCard key="4" cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} />,
        <EventCard key="5" cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} />,
        <EventCard key="6" cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} />,
        <EventCard key="7" cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} />,
    ];

    const banners = fetchedAddedOtherData && widgetId && fetchedAddedOtherData.length > 0
        ? fetchedAddedOtherData.map((event, index) => (
            <div onClick={() => handleCardClick(event.id, widgetId)} key={index} className={styles.listcard}>
                <EventCard
                    key={event.id}
                    cardBgColor={cardBgColor}
                    cardBorderRadius={cardBorderRadius}
                    fontSettings={fontSettings}
                    fetchedEvent={event}
                // Pass additional event-specific props here if needed
                />
            </div >
        ))
        : demoBanners;
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
    // const handleDotClick = (index: number) => {
    //     setCurrentIndex(index);
    // };
    const router = useRouter();
    const handleCardClick = (eventId: string, widgetId: string) => {
        router.push(`/detailpage?widgetId=${widgetId}&eventId=${eventId}`)
    }
    return (
        <div className={styles.sliderContainer}>
            <button className={styles.navButton} onClick={handlePrev} disabled={currentIndex === 0}>
                <LeftArrowIcon />
            </button>
            <div className={styles.cards}>
                {banners.map((banner, index) => {
                    const isActive = currentIndex === index;
                    const isLeft = currentIndex - 1 === index;
                    const isRight = currentIndex + 1 === index;
                    return (
                        <div
                            key={index}
                            className={`${styles.card} ${isActive ? styles.active : ''} ${isLeft ? styles.left : ''} ${isRight ? styles.right : ''}`}
                        >
                            {banner}
                        </div>
                    );
                })}
            </div>
            <button className={styles.navButton} onClick={handleNext} disabled={currentIndex === banners.length - 1}>
                <RightArrowIcon />
            </button>
            {/* <div className={styles.dotsContainer}>
                {[currentIndex - 1, currentIndex, currentIndex + 1].map((index, dotIdx) => (
                    <button
                        key={dotIdx}
                        className={`${styles.dotButton} ${dotIdx === 1 ? styles.activeDot : styles.fadedDot}`}
                        onClick={() => handleDotClick(index)}
                        disabled={index < 0 || index >= banners.length} // Disable dots if out of bounds
                    />
                ))}
            </div> */}
        </div>
    );
};

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

export default CarouselView;
