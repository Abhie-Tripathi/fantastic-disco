import React from 'react'
import styles from './suggestion.style.module.css'
const Suggestion = ({websiteData}) => {
    console.log(websiteData);
    
  return (
    <div className={styles.outerContainer}>
      {websiteData?.map((item,index)=>(
        <div className={styles.content}>{item.name}</div>
      ))}
    </div>
  )
}

export default Suggestion;
