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
        <div className={styles.usersList}>
          <div className={styles.invitedUser}>
            <div className={styles.initial}>R</div>
            <div className={styles.nameMailContainer}>
              <div className={styles.name}>Ross Geller</div>
              <div className={styles.email}>ross@friends.com</div>
            </div>
          </div>
          <div className={styles.invitedUser}>
            <div className={styles.initial}>W</div>
            <div className={styles.nameMailContainer}>
              <div className={styles.name}>Walter White</div>
              <div className={styles.email}>walter@gmail.com</div>
            </div>
          </div>
          <div className={styles.invitedUser}>
            <div className={styles.initial}>J</div>
            <div className={styles.nameMailContainer}>
              <div className={styles.name}>Joey Trib</div>
              <div className={styles.email}>joey@friends.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InviteGuestsFirstScreen