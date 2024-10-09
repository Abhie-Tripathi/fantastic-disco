import React, { useState } from 'react'
import styles from './inviteguest.style.module.css'

const InviteGuest = () => {

  const maxCount = 15;
  const [count, setCount] = useState(4); // Default starting count

  const percentageFilled = (count / maxCount) * 100;
  return (
    <div className={styles.body}>
      <div className={styles.header}>
        <div className={styles.heading}>Invite Guests</div>
        <div className={styles.counterContainer}>
          <div
            className={styles.counter}
            style={{
              background: `conic-gradient(#4caf50 ${percentageFilled}%, #e0e0e0 0)`,
            }}
          ></div>
          <div>{15-count} left</div>
        </div>
      </div>
      <div className={styles.line}></div>
      <div className={styles.sections}>
        <div className={styles.leftSection}>
          <div className={styles.heading}>Enter Emails</div>
          <div className={styles.line}></div>
          <div className={styles.subscriberContainer}>
            <div className={styles.subheading}>SUBSCRIBERS</div>
            <div className={styles.heading}>Everyone</div>
          </div>
          <div className={styles.line}></div>
        </div>
        <div className={styles.verticalLine}></div>
        <div className={styles.rightSection}></div>
      </div>
    </div>
  )
}

export default InviteGuest