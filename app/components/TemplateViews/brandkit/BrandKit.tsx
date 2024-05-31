'use client'
import React, { useState } from 'react'
import styles from './brandkit.style.module.css'
import YourKit from './yourkit/YourKit';

const BrandKit = () => {
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
                {activeNavItem === "YourKit" && <YourKit/>}
            </div>
        </div>
    )
}

export default BrandKit