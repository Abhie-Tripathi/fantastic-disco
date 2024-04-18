"use client"
import React, { useState, useEffect } from 'react'
import WidgetCard from '../../components/widgets/WidgetCard'
import More from '/public/more_horiz.svg'
import Styles from './page.module.css'
import Add from '/public/add.svg'
import Image from 'next/image';
import Link from 'next/link'
import SkeletonWidget from '@/app/components/widgets/SkeletonWidget'

const Widget = () => {

  const [widgets, setWidgets] = useState([]);

  useEffect(() => {
    const storedWidgets = localStorage.getItem('widgets');
    if (storedWidgets) {
      setWidgets(JSON.parse(storedWidgets));
    }
  }, []);

  return (
    <div className={Styles.outerContainer}>
      <div className={Styles.containerOne}>
        <div className={Styles.c1left}>Widgets</div>
        <div className={Styles.c1right}>
          <div className={Styles.threeDots}><Image src={More} alt="more" /></div>
          <Link className={Styles.addBtn} href={"/widget/add"}>
            <div><Image src={Add} alt="add" /></div>
            <div>Add Widget</div>
          </Link>
        </div>
      </div>
      {widgets.length > 0 ? (
        widgets.map((item, index) => (
          <div key={index} className={Styles.containerTwo}>
            <WidgetCard data={item} />
          </div>
        ))
      ) : (
        <SkeletonWidget/>
      )}
    </div>
  )
}

export default Widget