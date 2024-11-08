import React from 'react'
import styles from './addemails.style.module.css'
import EnterMailContiainer from './EnterMailContiainer'

interface Props {
    setSelectedMails: (value: string[]) => void
    selectedMails: string[]
}

const AddEmails = ({ setSelectedMails, selectedMails }: Props) => {
    const handleRemoveEmail = (emailToRemove: string) => {
        const updatedEmails = selectedMails.filter(mail => mail !== emailToRemove);
        setSelectedMails(updatedEmails); // Update the parent component state
    };
    return (
        <div>
            <EnterMailContiainer name='Add Emails' placeholder = "Paste of enter emails here" selectedMails={selectedMails} setSelectedMails={setSelectedMails} />
            <div className={styles.usersList}>
                {selectedMails.map((mail, key) => (
                    <div className={styles.invitedUser} key={key}>
                        <div className={styles.nameContainer}>
                            <div className={styles.initial}>{mail.substring(0, 1)}</div>
                            <div className={styles.nameMailContainer}>
                                {/* <div className={styles.name}>Walter White</div> */}
                                <div className={styles.email}>{mail}</div>
                            </div>
                        </div>
                        <button className={styles.cancelBtn} onClick={() => handleRemoveEmail(mail)}>x</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AddEmails