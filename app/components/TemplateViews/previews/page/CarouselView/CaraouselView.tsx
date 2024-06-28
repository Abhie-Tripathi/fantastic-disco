import React, { useState } from 'react'
import styles from './caraouselview.style.module.css'
import HeroBanner from '../MultipleEvents/HeroBanner'
import EventCard from '../../EventCard'



const CaraouselView = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const banners = [<HeroBanner key="1" />, <HeroBanner key="2" />, <HeroBanner key="3" />]; // Array of HeroBanners

    const handleNext = () => {
        if (currentIndex < banners.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };
    return (
        <div className={styles.carousel}>
            <button
                className={styles.navButton}
                onClick={handlePrev}
                disabled={currentIndex === 0}
            >
                &lt;
            </button>
            <div className={styles.innerSlider} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {banners.map((banner, index) => (
                    <div
                        className={`${styles.banner} ${index === currentIndex ? styles.active : styles.inactive}`}
                        key={index}
                    >
                        {banner}
                    </div>
                ))}
            </div>
            <button
                className={styles.navButton}
                onClick={handleNext}
                disabled={currentIndex === banners.length - 1}
            >
                &gt;
            </button>
        </div>
    );
}

export default CaraouselView