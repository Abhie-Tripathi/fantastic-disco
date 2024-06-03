import React from 'react'
import styles from './basicFilter.style.module.css'
const index = () => {
  const data1=["Community","Confrence","Concerts ","Expos","Sports","Performing Arts"]
  const data2=["Performing Arts","Academics","Daylight Savings","Observances","Public holidays","School Holidays"]
  const data3=[" Politics","Airport Delays"];
  return (
    <div className={styles.containerOuter}>
     <div className={styles.heading}>Category</div>
     <div className={styles.allCat1}>
      <div className={styles.allCat}>
      {data1.map((item,id)=>(
      <div key={id} style={{width:"120px"}}>
      <label >
       <input
         
         className={styles.text} 
         type="checkbox"
         // onChange={() => onChange()}
         checked={true}
         disabled
       />
       <span className={styles.item}>{item}</span>
     </label>
      </div>
     ))}
      </div>
     
      <div className={styles.allCat}>
      {data2.map((item,id)=>(
      <div key={id}  style={{width:"120px"}}>
      <label >
       <input
         
         className={styles.text} 
         type="checkbox"
         // onChange={() => onChange()}
         checked={true}
         disabled
       />
       <span className={styles.item}>{item}</span>
     </label>
      </div>
     ))}
      </div>
      <div className={styles.allCat}>
      {data3.map((item,id)=>(
      <div key={id} style={{width:"120px"}}>
      <label >
       <input
         
         className={styles.text} 
         type="checkbox"
         // onChange={() => onChange()}
         checked={true}
         disabled
       />
       <span className={styles.item}>{item}</span>
     </label>
      </div>
     ))}
      </div>
     </div>
    </div>
  )
}

export default index;
