import React from 'react'
import styles from './inviteguestsecscreen.style.module.css'

const InviteGuestsSecScreen = () => {
  return (
    <div className={styles.sections}>
      <div className={styles.leftSection}>
        <div className={styles.inviteHeading}>
          Inviting 1 Person
        </div>
        <div className={styles.invitedListContainer}>
          <div className={styles.invitedUser}>
            <div className={styles.initial}>R</div>
            <div className={styles.nameMailContainer}>
              <div className={styles.name}>Ross Geller</div>
              <div className={styles.email}>ross@friends.com</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.verticalLine}></div>
      <div className={styles.rightSection}>
        <div className={styles.messageContainer}>
          <div className={styles.header}>
            Hi, Joey wants to invite you to the event Coldplay
          </div>
          <textarea className={styles.textarea} placeholder='Add a custom message here'></textarea>
        </div>
      </div>
    </div>
  )
}

export default InviteGuestsSecScreen