import React from 'react'
import styles from './suggestion.style.module.css'
const Suggestion = ({websiteData, addCompany}:any) => {
  
  return (
    <>
   {websiteData?.company?.length>0 && 
    <div className={styles.outerContainer}>
      {websiteData?.company?.map((item:any,index:number)=>(
        <div key={index} className={styles.content} onClick={()=>addCompany(item.website?item.website:item.name)}>{item.name}
        <span className={styles.subHeading}>{item.location.countryName}</span>
        </div>
      ))}
    </div>
}
    </>
  )
}

export default Suggestion;