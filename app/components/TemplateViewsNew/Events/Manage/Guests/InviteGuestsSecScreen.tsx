import React from 'react'
import styles from './inviteguestsecscreen.style.module.css'

interface Props {
  selectedMails: string[]
}
const InviteGuestsSecScreen = ({ selectedMails }: Props) => {

  return (
    <div className={styles.sections}>
      <div className={styles.leftSection}>
        <div className={styles.inviteHeading}>
          Inviting {selectedMails.length} Person
        </div>
        <div className={styles.invitedListContainer}>
          {selectedMails.map((mail, key) => (
            <div className={styles.invitedUser} key={key}>
              <div className={styles.initial}>{mail.substring(0,1)}</div>
              <div className={styles.nameMailContainer}>
                {/* <div className={styles.name}>Ross Geller</div> */}
                <div className={styles.email}>{mail}</div>
              </div>
            </div>
          ))}

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