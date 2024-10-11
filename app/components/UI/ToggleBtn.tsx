import React, { useEffect, useState } from 'react'
import styles from './toggleBtn.style.module.css'
const ToggleBtn = (isTrue) => {
    const [True,setIsTrue]=useState(false);
    useEffect(()=>{
        setIsTrue(isTrue);
    },[isTrue])
    
  return (
    
       <span>
              <label className="w-[30px] h-[17px] relative inline-block">
                <input
                  type="checkbox"
                  // onChange={() => {}}
                  // checked={}
                  defaultChecked
                  disabled
                  className='w-[0] h-[0] opacity-0'
                />
                <span className={`${True.isTrue ? styles.sliderBranded : styles.slider}`}></span>
              </label>
            </span>
  )
}

export default ToggleBtn
