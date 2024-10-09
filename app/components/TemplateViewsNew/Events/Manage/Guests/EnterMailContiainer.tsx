import React from 'react'
import styles from './entermail.style.module.css'

const EnterMailContiainer = () => {
  return (
    <div className={styles.body}>
        <div className={styles.heading}>Add Emails</div>
        <div className={styles.inputContainer}>
            <input type="text" placeholder='Paste of enter emails here'/>
            <button>Add</button>
        </div>
    </div>
  )
}

export default EnterMailContiainer