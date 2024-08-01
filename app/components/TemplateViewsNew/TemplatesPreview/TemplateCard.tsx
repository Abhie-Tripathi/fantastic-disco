import React from 'react'
import styles from './templatecard.style.module.css'
import { StaticImageData } from 'next/image';
import Image from 'next/image';
import { useTheme } from "@/context";

interface TemplateProps{
    widgetStyle : string;
    tag : string;
    desc : string;
    image1: StaticImageData; 
    image2: StaticImageData; 
    setSelectedTemplate : (value : string) => void
    templateKey : string;
    selectedTemplate : string;
    setTempelateName : (value : string) => void
    setSelectedImage : (value : StaticImageData) => void
}

const TemplateCard = ({widgetStyle, tag, desc, image1, image2,setSelectedTemplate, templateKey, selectedTemplate, setTempelateName, setSelectedImage } : TemplateProps) => {
    const { theme } = useTheme();

    const handleClick = ()=>{
        setTempelateName(widgetStyle)
        setSelectedTemplate(templateKey)
        setSelectedImage(image1)
    }

    return (
        <div className={`${styles.body} ${selectedTemplate === templateKey ? styles.activeBody : ""}`} onClick={handleClick}>
            <div className={`${styles.imageContainer} ${theme === "dark" ? styles.darkImageContainer:""}`}>
                <Image src={theme === "dark" ? image2 : image1} alt='banner' className={styles.image}></Image>
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