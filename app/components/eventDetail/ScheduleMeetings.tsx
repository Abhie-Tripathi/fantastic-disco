import React from 'react'
import styles from './scheduleMeetings.module.css'
import Search from '@/public/search.svg'
import Image from 'next/image'
const ScheduleMeetings = () => {
  return (
    <div className={styles.meetingContainer}>
      <div className={styles.container1}>
        <div className={styles.innerContainer1}>
        <div className={styles.circles}>
                <div className={styles.circle}>A</div>
                <div className={styles.circle}>B</div>
                <div className={styles.circle}>C</div>
        </div>
        <div style={{fontSize:"10px"}}>224 people have shown interest to participate in the event</div>
        </div>
        <div className={styles.innerContainer2}>
            <Image src={Search} alt="Search" />
            <div>
                <input type='text' className={styles.search} placeholder='Search @name / department'/>
            </div>
        </div>
      </div>
      <div className={styles.container2}>
        
      </div>
    </div>
  )
}

export default ScheduleMeetings
