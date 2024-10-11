import React from 'react'
import styles from './capacitymodal.style.module.css'

const CapacityModal = () => {
    return (
        <div className={styles.body}>
            <div className={styles.header}>
                <div className={styles.heading}>Max Capacity</div>
                <div className={styles.subheading}>Auto-close registration when the capacity is reached. Only approved guests count toward the cap.</div>
            </div>
            <div className={styles.inputContainer}>
                <div className={styles.heading}>Capacity</div>
                <input type="number" />
            </div>
            <div className={styles.waitlistContainer}>
                <div className={styles.heading}>
                    Over-Capacity Waitlist
                </div>
                <input
                    type="checkbox"
                    id="register"
                    className={styles.checkboxInput}
                />
                <label htmlFor="register" className={styles.checkBox}></label>
            </div>
            <div className={styles.btnContainer}>
                <button className={styles.setBtn}>Set Limit</button>
                <button className={styles.removeBtn}>Remove Limit</button>
            </div>
        </div>
    )
}

export default CapacityModal