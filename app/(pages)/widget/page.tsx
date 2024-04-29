"use client"
import React, { useState, useEffect } from 'react'
import WidgetCard from '../../components/widgets/WidgetCard'
import More from '/public/more_horiz.svg'
import Styles from './page.module.css'
import Add from '/public/add.svg'
import Image from 'next/image';
import Link from 'next/link'
import SkeletonWidget from '@/app/components/widgets/SkeletonWidget'
import { useTheme } from '@/context'

const Widget = () => {

  const [widgets, setWidgets] = useState<any>();
  const {theme} = useTheme()

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsePage = await fetch('https://api.eventgeni.com/widgets?type=page');
        const responseSticky = await fetch('https://api.eventgeni.com/widgets?type=sticky');
        const dataPage = await responsePage.json();
        const dataSticky = await responseSticky.json();
        const allWidgets = [...dataPage, ...dataSticky];
        setWidgets(allWidgets);
      } catch (error) {
        console.error('Error fetching widgets:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={`${Styles.outerContainer} ${theme === 'light' ? Styles.outerContainer_light: ""}`}>
      <div className={`${Styles.containerOne} ${Styles.containerOne_light}`}>
        <div className={Styles.c1left}>Widgets</div>
        <div className={Styles.c1right}>
          <div className={Styles.threeDots}><Image src={More} alt="more" /></div>
          <Link className={Styles.addBtn} href={"/widget/add"}>
            <div><Image src={Add} alt="add" /></div>
            <div>Add Widget</div>
          </Link>
        </div>
      </div>
      {widgets?.length > 0 ? (
        widgets.map((item : any, index : number) => (
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