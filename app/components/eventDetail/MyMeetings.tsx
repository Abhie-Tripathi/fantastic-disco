import React from 'react'
import MyCalendar from './MyCalendar'
import UpcomingEvents from './UpcomingEvents'
import MeetingRequest from './MeetingRequest'
import styles from './myMeetings.style.module.css'
const MyMeetings = () => {
    
  return (
    <div style={{height:"100%"}}>
      <div className={styles.container}>
        <MyCalendar/>
        <UpcomingEvents/>
        <MeetingRequest/>
      </div>
    </div>
  )
}

export default MyMeetings
