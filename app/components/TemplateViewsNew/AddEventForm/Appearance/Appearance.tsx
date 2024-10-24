import React from 'react'
import styles from './apperance.style.module.css'
import Image from 'next/image'
import ApperanceImage from '/public/appearance.png'
import ColorContainer from './ColorContainer'
import FontContainer from './FontContainer'
import BrandKit from '../../EditScreen/BrandKit/CustomizeComponents/BrandKit'
import { useTheme } from '@/context'
import ProgressBar from './ProgressBar'
import { EventsType } from '@/types/alleventtype'

interface Props {
    setUploadedPhoto : (value : File | undefined) => void
    setSnowTheme : (value : boolean) => void
    setLeavesTheme : (value : boolean) => void
    confettiType : string;
    setFormTheme : (value : string) => void
    pageBgColor: string;
    setPageBgColor: (value: string) => void
    setPageGradient : (value : string) => void
    setConfettiType : (value : string) => void
    eventFont: string;
    setEventFont: (value: string) => void
    extractedColors: string[]
    setExtractedColors: (value: string[]) => void
    eventNameMain: string;
    cityNameMain: string;
    participationTypeMain: string;
    descriptionMain: string;
    eventNameSub: string;
    cityNameSub: string;
    participationTypeSub: string;
    descriptionSub: string;
    prefilledEvent?: EventsType | null
}

const Appearance = ({setUploadedPhoto,setSnowTheme, setLeavesTheme, confettiType, setFormTheme, setPageBgColor, pageBgColor,setConfettiType, eventFont, setEventFont, extractedColors, setExtractedColors, eventNameMain, cityNameMain, participationTypeMain, descriptionMain ,prefilledEvent, eventNameSub, participationTypeSub, descriptionSub, cityNameSub, setPageGradient}: Props) => {
    const { theme } = useTheme()
    return (
        <div className={styles.body} style={{ backgroundColor: theme === "dark" ? "#131313" : "#FAFAFA" }}>
            <div className={styles.appearanceHeader}>
                <Image src={ApperanceImage} alt='appearance' />
                <span>Set up your detail page</span>
            </div>
            <div className={styles.container}>
                <div className={styles.progressContainer}>
                    <ProgressBar eventNameSub={eventNameSub} participationTypeSub={participationTypeSub} descriptionSub={descriptionSub} cityNameSub={cityNameSub} cityNameMain={cityNameMain} descriptionMain={descriptionMain} eventNameMain={eventNameMain} participationTypeMain={participationTypeMain} />
                </div>
                <div className={styles.line}></div>
                <BrandKit prefilledEvent={prefilledEvent} flex={false} extractedColors={extractedColors} pageBgColor={pageBgColor} setPageBgColor={setPageBgColor} setExtractedColors={setExtractedColors} setEventFont={setEventFont} eventFont={eventFont} />
                <div className={styles.line}></div>
                <div className={styles.colorContainer}>
                    <ColorContainer setUploadedPhoto={setUploadedPhoto} setSnowTheme={setSnowTheme} setLeavesTheme={setLeavesTheme} confettiType={confettiType} setFormTheme={setFormTheme} setConfettiType={setConfettiType} setPageGradient={setPageGradient} setPageBgColor={setPageBgColor} pageBgColor={pageBgColor} />
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

