import React from 'react'
import styles from './apperance.style.module.css'
import Image from 'next/image'
import ApperanceImage from '/public/appearance.png'
import ColorContainer from './ColorContainer'
import FontContainer from './FontContainer'

interface Props{
    pageBgColor : string;
    setPageBgColor : (value : string)=>void
    eventFont : string;
    setEventFont : (value : string)=>void
}

const Appearance = ({setPageBgColor, pageBgColor,eventFont, setEventFont}: Props) => {
    return (
        <div className={styles.body}>
            <div className={styles.appearanceHeader}>
                <Image src={ApperanceImage} alt='appearance' />
                <span>Set up your detail page</span>
            </div>
            <div className={styles.line}></div>
            <div className={styles.colorContainer}>
                <ColorContainer setPageBgColor={setPageBgColor} pageBgColor={pageBgColor}/>
            </div>
            <div className={styles.line}></div>
            <div className={styles.fontContainer}>
                <FontContainer setEventFont={setEventFont} eventFont = {eventFont}/>
            </div>
            <div className={styles.line}></div>
        </div>
    )
}

export default Appearance

