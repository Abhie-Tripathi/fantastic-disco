import React from 'react'
import styles from './inviteguestfirst.style.module.css'
import EnterMailContiainer from './EnterMailContiainer';

const InviteGuestsFirstScreen = () => {
  return (
    <div className={styles.sections}>
      <div className={styles.leftSection}>
        <div className={styles.heading}>Suggestions</div>
        <div className={styles.heading}>Enter Emails</div>
        <div className={styles.line}></div>
        <div className={styles.subscriberContainer}>
          <div className={styles.heading}>Everyone</div>
        </div>
        {/* <div className={styles.line}></div> */}
      </div>
      <div className={styles.verticalLine}></div>
      <div className={styles.rightSection}>
        <EnterMailContiainer />
      </div>
    </div>
  )
}

export default InviteGuestsFirstScreen