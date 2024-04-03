import React from 'react'
import styles from './youreventcard.style.module.css'
import locationIcon from '../../icons/location.svg'
import speakerIcon from '../../icons/speaker.svg'
import rightArrowIcon from '../../icons/rightbigarrow.svg'
import calendarIcon from '../../icons/calendar.svg'
import ChatHeads from './ChatHeads'

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
};

const YourEventCard = ({ eventName, eventCtas, eventLocation, eventImage, eventDate }) => {

  const formattedDate = formatDate(eventDate);
  return (
    <div className={styles.card}>
      <img src={eventImage} width={300} height={238} className={styles.cardImg} />
      <div className={styles.cardDetails}>
        <div style={{position:"relative"}}>
        <div className={styles.eventName}>{eventName}</div>
        <div className={styles.pills}>
          {eventCtas.map((item)=>(
            <div className={styles.pill}>{item}</div>
          ))

          }
        </div>
        </div>
        <div className={styles.locationAndDateContainer}>
          <div className={styles.eventLocation}>
            <img src={locationIcon} width={24} height={24} />
            <div>{eventLocation}</div>
          </div>
          <div className={styles.eventDate}>
            <img src={calendarIcon} width={14} height={14} />
            <div>{formattedDate}</div>
          </div>
        </div>
         <ChatHeads data={["A","B","C"]}/> 
        <div className={styles.eventDetails}>
          <div className={styles.detailContainer}>
            <div>View Details</div>
            <img src={rightArrowIcon} width={50} height={24} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default YourEventCard