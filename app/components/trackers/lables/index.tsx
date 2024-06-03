import React from 'react'
import styles from './lables.style.module.css'
const index = () => {
    const lables=["Tags","Airport","Animal","Aeson","Sea","Curise","National","Hybrid","Hybrid"];
  return (
    <div className={styles.container}>
      <div className={styles.heading}>Lables</div>
      <div className={styles.labels}>
        {lables.map((label)=>(
            <div className={styles.label}>{label}</div>
        ))}
      </div>
    </div>
  )
}

export default index
