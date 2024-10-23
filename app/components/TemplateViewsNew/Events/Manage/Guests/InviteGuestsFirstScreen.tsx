import React, { useEffect, useState } from 'react'
import styles from './inviteguestfirst.style.module.css'
import EnterMailContiainer from './EnterMailContiainer';

interface Props {
  setSelectedMails: (value: string[]) => void
  selectedMails: string[]
}

const InviteGuestsFirstScreen = ({ setSelectedMails, selectedMails }: Props) => {
  return (
    <div className={styles.sections}>
      <div className={styles.leftSection}>
        <div className={styles.heading}>Suggestions</div>
        <div className={styles.heading}>Enter Emails</div>
        <div className={styles.line}></div>
        {/* <div className={styles.subscriberContainer}>
          <div className={styles.heading}>Everyone</div>
        </div> */}
        {/* <div className={styles.line}></div> */}
      </div>
      <div className={styles.verticalLine}></div>
      <div className={styles.rightSection}>
        <EnterMailContiainer setSelectedMails={setSelectedMails} />
        <div className={styles.usersList}>
          {selectedMails.map((mail, key) => (
            <div className={styles.invitedUser} key={key}>
              <div className={styles.initial}>{mail.substring(0,1)}</div>
              <div className={styles.nameMailContainer}>
                {/* <div className={styles.name}>Walter White</div> */}
                <div className={styles.email}>{mail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InviteGuestsFirstScreen