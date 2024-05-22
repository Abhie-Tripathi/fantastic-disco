import React, { useState } from 'react'
import styles from './buttonsmodal.style.module.css'
import PrimaryButtonConfig from './PrimaryButtonConfig'
import SecondaryButtonConfig from './SecondaryButtonConfig'

const ButtonsModal = () => {
    const [activeBtn, setActiveBtn] = useState("primary")
    return (
        <div className={styles.body}>
            <div className={styles.btnTypes}>
                <div className={styles.btnList}>Default Buttons</div>
                <div className={`${styles.primaryBtn} ${activeBtn === "primary" ? styles.activeBtn : ""}`} onClick={()=>setActiveBtn("primary")}>
                    <div className={styles.btnHeading}>Primary Button</div>
                </div>
                <div className={`${styles.secondaryBtn} ${activeBtn === "secondary" ? styles.activeBtn : ""}`} onClick={()=>setActiveBtn("secondary")}>
                    <div className={styles.btnHeading}>Secondary Button</div>
                </div>
            </div>
            <div className={styles.configurations}>
                <div className={styles.configHeading}>Cofigurations</div>
                <div className={styles.btnConfigure}>
                    {activeBtn === "primary" ? <PrimaryButtonConfig/> : <SecondaryButtonConfig/>}
                </div>
            </div>
        </div>
    )
}

export default ButtonsModal