import React from 'react'
import styles from './labels.style.module.css'
const index = ({labels}:any) => {
    const lables=["Tags","Airport","Animal","Aeson","Sea","Curise","National","Hybrid","Hybrid"];
    console.log(labels);
    
  return (
    <div className={styles.container}>
      <div className={styles.heading}>Labels</div>
      <div className={styles.labels}>
        {labels && labels.map((label:any, id:any)=>(
            <div key={id} className={styles.label}>{label}</div>
        ))}
      </div>
    </div>
  )
}

export default index
