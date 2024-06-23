import React from 'react'
import styles from './locationFilter.style.module.css'
const index = ({start,end, startDate, endDate, locations}:any) => {
  function formatDate(dateString:Date) {
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
console.log(locations);

  return (
    <div className={styles.container}>
      <div className={styles.location}>
        <div style={{color:"#6750A4"}}>Location</div>
        <div style={{color:'#696B83'}}>
        {locations?.map((item:string) => (
  <div key={item}>{item}</div>
))}
        </div>
      </div>
      <div className={styles.location}>
        <div style={{color:"#6750A4"}}>Date & Time</div>
        <div style={{color:'#696B83'}}>{startDate?.length>0&&formatDate(startDate)} - {endDate?.length>0&&formatDate(endDate)}</div>
      </div>
      <div className={styles.location}>
        <div style={{color:"#6750A4"}}>Attendance</div>
        <div style={{color:'#696B83'}}>{start} - {end}</div>
      </div>
    </div>
  )
}

export default index
