import React from 'react'
import styles from './registermodal.style.module.css'

const RegisterModal = () => {
    return (
        <div className={styles.body}>
            <div className={styles.heading}>Registration</div>
            <div className={styles.subheading}>Close registration to stop accepting new guests, including anyone who may have been invited.</div>
            <div className={styles.subheading}> Please note that capacity and availability settings apply when registration is open.</div>
            <div className={styles.regisBtnContainer}>
                <div className={styles.heading}>
                    Accept Registration
                </div>
                <input
                    type="checkbox"
                    id="register"
                    className={styles.checkboxInput}
                />
                <label htmlFor="register" className={styles.checkBox}></label>
            </div>
            <button className={styles.confirmBtn}>Confirm</button>
        </div>
    )
}

export default RegisterModal