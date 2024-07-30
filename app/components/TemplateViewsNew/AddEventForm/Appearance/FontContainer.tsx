import React from 'react'
import styles from './fonts.style.module.css'
import { useTheme } from '@/context';

interface Props {
    eventFont: string;
    setEventFont: (value: string) => void
}

const FontContainer = ({ eventFont, setEventFont }: Props) => {
    const fontsList = ["Arial", "Verdana", "Tahoma", "Trebuchet MS", "Times New Roman", "Georgia", "Garamond", "Courier New", "Brush Script"]

    const { theme } = useTheme()
    return (
        <div className={styles.body}>
            <div className={styles.header}>
                <FontIcon color={theme === "light" ? "black" : "white"} />
                <span>FONT</span>
            </div>
            <div className={styles.editContainer}>
                <div className={`${styles.bgContainer} ${theme == "light" ? styles.bgLightContainer : styles.bgDarkContainer}`}><FontIcon2 /> <span>Font Family</span></div>
                <div className={`${styles.fontContainer} ${theme === "dark" ?styles.darkFontContainer : styles.lightFontContainer}`}>
                    {fontsList.map((font, key) => (
                        <div key={key} onClick={() => setEventFont(font)} className={`${styles.font} ${font === eventFont ? styles.activeFont : ""}`}>{font === eventFont && <TickIcon />}{font}</div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FontContainer

interface IconProps {
    color: string;
}

function FontIcon({ color }: IconProps) {
    return (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 3H9V9H9.5V9.5H7.5V9H8V7.5H6L5.25 9H6V9.5H4V9H4.5L7.5 3ZM8 3.5L6.25 7H8V3.5ZM1.5 0.5H4C4.555 0.5 5 0.945 5 1.5V7H3.5V4.5H2V7H0.5V1.5C0.5 0.945 0.945 0.5 1.5 0.5ZM2 1.5V3.5H3.5V1.5H2Z" fill={color} />
        </svg>
    )
}

function FontIcon2() {
    return (
        <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.5 5.25H5V6.75H3.5V11.25H2V6.75H0.5V5.25ZM11 2.25H8.0498V11.25H6.4502V2.25H3.5V0.75H11V2.25Z" fill="#7D7D7D" />
        </svg>
    )
}

function TickIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" fill="#0072F5" /></svg>
    )
}