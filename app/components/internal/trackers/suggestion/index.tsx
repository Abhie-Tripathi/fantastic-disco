import React from 'react'
import styles from './suggestion.style.module.css'
const Suggestion = ({websiteData, addCompany}:any) => {
  return (
    <>
   {websiteData && 
    <div className={styles.outerContainer}>
      {websiteData?.map((item:any,index:number)=>(
        <div key={index} className={styles.content} onClick={()=>addCompany(item.website)}>{item.name}{" "}{item.country}</div>
      ))}
    </div>
}
    </>
  )
}

export default Suggestion;