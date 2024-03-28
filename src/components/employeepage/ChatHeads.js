import React from 'react'
import styles from './chatheads.style.module.css'

const ChatHeads = ({ data }) => {
  return (
    <div className={styles.addedEmployees}>
      {data.map(employee => (
        <div className={styles.addedEmployee}>
          <div>{employee}</div>
        </div>
      ))}
    </div>
  )
}

export default ChatHeads