'use client'
import React, { useState } from 'react'
import styles from './navbar.style.module.css'

interface NavbarProps {
    setActiveChipY: React.Dispatch<React.SetStateAction<string>>;
    setActiveChipX: React.Dispatch<React.SetStateAction<string>>;
  }
  const Navbar: React.FC<NavbarProps> = (props) => {

    const [activeChipY, setActiveChipY] = useState("Predicted Attendance");
    const [activeChipX, setActiveChipX] = useState("Date");


    const handleChipClickY = (chipName : string) => {
        setActiveChipY(chipName);
        props.setActiveChipY(chipName)
    };

    const handleChipClickX = (chipName : string) => {
        setActiveChipX(chipName);
        props.setActiveChipX(chipName)
    };

    return (
        <div className={styles.navbar}>
            <div className={styles.yAxis}>
                <div className={styles.heading}>Data : </div>
                <div
                    className={`${styles.navbarChip} ${activeChipY === "Predicted Attendance" ? styles.activeChip : ""}`} onClick={() => handleChipClickY("Predicted Attendance")}>
                    Predicted Attendance
                </div>
                <div
                    className={`${styles.navbarChip} ${activeChipY === "Number of Events" ? styles.activeChip : ""
                        }`}
                    onClick={() => handleChipClickY("Number of Events")}
                >
                    Number of Events
                </div>
            </div>
            <div className={styles.xAxis}>
                <div className={styles.heading}>Category : </div>
                <div
                    className={`${styles.navbarChip} ${activeChipX === "Date" ? styles.activeChip : ""
                        }`}
                    onClick={() => handleChipClickX("Date")}
                >
                    Date
                </div>
                <div
                    className={`${styles.navbarChip} ${activeChipX === "Industry" ? styles.activeChip : ""
                        }`}
                    onClick={() => handleChipClickX("Industry")}
                >
                    Industry
                </div>
                <div
                    className={`${styles.navbarChip} ${activeChipX === "Location" ? styles.activeChip : ""
                        }`}
                    onClick={() => handleChipClickX("Location")}
                >
                    Location
                </div>
            </div>
        </div>
    )
}

export default Navbar