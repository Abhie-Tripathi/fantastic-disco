'use client'
import React, { useState } from 'react'
import styles from './page.style.module.css'
import InputComponent from '@/app/components/TemplateViewsNew/WidgetDashboard/InputComponent'
import BrandKit from '@/app/components/TemplateViewsNew/EditScreen/BrandKit/CustomizeComponents/BrandKit'
import DashboardBrandkit from '@/app/components/TemplateViewsNew/WidgetDashboard/DashboardBrandkit'
import DashboardWidgets from '@/app/components/TemplateViewsNew/WidgetDashboard/DashboardWidgets'
import DashboardEvents from '@/app/components/TemplateViewsNew/WidgetDashboard/DashboardEvents'
import { AddedEventsType } from '@/types/addedeventtype'

const page = () => {

  const [fetchedBoolean, setFetchedBoolean] = useState<boolean>(true)

  return (
    <div className={styles.body}>
      <div className={fetchedBoolean ? styles.fetchedInputScreen : styles.inputScreen}>
        <InputComponent fetched={fetchedBoolean} />
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

export default page