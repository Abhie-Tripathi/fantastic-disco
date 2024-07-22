import React from 'react'
import styles from './apperance.style.module.css'
import Image from 'next/image'
import ApperanceImage from '/public/appearance.png'
import ColorContainer from './ColorContainer'
import FontContainer from './FontContainer'

const Appearance = () => {
    return (
        <div className={styles.body}>
            <div className={styles.appearanceHeader}>
                <Image src={ApperanceImage} alt='appearance' />
                <span>Appearance</span>
            </div>
            <div className={styles.line}></div>
            <div className={styles.colorContainer}>
                <ColorContainer/>
            </div>
            <div className={styles.line}></div>
            <div className={styles.fontContainer}>
                <FontContainer/>
            </div>
            <div className={styles.line}></div>
        </div>
    )
}

export default Appearance

