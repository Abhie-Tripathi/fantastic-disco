import React from 'react'
import styles from './page.style.module.css'
import Internal from '@/app/components/internal/Internal'
const Page = () => {
  return (
    
    <div className={styles.container}>
        <div className={styles.innerContainer}>
            <div className={styles.container1}>
              
                <div className={styles.number}>12</div>
                <div className={styles.heading}>Exhibitors</div>
                
            </div>
            <div className={styles.container1}>
                <div className={styles.number}>6</div>
                <div className={styles.heading}>Sponsores</div>
            </div>
            <div className={styles.container1}>
                <div className={styles.number}>12</div>
                <div className={styles.heading}>Speakers</div>
            </div>
            <div className={styles.container1}>
                <div className={styles.number}>12</div>
                <div className={styles.heading}>Attendee</div>
            </div>
        </div>
      <Internal/>
    </div>
  
  )
}

export default Page
