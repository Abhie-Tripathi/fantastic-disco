'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.style.module.css'
import InputComponent from '@/app/components/TemplateViewsNew/WidgetDashboard/InputComponent'
import DashboardBrandkit from '@/app/components/TemplateViewsNew/WidgetDashboard/DashboardBrandkit'
import DashboardWidgets from '@/app/components/TemplateViewsNew/WidgetDashboard/DashboardWidgets'
import DashboardEvents from '@/app/components/TemplateViewsNew/WidgetDashboard/DashboardEvents'
import { myFetch } from '@/utils/myFetch'
import { baseUrl } from '@/constants'

const Page = () => {

  const [fetchedBoolean, setFetchedBoolean] = useState<boolean>(false);
  const [brandkitLoadingState ,setBrandkitLoadingState] = useState<boolean>(true)

  // This is to see if the brandkit was used atleast once by user
  const checkBrandkit = async()=>{
    const {data,error} = await myFetch(`${baseUrl}/kit`)

    if(error){
      console.log(error);
      return;
    }
    if(data.domain.domain){
      setFetchedBoolean(true)
    }
    
  }

  useEffect(()=>{
    checkBrandkit()
  },[])

  return (
    <div className={styles.body}>
      <div className={fetchedBoolean ? styles.fetchedInputScreen : styles.inputScreen}>
        <InputComponent setBrandkitLoadingState={setBrandkitLoadingState} setFetchedBoolean={setFetchedBoolean} fetched={fetchedBoolean} />
      </div>
      {fetchedBoolean && <div className={styles.container}>
        <div className={styles.brandKitContainer}><DashboardBrandkit setBrandkitLoadingState={setBrandkitLoadingState} brandkitLoadingState={brandkitLoadingState}/></div>
        <div className={styles.widgetEventsContainer}>
          <div className={styles.widgetContainer}><DashboardWidgets /></div>
          <div className={styles.eventContainer}><DashboardEvents /></div>
        </div>
      </div>}
    </div>
  )
}

export default Page