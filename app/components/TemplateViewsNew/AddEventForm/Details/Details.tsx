import React from 'react'
import styles from './details.style.module.css'

interface Props{
  setIsAddEventModalOpen : (value : boolean)=>void
}
const Details = ({setIsAddEventModalOpen} : Props) => {
  return (
    <div className={styles.body}>
      <div className={styles.btnContainer}>
        <button className={styles.closeBtn} onClick={() => setIsAddEventModalOpen(false)}>Close</button>
        <button className={styles.addBtn}>Save and Add event</button>
      </div>
      <div className={styles.line}></div>
    </div>
  )
}

export default Details