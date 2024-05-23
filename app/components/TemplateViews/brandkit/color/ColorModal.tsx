import React, { useState } from 'react'
import styles from './colormodal.style.module.css'
import PrimaryColorConfig from './PrimaryColorConfig'
import SecondaryColorConfig from './SecondaryColorConfig'

const ColorModal = () => {
    const [activeBtn, setActiveBtn] = useState("primary")
    return (
        <div className={styles.body}>
            <div className={styles.colorTypes}>
                <div className={styles.colorList}>Default Colors</div>
                <div className={`${styles.primaryBtn} ${activeBtn === "primary" ? styles.activeBtn : ""}`} onClick={() => setActiveBtn("primary")}>
                    <div className={styles.btnHeading}>Primary Color</div>
                </div>
                <div className={`${styles.secondaryBtn} ${activeBtn === "secondary" ? styles.activeBtn : ""}`} onClick={() => setActiveBtn("secondary")}>
                    <div className={styles.btnHeading}>Secondary Color</div>
                </div>
            </div>
            <div className={styles.configurations}>
                <div className={styles.configHeading}>Cofigurations</div>
                <div className={styles.colorConfigure}>
                    {activeBtn === "primary" ? <PrimaryColorConfig/> : <SecondaryColorConfig/>}
                </div>
            </div>
        </div>
    )
}

export default ColorModal