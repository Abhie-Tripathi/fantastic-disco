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

const Popup = () => {
    return (
        <div className={styles.popup}>
            <Image className={styles.poster} src={Placeholder} alt="" />
            <div className={styles.eventname}>Theatre Festival</div>
            <div className={styles.description}>The Delhi Theatre scene is waiting in the wings for a renaissance, and we have taken the onus to make it happen.</div>
            <button className={styles.registerbtn} type="button">Register</button>
            <button className={styles.closebtn}>Close</button>
        </div>
    )
}

export default Popup
