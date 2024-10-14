import React from 'react'
import styles from './approvalmodal.style.module.css'

const ApprovalModal = () => {
  return (
    <div className={styles.body}>
            <div className={styles.header}>
                <div className={styles.heading}>Edit Approval</div>
                <div className={styles.subheading}>If the user needs an approval or not</div>
            </div>
            <div className={styles.approvalContainer}>
                <div className={styles.heading}>
                    Require Approval
                </div>
                <input
                    type="checkbox"
                    id="register"
                    className={styles.checkboxInput}
                />
                <label htmlFor="register" className={styles.checkBox}></label>
            </div>
        </div>
  )
}

export default ApprovalModal