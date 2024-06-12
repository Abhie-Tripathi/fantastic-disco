import React, { useState } from 'react'
import styles from './yourwidget.style.module.css'
import WidgetCard from './WidgetCard'

interface Props {
  setYourWidgetModal: (value: boolean) => void
}

const YourWidgets = ({ setYourWidgetModal }: Props) => {
  const [widgetType, setWidgetType] = useState<string>("All");

  return (
    <div className={styles.body}>
      <div className={styles.heading_btnContainer}>
        <div className={styles.heading}>Your Widgets</div>
        <div className={styles.closeBtn} onClick={() => (setYourWidgetModal(false))}>{`>>`}</div>
      </div>
      <div className={styles.filterContainer}>
        <div className={styles.filterHeading}>Filters : </div>
        <div className={`${styles.filterBtn} ${widgetType === "All" ? styles.activeFilter : ""}`} onClick={()=>setWidgetType("All")}>All</div>
        <div className={`${styles.filterBtn} ${widgetType === "Page" ? styles.activeFilter : ""}`} onClick={()=>setWidgetType("Page")}>Page</div>
        <div className={`${styles.filterBtn} ${widgetType === "Section" ? styles.activeFilter : ""}`} onClick={()=>setWidgetType("Section")}>Section</div>
        <div className={`${styles.filterBtn} ${widgetType === "Sticky" ? styles.activeFilter : ""}`} onClick={()=>setWidgetType("Sticky")}>Sticky</div>
        <div className={`${styles.filterBtn} ${widgetType === "Popup" ? styles.activeFilter : ""}`} onClick={()=>setWidgetType("Popup")}>Popup</div>
      </div>
      <div className={styles.widgets}>
        <WidgetCard status='Active' statusIcon = "green" />
        <WidgetCard status='Inactive' statusIcon = "red"/>
        <WidgetCard status='Events Not Selected' statusIcon = "yellow"/>
        <WidgetCard status='Events Not Selected' statusIcon = "yellow"/>
        <WidgetCard status='Events Not Selected' statusIcon = "yellow"/>
      </div>

    </div>
  )
}

export default YourWidgets