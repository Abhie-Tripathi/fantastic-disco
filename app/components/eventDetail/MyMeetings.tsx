import React from 'react'
import MyCalendar from './MyCalendar'
import UpcomingEvents from './UpcomingEvents'
import styles from './myMeetings.style.module.css'
const MyMeetings = () => {
    
  return (
    <div>
      <div className={styles.container}>
        <MyCalendar/>
        <UpcomingEvents/>
      </div>
    </div>
  )
}

export default MyMeetings
