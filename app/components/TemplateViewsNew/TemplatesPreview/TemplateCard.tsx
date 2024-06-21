import React from 'react'
import styles from './templatecard.style.module.css'

interface TemplateProps{
    widgetStyle : string;
    tag : string;
    desc : string;
}

const TemplateCard = ({widgetStyle, tag, desc} : TemplateProps) => {
    return (
        <div className={styles.body}>
            <div className={styles.imageContainer}>
                <div className={styles.image}></div>
            </div>
            <div className={styles.headerContainer}>
                <div className={styles.header}>{widgetStyle}</div>
                <div className={styles.tag}>{tag}</div>
            </div>
            <div className={styles.subHeading}>
                {desc}
            </div>
        </div>
    )
}

export default TemplateCard