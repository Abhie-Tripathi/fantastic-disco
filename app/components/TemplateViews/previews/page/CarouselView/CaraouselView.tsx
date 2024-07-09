import React, { useState, useEffect, useRef, ElementType } from 'react';
import styles from './caraouselview.style.module.css';
import EventCard1 from '../../cardstyles/EventCard1';
import EventCard2 from '../../cardstyles/EventCard2';
import EventCard3 from '../../cardstyles/EventCard3';

interface Props {
    selectedCard?: string;
    isFullScreen: boolean;
}

const CarouselView = ({ selectedCard, isFullScreen }: Props) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [bannersPerPage, setBannersPerPage] = useState(1);
    const carouselRef = useRef<HTMLDivElement>(null);

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

    const banners = [
        <EventCard key="1" />,
        <EventCard key="2" />,
        <EventCard key="3" />,
        <EventCard key="4" />,
        <EventCard key="5" />,
        <EventCard key="6" />,
        <EventCard key="7" />,
    ]; // Array of HeroBanners

    useEffect(() => {
        const handleResize = () => {
            if (carouselRef.current) {
                const containerWidth = carouselRef.current.offsetWidth;
                const cardWidth = 300; // Adjust based on your card's width
                const newBannersPerPage = Math.floor(containerWidth / cardWidth);
                setBannersPerPage(newBannersPerPage > 0 ? newBannersPerPage : 1);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isFullScreen]);

    const maxIndex = Math.max(0, banners.length - bannersPerPage);

    const handleNext = () => {
        if (currentIndex < maxIndex) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div className={styles.carousel} ref={carouselRef}>
            <button className={styles.navButton} onClick={handlePrev} disabled={currentIndex === 0}>
            <LeftArrowIcon/>   
            </button>
            <div className={styles.innerSlider} style={{ transform: `translateX(-${currentIndex * (100 / bannersPerPage)}%)` }}>
                {banners.map((banner, index) => (
                    <div className={styles.banner} key={index}>
                        {banner}
                    </div>
                ))}
            </div>
            <button
                className={styles.navButton}
                onClick={handleNext}
                disabled={currentIndex === maxIndex}
            >
                <RightArrowIcon/>
            </button>
        </div>
    );
};

function LeftArrowIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="black"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" /></svg>
    )
}

function RightArrowIcon(){
    return(
        <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="black"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/></svg>
    )
}

export default CarouselView;
