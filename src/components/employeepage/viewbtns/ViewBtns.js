import React, { useState } from 'react'
import styles from './viewbtns.style.module.css'

const ViewBtns = (props) => {
    const [selectedView, setSelectedView] = useState('list');

    const handleButtonClick = (view) => {
        setSelectedView(view)
        props.handleSelectedData(view)
    };


    return (
        <div className={styles.btns}>
            <button onClick={() => handleButtonClick("list")} className={`${styles.listBtn} ${selectedView === 'list' ? styles.activeBtn : ''}`}
            >List</button>
            <button onClick={() => handleButtonClick("map")} className={`${styles.mapBtn} ${selectedView === 'map' ? styles.activeBtn : ''}`}>
                Map</button>
            <button onClick={() => handleButtonClick("calendar")} className={`${styles.calendarBtn} ${selectedView === 'calendar' ? styles.activeBtn : ''}`}>
                Calendar</button>
        </div>
    )
}

export default ViewBtns