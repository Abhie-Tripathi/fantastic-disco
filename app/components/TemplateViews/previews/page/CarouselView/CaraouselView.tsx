import React, { ElementType, useState } from 'react'
import styles from './caraouselview.style.module.css';
import EventCard1 from '../../cardstyles/EventCard1';
import EventCard2 from '../../cardstyles/EventCard2';
import EventCard3 from '../../cardstyles/EventCard3';

interface Props{
    selectedCard : string;
}

const CaraouselView = ({selectedCard} : Props) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    let EventCard: ElementType;

    switch (selectedCard) {
        case 'card1':
            EventCard = EventCard1;
            break;
        case 'card2':
            EventCard = EventCard2;
            break;
        default:
            EventCard = EventCard3; // Or some default component or message
    }

    const banners = [<EventCard key="1" />, <EventCard key="2" />, <EventCard key="3" />,<EventCard key="4" />,<EventCard key="5" />,<EventCard key="6" />,<EventCard key="7" />]; // Array of HeroBanners

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
            <div className={styles.innerSlider} style={{ transform: `translateX(-${currentIndex * 30}%)` }}>
                {banners.map((banner, index) => (
                    <div
                        className={`${styles.banner}`}
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