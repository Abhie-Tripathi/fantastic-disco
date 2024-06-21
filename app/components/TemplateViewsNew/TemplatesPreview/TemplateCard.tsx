import React from 'react'
import styles from './templatecard.style.module.css'
import { StaticImageData } from 'next/image';
import Image from 'next/image';

interface TemplateProps{
    widgetStyle : string;
    tag : string;
    desc : string;
    image: StaticImageData; 
}

const TemplateCard = ({widgetStyle, tag, desc, image } : TemplateProps) => {
    return (
        <div className={styles.body}>
            <div className={styles.imageContainer}>
                <Image src={image} alt='banner' className={styles.image}></Image>
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