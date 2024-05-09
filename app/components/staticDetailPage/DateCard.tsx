import React from 'react'
import styles from "./datecard.style.module.css"

const DateCard = () => {
  return (
    <div className={styles.container}>
        <div className={styles.day}>Friday</div>
        <div className={styles.date}>16</div>
        <div className={styles.monthAndYear}>Mar 2024</div>
    </div>
  )
}

export default DateCard