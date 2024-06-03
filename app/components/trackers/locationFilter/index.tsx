import React from 'react'
import styles from './locationFilter.style.module.css'
const index = () => {
  return (
    <div className={styles.container}>
      <div className={styles.location}>
        <div style={{color:"#6750A4"}}>Location</div>
        <div style={{color:'#696B83'}}>Bengaluru, Karnataka, India (1.34 mi radius) </div>
      </div>
      <div className={styles.location}>
        <div style={{color:"#6750A4"}}>Date & Time</div>
        <div style={{color:'#696B83'}}>29 Apr 2024 - 29 May 2024</div>
      </div>
      <div className={styles.location}>
        <div style={{color:"#6750A4"}}>Attendance</div>
        <div style={{color:'#696B83'}}>0-2,000,000</div>
      </div>
    </div>
  )
}

export default index
