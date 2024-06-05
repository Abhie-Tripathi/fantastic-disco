import React from 'react'
import styles from './popup.style.module.css'
import Image from 'next/image'
import Placeholder from '/public/placeholder.png'

interface EditProps {
    cardRadius?: number;
    cardBgColor?: string;
    eventNameColor?: string;
    eventNameSize?: number;
    btnBgColor?: string;
    btnFontColor?: string;
    btnBorderWidth?: number;
    btnBorderColor?: string;
    btnRadius?: number;
    btnFontSize?: number;
}

const Popup = ({ 
    cardRadius = 10,
    cardBgColor = '#1a1a1a',
    eventNameColor = '#ffffff',
    eventNameSize = 30,
    btnBgColor = '#6750a4',
    btnFontColor = '#fff',
    btnBorderWidth = 1,
    btnBorderColor = '#black',
    btnRadius = 5,
    btnFontSize = 14}: EditProps) => {
        return (
            <div className={styles.popup} style={{ backgroundColor: cardBgColor, borderRadius: `${cardRadius}px` }}>
                <Image className={styles.poster} src={Placeholder} alt="Event Poster" style={{borderTopLeftRadius:`${cardRadius}px`, borderTopRightRadius:`${cardRadius}px` }}/>
                <div className={styles.eventname} style={{ color: eventNameColor, fontSize: `${eventNameSize}px` }}>
                    Theatre Festival
                </div>
                <div className={styles.description}>
                    The Delhi Theatre scene is waiting in the wings for a renaissance, and we have taken the onus to make it happen.
                </div>
                <button 
                    className={styles.registerbtn} 
                    type="button" 
                    style={{ 
                        backgroundColor: btnBgColor, 
                        color: btnFontColor, 
                        borderWidth: `${btnBorderWidth}px`, 
                        borderColor: btnBorderColor, 
                        borderRadius: `${btnRadius}px`, 
                        fontSize: `${btnFontSize}px` 
                    }}
                >
                    Register
                </button>
                <button className={styles.closebtn} style={{ color: btnFontColor }}>
                    Close
                </button>
            </div>
        )
}

export default Popup
