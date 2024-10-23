import React, { useState } from 'react'
import styles from './entermail.style.module.css'
import { showToast } from '@/utils/showToast';

interface Props {
  setSelectedMails: (value: string[]) => void
}

const EnterMailContiainer = ({ setSelectedMails }: Props) => {

  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = emailInput.trim();
    
    if (trimmedEmail !== '' && !emails.includes(trimmedEmail)) {
      // Add the email to the emails state if it's not a duplicate
      const updatedEmails = [...emails, trimmedEmail];
      setEmails(updatedEmails);
      setSelectedMails(updatedEmails); // Update parent component state
      setEmailInput(''); // Clear the input field
    }else{
      showToast("warning","Email already added")
    }
  };

  return (
    <form className={styles.body} onSubmit={handleSubmit}>
      <div className={styles.heading}>Add Emails</div>
      <div className={styles.inputContainer}>
        <input type="mail" placeholder='Paste of enter emails here' value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)} />
        <button type="submit">Add</button>
      </div>
    </form>
  )
}

export default EnterMailContiainer