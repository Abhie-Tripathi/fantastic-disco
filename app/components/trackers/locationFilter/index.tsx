import React from 'react'
import styles from './locationFilter.style.module.css'
const index = ({start,end, startDate, endDate}) => {
  function formatDate(dateString) {
    const date = new Date(dateString);
    
    // Get day
    const day = date.getDate();
    
    // Get month and convert it to short format
    const month = date.toLocaleString('default', { month: 'short' });
    
    // Get year
    const year = date.getFullYear();
    
    // Format the date
    const formattedDate = `${day} ${month}, ${year}`;
    
    return formattedDate;
}
  return (
    <div className={styles.container}>
      <div className={styles.location}>
        <div style={{color:"#6750A4"}}>Location</div>
        <div style={{color:'#696B83'}}>Bengaluru, Karnataka, India (1.34 mi radius) </div>
      </div>
      <div className={styles.location}>
        <div style={{color:"#6750A4"}}>Date & Time</div>
        <div style={{color:'#696B83'}}>{formatDate(startDate)} - {formatDate(endDate)}</div>
      </div>
      <div className={styles.location}>
        <div style={{color:"#6750A4"}}>Attendance</div>
        <div style={{color:'#696B83'}}>{start} - {end}</div>
      </div>
    </div>
  )
}

export default index
