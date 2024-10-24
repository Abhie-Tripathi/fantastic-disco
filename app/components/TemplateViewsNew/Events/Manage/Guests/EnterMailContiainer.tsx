import React, { useState } from 'react'
import styles from './entermail.style.module.css'
import { showToast } from '@/utils/showToast';

interface Props {
  setSelectedMails: (value: string[]) => void
  selectedMails : string[]
  name : string;
  placeholder : string;
}

const EnterMailContiainer = ({ setSelectedMails,selectedMails, name, placeholder }: Props) => {

  const [emailInput, setEmailInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = emailInput.trim();
    
    if (trimmedEmail !== '' && !selectedMails.includes(trimmedEmail)) {
      // Add the email to the emails state if it's not a duplicate
      const updatedEmails = [...selectedMails, trimmedEmail];
      setSelectedMails(updatedEmails); // Update parent component state
      setEmailInput(''); // Clear the input field
    }else{
      showToast("warning","Email already added")
    }
  };

  return (
    <form className={styles.body} onSubmit={handleSubmit}>
      <div className={styles.heading}>{name}</div>
      <div className={styles.inputContainer}>
        <input type="email" placeholder={placeholder} value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)} />
        <button type="submit">Add</button>
      </div>
    </form>
  )
}

export default EnterMailContiainer