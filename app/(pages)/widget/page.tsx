"use client"
import React from 'react'
import WidgetCard from '../../components/widgets/WidgetCard'
import More from '/public/more_horiz.svg'
import Styles from './page.module.css'
import data from '@/public/data/data.json'
import Add from '/public/add.svg'
import Image from 'next/image';
const Widget = () => {
  // console.log(data[0]);
  return (
    <div className={Styles.outerContainer}>
      <div className={Styles.containerOne}>
        <div className={Styles.c1left}>Widgets</div>
        <div className={Styles.c1right}>
            <div className={Styles.threeDots}><Image src={More} alt="more"/></div>
            <div className={Styles.addBtn}>
                <div><Image src={Add} alt="add"/></div>
                <div>Widget</div>
            </div>
        </div>
      </div>
      {data.map((item,index) => (
      <div key={index} className={Styles.containerTwo}>
        
          <WidgetCard key={item.id} data={item} />
       
      </div>
       ))}
      {/* <div className={Styles.containerTwo}>
        <WidgetCard />
      </div> */}
    </div>
  )
}

export default Widget