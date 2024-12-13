import React, { useEffect, useState } from 'react'
import styles from './inviteguestfirst.style.module.css'
import EnterMailContiainer from './EnterMailContiainer';
import AddEmails from './AddEmails';
import SuggestedEmail from './SuggestedEmail';

interface Props {
  setSelectedMails: (value: string[]) => void
  selectedMails: string[]
  suggestedMails: string[]
  setSuggestedMailQuery: (value: string) => void
}

const InviteGuestsFirstScreen = ({ setSuggestedMailQuery, setSelectedMails, selectedMails, suggestedMails }: Props) => {

  const [selectedScreen, setSelectedScreen] = useState<string>("suggested")

  return (
    <div className={styles.sections}>
      <div className={styles.leftSection}>
        <div className={`${styles.heading} ${selectedScreen === "suggested" ? styles.activeHeading : ""}`} onClick={() => setSelectedScreen("suggested")}>Suggestions</div>
        <div className={`${styles.heading} ${selectedScreen === "add" ? styles.activeHeading : ""}`} onClick={() => setSelectedScreen("add")}>Enter Emails</div>
        <div className={styles.line}></div>
      </div>
      <div className={styles.verticalLine}></div>
      <div className={styles.rightSection}>
        {selectedScreen === "suggested" ? <SuggestedEmail setSuggestedMailQuery={setSuggestedMailQuery} suggestedMails={suggestedMails} selectedMails={selectedMails} setSelectedMails={setSelectedMails} /> : <AddEmails selectedMails={selectedMails} setSelectedMails={setSelectedMails} />}
      </div>
    </div>
  )
}

export default InviteGuestsFirstScreen