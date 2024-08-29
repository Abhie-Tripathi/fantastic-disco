'use client'
import React, { useState } from 'react'
import styles from './page.style.module.css'
import InputComponent from '@/app/components/TemplateViewsNew/WidgetDashboard/InputComponent'
import BrandKit from '@/app/components/TemplateViewsNew/EditScreen/BrandKit/CustomizeComponents/BrandKit'
import DashboardBrandkit from '@/app/components/TemplateViewsNew/WidgetDashboard/DashboardBrandkit'
import DashboardWidgets from '@/app/components/TemplateViewsNew/WidgetDashboard/DashboardWidgets'

const page = () => {

  const [fetchedBoolean, setFetchedBoolean] = useState<boolean>(true)

  return (
    <div className={styles.body}>
      <div className={fetchedBoolean ? styles.fetchedInputScreen : styles.inputScreen}>
        <InputComponent fetched={fetchedBoolean}/>
      </div>
      <div className={styles.container}>
        <div className={styles.brandKitContainer}><DashboardBrandkit/></div>
        <div className={styles.widgetContainer}><DashboardWidgets/></div>
        <div className={styles.eventContainer}></div>
      </div>
    </div>
  )
}

export default page