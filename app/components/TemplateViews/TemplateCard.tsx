import React from 'react'
import styles from './templatecard.style.module.css'

const TemplateCard = () => {
  return (
    <div className={styles.card}>
        <div className={styles.placeHolder}></div>
        <div className={styles.cardHeading}>Something</div>
    </div>
  )
}

export default TemplateCard