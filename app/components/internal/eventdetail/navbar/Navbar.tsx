'use client'
import React, { useState } from 'react'
import styles from './navbar.style.module.css'

const Navbar = () => {

    const [activeBtn, setActiveBtn] = useState("Notes")
    return (
        <div className={styles.container}>
            <button className={`${styles.btn} ${activeBtn === "Notes" ? styles.activeBtn : ""}`} onClick={() => (setActiveBtn("Notes"))}>Notes</button>
            <button className={`${styles.btn} ${activeBtn === "Followers" ? styles.activeBtn : ""}`} onClick={() => (setActiveBtn("Followers"))}>Followers</button>
            <div className={styles.owner}>
                <div className={styles.circle}>AJ</div>
                <div className={styles.userDetails}>
                    <div>Akash Jindal</div>
                    <div style={{ fontSize: "12px" }}>akash@10times.com</div>
                </div>
            </div>
        </div>
    )
}

export default Navbar