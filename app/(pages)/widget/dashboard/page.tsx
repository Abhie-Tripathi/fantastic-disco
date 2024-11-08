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

  const [fetchedBoolean, setFetchedBoolean] = useState<boolean>(false); // To check if atleast once the user has fetched the brandkit
  const [brandkitLoadingState ,setBrandkitLoadingState] = useState<boolean>(true)
  const [polling, setPolling] = useState<boolean>(true);
  const [fetchedDomain, setFetchedDomain] = useState<string>("")
  const [brandkitFetched, setBrandkitFetched] = useState<boolean>(true)

  const [removeCalled, setRemoveCalled] = useState<boolean>(false) // This is a variable so that when ever a widget is deleted we can call the function in input container to make the button disbaled 
  
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
        <InputComponent removeCalled={removeCalled} setBrandkitFetched={setBrandkitFetched} fetchedDomain={fetchedDomain} setFetchedDomain={setFetchedDomain} setPolling={setPolling} setBrandkitLoadingState={setBrandkitLoadingState} setFetchedBoolean={setFetchedBoolean} fetched={fetchedBoolean} />
      </div>
      {fetchedBoolean && <div className={styles.container}>
        <div className={styles.brandKitContainer}><DashboardBrandkit setBrandkitFetched={setBrandkitFetched} brandkitFetched={brandkitFetched} setFetchedDomain={setFetchedDomain} polling={polling} setPolling={setPolling} setBrandkitLoadingState={setBrandkitLoadingState} brandkitLoadingState={brandkitLoadingState}/></div>
        <div className={styles.widgetEventsContainer}>
          <div className={styles.widgetContainer}><DashboardWidgets removeCalled={removeCalled} setRemoveCalled={setRemoveCalled} /></div>
          <div className={styles.eventContainer}><DashboardEvents /></div>
        </div>
      </div>}
    </div>
  )
}

export default Page