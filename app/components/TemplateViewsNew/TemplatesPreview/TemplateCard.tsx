import React from 'react'
import styles from './templatecard.style.module.css'
import { StaticImageData } from 'next/image';
import Image from 'next/image';
import { useTheme } from "@/context";

interface TemplateProps{
    widgetStyle : string;
    tag : string;
    desc : string;
    image: StaticImageData; 
    setSelectedTemplate : (value : string) => void
    templateKey : string;
}

const TemplateCard = ({widgetStyle, tag, desc, image,setSelectedTemplate, templateKey } : TemplateProps) => {
    const { theme } = useTheme();
    return (
        <div className={styles.body} onClick={()=>setSelectedTemplate(templateKey)}>
            <div className={styles.imageContainer}>
                <Image src={image} alt='banner' className={styles.image}></Image>
            </div>
            <div className={styles.headerContainer}>
                <div className={styles.header}>{widgetStyle}</div>
                <div className={styles.tag}>{tag}</div>
            </div>
            <div className={`${styles.subHeading} ${theme === "dark" ?styles.darkSubheading : ""}`}>
                {desc}
            </div>
        </div>
    )
}

export default TemplateCard