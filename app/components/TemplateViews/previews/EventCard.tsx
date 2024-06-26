import React from 'react'
import styles from './eventcard.style.module.css'
import Image from 'next/image'
import placeholder from '/public/placeholder.png'

interface CardProps {
    cardRadius?: number;
    cardBgColor?: string;
    eventNameColor?: string;
    eventNameSize?: number;
    dateFontSize?: number;
    locationFontSize?: number;
    btnBgColor?: string;
    btnFontColor?: string;
    btnBorderWidth?: number;
    btnBorderColor?: string;
    btnRadius?: number;
    btnFontSize?: number;
}

const EventCard = ({
    cardRadius = 8, // default value
    cardBgColor = '#1a1a1a', // default value
    eventNameColor = '#ffffff', // default value
    eventNameSize = 24, // default value
    dateFontSize = 14, // default value
    locationFontSize = 14, // default value
    btnBgColor = '#007BFF', // default value
    btnFontColor = '#ffffff', // default value
    btnBorderWidth = 1, // default value
    btnBorderColor = '#007BFF', // default value
    btnRadius = 5, // default value
    btnFontSize = 16 // default value
}: CardProps) => {

    return (
        <div
            className={styles.card}
            style={{
                borderRadius: `${cardRadius}px`,
                backgroundColor: cardBgColor
            }}
        >
            <Image src={placeholder} alt="author" className={styles.banner} style={{borderTopLeftRadius : `${cardRadius}px`, borderTopRightRadius : `${cardRadius}px`}} />
            <div className={styles.content}>
                <div className={styles.tag}>Type</div>
                <div
                    className={styles.date}
                    style={{
                        fontSize: `${dateFontSize}px`
                    }}
                >
                    Date
                </div>
                <div
                    className={styles.eventName}
                    style={{
                        fontSize: `${eventNameSize}px`,
                        color: eventNameColor
                    }}
                >
                    Event Name
                </div>
                <div
                    className={styles.location}
                    style={{
                        fontSize: `${locationFontSize}px`
                    }}
                >
                    Location
                </div>
                <div
                    className={styles.btn}
                    style={{
                        backgroundColor: btnBgColor,
                        color: btnFontColor,
                        borderWidth: `${btnBorderWidth}px`,
                        borderColor: btnBorderColor,
                        borderRadius: `${btnRadius}px`,
                        fontSize: `${btnFontSize}px`,
                        borderStyle: 'solid',
                        textAlign: 'center',
                        cursor: 'pointer'
                    }}
                >
                    Register
                </div>
            </div>
        </div>
    )
}

export default EventCard