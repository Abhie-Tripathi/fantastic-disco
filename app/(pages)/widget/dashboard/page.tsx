'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.style.module.css'
import InputComponent from '@/app/components/TemplateViewsNew/WidgetDashboard/InputComponent'
import DashboardBrandkit from '@/app/components/TemplateViewsNew/WidgetDashboard/DashboardBrandkit'
import DashboardWidgets from '@/app/components/TemplateViewsNew/WidgetDashboard/DashboardWidgets'
import DashboardEvents from '@/app/components/TemplateViewsNew/WidgetDashboard/DashboardEvents'

const Page = () => {

  const [fetchedBoolean, setFetchedBoolean] = useState<boolean>(false);

  useEffect(() => {
    const storedBrandkit = localStorage.getItem('brandkit');

    if (storedBrandkit === null) {
      // If 'brandkit' is not in localStorage, set it to false
      localStorage.setItem('brandkit', "false");
    }else if(storedBrandkit === "true"){
      setFetchedBoolean(true)
    }
  }, []);

  return (
    <div className={styles.body}>
      <div className={fetchedBoolean ? styles.fetchedInputScreen : styles.inputScreen}>
        <InputComponent setFetchedBoolean={setFetchedBoolean} fetched={fetchedBoolean} />
      </div>
      {fetchedBoolean && <div className={styles.container}>
        <div className={styles.brandKitContainer}><DashboardBrandkit /></div>
        <div className={styles.widgetEventsContainer}>
          <div className={styles.widgetContainer}><DashboardWidgets /></div>
          <div className={styles.eventContainer}><DashboardEvents /></div>
        </div>
      </div>}
    </div>
  )
}

export default Page