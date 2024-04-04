import React from 'react'
import styles from './chatHeads.module.css'

interface Props {
  data: string[];
}

const ChatHeads: React.FC<Props> = ({ data }) => {
  return (
    <div className={styles.addedEmployees}>
      {data.map((employee) => (
        <div key={employee} className={styles.addedEmployee}>
          <div>{employee}</div>
        </div>
      ))}
    </div>
  )
}

export default ChatHeads;
