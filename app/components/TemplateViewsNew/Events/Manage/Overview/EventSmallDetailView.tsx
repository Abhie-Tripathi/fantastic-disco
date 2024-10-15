import React, { useEffect, useRef } from 'react'
import styles from './eventsmall.style.module.css'
// import DateTimeContainer from '@/app/components/DetailPage/DateTimeContainer'
import LocationContainer from '@/app/components/DetailPage/LocationContainer'
import Image from 'next/image'
import Placeholder from '/public/placeholder.png'
import ParticipationContainer from './ParticipationContainer'
import DateTimeContainer from './DateTimeContainer'
import confetti from "canvas-confetti";
import LeafTwo from '/public/widgetimages/leaf2.png'

interface Props {
    eventId: string
    imageUrl?: string;
    eventName?: string;
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    hashtags?: string;
    timeZone?: string;
    pageBgColor?: string;
    pageGradient?: string;
    confettiType?: string;
    leavesTheme?: boolean;
    eventFont?: string;
    locationCity?: string;
    locationCountry?: string;
    participationType?: string;
}

const EventSmallDetailView = ({ leavesTheme, eventId, imageUrl, eventName, startDate, endDate, startTime, endTime, hashtags, timeZone, pageBgColor, pageGradient, confettiType, eventFont, locationCountry, locationCity, participationType }: Props) => {

    const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const fireConfetti = () => {
        if (confettiCanvasRef.current) {
            const myConfetti = confetti.create(confettiCanvasRef.current, { resize: true });
            myConfetti({
                particleCount: 300,
                spread: 100,
                origin: { y: 0.9 },
                shapes: confettiType === "circle" ? ['circle'] : confettiType === "party" ? ['circle', 'square', 'star'] : ['star'],
            });
        }
    };
    useEffect(() => {
        if (confettiType && confettiType.length > 0) {
            // Fire confetti immediately
            fireConfetti();
            // Set up the interval for firing every 4 seconds
            const interval = setInterval(fireConfetti, 4000);
            // Cleanup interval when confettiType changes or component unmounts
            return () => clearInterval(interval);
        }
    }, [confettiType]);
    return (
        <div className={styles.outerbody}>
            <div className={`${styles.body} ${pageGradient ? styles[pageGradient] : ""}`} style={{ backgroundColor: pageBgColor }}>
                <canvas ref={confettiCanvasRef} className={styles.confettiCanvas}></canvas>
                {leavesTheme && <div className={styles.leafContainer}>
                    {Array.from({ length: 80 }).map((_, index) => (
                        <Image
                            key={index}
                            // src={index % 2 === 0 ? LeafOne : LeafTwo}
                            src={LeafTwo}
                            className={styles.leaf}
                            alt={`Leaf ${index + 1}`}
                            style={{
                                left: `${Math.random() * 100}%`, // Random horizontal position
                                top: `${Math.random() * 100}%`,  // Random vertical position
                                animationDelay: `${Math.random() * 5}s`, // Random animation delay
                                animationDuration: `${5 + Math.random() * 10}s`, // Random duration for float
                                width: `${25 + Math.random() * 5}px`, // Random leaf width between 15px to 20px
                                height: `${25 + Math.random() * 5}px`,
                            }}
                        />
                    ))}
                </div>}
                <div className={styles.leftSection}>
                    <div className={styles.posterContainer}>
                        <Image className={styles.poster} src={imageUrl || Placeholder} alt='Poster'
                            width={146} height={160}
                            style={{ borderRadius: 20, objectFit: "cover" }} />
                    </div>
                    <ParticipationContainer participationType={participationType} />
                </div>
                <div className={styles.rightSection}>
                    <textarea className={styles.eventName} disabled placeholder='Event Name' value={eventName} style={{ fontFamily: eventFont }} />
                    <div className={styles.dateTimeContainer}>
                        <DateTimeContainer endDate={endDate || ""} startDate={startDate || ""} endTime={endTime || ""} startTime={startTime || ""} timeZone={timeZone || ""} />
                    </div>

                    <div className={styles.locationContainer}><LocationContainer eventFormat="In-Person" cityName={locationCity || ""} countryName={locationCountry || ""} /></div>
                </div>
            </div>
        </div>
    )
}

export default EventSmallDetailView