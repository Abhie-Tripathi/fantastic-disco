import React from 'react'
import styles from './suggestedemail.style.module.css'
import EnterMailContiainer from './EnterMailContiainer'

interface Props {
  setSuggestedMailQuery: (value: string) => void 
  setSelectedMails: (value: string[]) => void
  selectedMails: string[]
  suggestedMails: string[]
}

const SuggestedEmail = ({setSuggestedMailQuery, setSelectedMails, suggestedMails, selectedMails }: Props) => {

  const handleMailClick = (mail: string) => {
    if (selectedMails.includes(mail)) {
      // If mail is already selected, remove it
      setSelectedMails(selectedMails.filter((selectedMail) => selectedMail !== mail));
    } else {
      // If mail is not selected, add it
      setSelectedMails([...selectedMails, mail]);
    }
  };

  return (
    <div className={styles.body}>
      <EnterMailContiainer setSuggestedMailQuery={setSuggestedMailQuery} name='Suggested Emails' placeholder = "Search Suggestions" />
      <div className={styles.usersList}>
        {suggestedMails.map((mail, key) => (
          <div className={styles.suggestedUser} key={key} onClick={() => handleMailClick(mail)}>
            <div className={styles.nameContainer}>
              <div className={styles.initial}>{mail.substring(0, 1)}</div>
              <div className={styles.nameMailContainer}>
                {/* <div className={styles.name}>Walter White</div> */}
                <div className={styles.email}>{mail}</div>
              </div>
            </div>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={selectedMails.includes(mail)}
              // onChange={(e) => handleCheckboxChange(mail, e.target.checked)}
              readOnly
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SuggestedEmail