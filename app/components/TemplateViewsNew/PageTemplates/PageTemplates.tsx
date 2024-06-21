import React, { useState } from 'react'
import styles from './pagetemplates.style.module.css'

const PageTemplates = () => {

    const [activeBtn, setActiveBtn] = useState<string>("Highlighted")
    return (
        <div className={styles.body}>
            <div className={styles.btnContainer}>
                <button className={`${styles.btn} ${activeBtn === "Highlighted" ? styles.activeBtn :""}`} onClick={()=>setActiveBtn("Highlighted")}>Hihglighetd Event Styles</button>
                <button className={`${styles.btn} ${activeBtn === "NonHighlighted" ? styles.activeBtn :""}`} onClick={()=>setActiveBtn("NonHighlighted")}>Non-Hihglighetd Event Styles</button>
            </div>
        </div>
    )
}

export default PageTemplates