"use client"
import React, { useState,useEffect } from 'react';
import { myFetch} from '@/utils/myFetch';
import styles from './basicFilter.style.module.css'
import { baseUrl } from '@/constants';
interface CategoryData {
  attendedCategories?: string[];
  nonAttendedCategories?: string[];
  unscheduledCategories?: string[];
}
const BasicFilter = ({category}:any) => {
  const data1=["Community","Confrence","Concerts ","Expos","Sports","Performing Arts"]
  const data2=["Performing Arts","Academics","Daylight Savings","Observances","Public holidays","School Holidays"]
  const data3=[" Politics","Airport Delays"];
  const [categoryData,setCatgeoryData]=useState<CategoryData>();
  // useEffect(() => {
  //   console.log('data is', category);
  //   const fetchData = async () => {
  //     const { data, error } = await myFetch(`${baseUrl}/category/all`);
  //     if (error) {
  //       console.log(error);
  //       return;
  //     }

  //     if (data) {
  //       console.log(data);
  //       setCatgeoryData(data);
  //     }
  //   };
  //   fetchData();
  // }, []);
  // const newArr:string[] = [
  //   ...(categoryData?.attendedCategories ?? []),
  //   ...(categoryData?.nonAttendedCategories ?? []),
  //   ...(categoryData?.unscheduledCategories ?? [])
  // ];
  // const filteredArr = newArr.filter((item:any )=> category?.tracker?.filterValue?.category.includes(item?.id));
  // console.log(category?.tracker?.filterValue
  //   );
  //   console.log("data is:", filteredArr);
  //   console.log(category);
    
  // setCatgeoryData.filter((item)=>)
  return (
    <div className="p-3 flex gap-2 flex-col">
     <div className="text-[var(--primary-color)] font-semibold text-lg">Category</div>
     <div className="grid">
      <div className="grid grid-cols-3 gap-[var(--spacing-xs)]">
      {category?.map((item:any,id:any)=>(
      <div key={id}>
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
     
      {/* <div className={styles.allCat}>
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
      </div> */}
      {/* <div className={styles.allCat}>
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
      </div> */}
     </div>
    </div>
  )
}

export default BasicFilter;
