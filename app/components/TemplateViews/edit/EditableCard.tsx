import React from 'react'
import styles from './editablecard.style.module.css'
import Image from 'next/image'
import placeholder from '/public/placeholder.png'

interface EditProps {
    cardRadius: number;
    cardBgColor: string;
    eventNameColor: string;
    eventNameSize: number;
    typeBgColor: string;
    typeFontSize: number;
    dateLocationColor: string;
    btnBgColor: string;
    btnFontColor: string;
    btnBorderWidth: number;
    btnBorderColor: string;
    btnRadius: number;
}

const EditableCard: React.FC<EditProps> = ({
    cardRadius,
    cardBgColor,
    eventNameColor,
    eventNameSize,
    typeBgColor,
    typeFontSize,
    dateLocationColor,
    btnBgColor,
    btnFontColor,
    btnBorderWidth,
    btnBorderColor,
    btnRadius,
}) => {
    return (
        <div
            className={styles.card}
            style={{ borderRadius: `${cardRadius}px`, backgroundColor: cardBgColor }}
        >
            <Image src={placeholder} alt="author" className={styles.banner} style={{ borderTopLeftRadius: `${cardRadius}px`, borderTopRightRadius: `${cardRadius}px` }} />
            <div className={styles.content}>
                <div
                    className={styles.tag}
                    style={{ backgroundColor: typeBgColor, fontSize: `${typeFontSize}px` }}
                >
                    Type
                </div>
                <div className={styles.date} style={{ color: dateLocationColor }}>
                    Date
                </div>
                <div
                    className={styles.eventName}
                    style={{ color: eventNameColor, fontSize: `${eventNameSize}px` }}
                >
                    Event Name
                </div>
                <div className={styles.location} style={{ color: dateLocationColor }}>
                    Location
                </div>
                <div
                    className={styles.btn}
                    style={{
                        backgroundColor: btnBgColor,
                        color: btnFontColor,
                        borderStyle : "solid",
                        borderWidth: `${btnBorderWidth}px`,
                        borderColor: btnBorderColor,
                        borderRadius: `${btnRadius}px`,
                    }}
                >
                    Register
                </div>
            </div>
        </div>
    )
}

export default EditableCard