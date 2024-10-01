import React from 'react'
import styles from './apperance.style.module.css'
import Image from 'next/image'
import ApperanceImage from '/public/appearance.png'
import ColorContainer from './ColorContainer'
import FontContainer from './FontContainer'
import BrandKit from '../../EditScreen/BrandKit/CustomizeComponents/BrandKit'
import { useTheme } from '@/context'
import ProgressBar from './ProgressBar'

interface Props {
    pageBgColor: string;
    setPageBgColor: (value: string) => void
    eventFont: string;
    setEventFont: (value: string) => void
    extractedColors: string[]
    setExtractedColors: (value: string[]) => void
    eventName: string;
    cityName: string;
    participationType: string;
    description: string;
}

const Appearance = ({ setPageBgColor, pageBgColor, eventFont, setEventFont, extractedColors, setExtractedColors,eventName, cityName, participationType, description }: Props) => {
    const { theme } = useTheme()
    return (
        <div className={styles.body} style={{ backgroundColor: theme === "dark" ? "#131313" : "#FAFAFA" }}>
            <div className={styles.appearanceHeader}>
                <Image src={ApperanceImage} alt='appearance' />
                <span>Set up your detail page</span>
            </div>
            <div className={styles.container}>
                <div className={styles.progressContainer}>
                    <ProgressBar cityName={cityName} description={description} eventName={eventName} participationType={participationType}/>
                </div>
                <div className={styles.line}></div>
                <BrandKit flex={false} extractedColors={extractedColors} pageBgColor={pageBgColor} setPageBgColor={setPageBgColor} setExtractedColors={setExtractedColors} setEventFont={setEventFont} eventFont={eventFont} />
                <div className={styles.line}></div>
                <div className={styles.colorContainer}>
                    <ColorContainer setPageBgColor={setPageBgColor} pageBgColor={pageBgColor} />
                </div>
                <div className={styles.line}></div>
                <div className={styles.fontContainer}>
                    <FontContainer setEventFont={setEventFont} eventFont={eventFont} />
                </div>
                <div className={styles.line}></div>
            </div>

        </div>
    )
}

export default Appearance

