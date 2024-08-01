'use client'
import React, { useState } from 'react'
import styles from './brandkit.style.module.css'
import YourKit from './yourkit/YourKit';
import Customize from './customize/Customize';

interface EditProps{
    setCardRadius: (value: number) => void,
    setCardBgColor: (value: string) => void,
    setEventNameColor: (value: string) => void,
    setEventNameSize: (value: number) => void,
    setDateFontSize: (value: number) => void,
    setLocationFontSize: (value: number) => void,
    setBtnBgColor: (value: string) => void,
    setBtnFontColor: (value: string) => void,
    setBtnBorderWidth: (value: number) => void,
    setBtnBorderColor: (value: string) => void,
    setBtnRadius: (value: number) => void,
    setBtnFontSize: (value: number) => void,
    setBgColor: (value: string) => void,
}


const BrandKit = (props : EditProps) => {

    const [activeNavItem, setActiveNavItem] = useState<string>("YourKit");

    const handleNavItemClick = (item: string) => {
        setActiveNavItem(item);
    };

    return (
        <div className={styles.body}>
            <div className={styles.nav}>
                <div className={`${styles.navItem} ${activeNavItem === "YourKit" ? styles.activeNavItem : ""}`} onClick={() => handleNavItemClick("YourKit")}>Your Kit</div>
                <div className={`${styles.navItem} ${activeNavItem === "Customize" ? styles.activeNavItem : ""}`} onClick={() => handleNavItemClick("Customize")}>Customize</div>
                <div className={`${styles.navItem} ${activeNavItem === "Themes" ? styles.activeNavItem : ""}`} onClick={() => handleNavItemClick("Themes")}>Themes</div>
            </div>
            <div className={styles.activeWindow}>
                {activeNavItem === "YourKit" && <YourKit />}
                {activeNavItem === "Customize" && <Customize
                    setDateFontSize={props.setDateFontSize}
                    setLocationFontSize={props.setLocationFontSize}
                    setCardRadius={props.setCardRadius}
                    setCardBgColor={props.setCardBgColor}
                    setEventNameColor={props.setEventNameColor}
                    setEventNameSize={props.setEventNameSize}
                    setBtnBgColor={props.setBtnBgColor}
                    setBtnFontColor={props.setBtnFontColor}
                    setBtnBorderWidth={props.setBtnBorderWidth}
                    setBtnBorderColor={props.setBtnBorderColor}
                    setBtnRadius={props.setBtnRadius}
                    setBtnFontSize={props.setBtnFontSize}
                    setBgColor={props.setBgColor} />}
            </div>
        </div>
    )
}

export default BrandKit