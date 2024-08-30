import React, { useState } from 'react'
import styles from './dashboardevents.style.module.css'
import EmptyImage from '/public/widgetimages/emptyimages/addedeventempty.svg'
import Image from 'next/image';

const DashboardEvents = () => {
    const [selectedBtn, setSelectedBtn] = useState<string>("Fetched")
    return (
        <div className={styles.body}>
            <div className={styles.btnContainer}>
                <button className={selectedBtn === "Fetched" ? styles.selectedBtn : styles.deselectedBtn} onClick={() => setSelectedBtn("Fetched")}>Fetched</button>
                <button className={selectedBtn === "Added" ? styles.selectedBtn : styles.deselectedBtn} onClick={() => setSelectedBtn("Added")}>Added</button>
            </div>
            <div className={styles.emptyScreen}>
                <Image src={EmptyImage} alt='empty' />
                <div>Search or Add your Events</div>
                <span>Start by searching for existing events to add to your widgets</span>
                <span>or feel free to create your own event from scratch</span>
            </div>
        </div>
    )
}

export default DashboardEvents