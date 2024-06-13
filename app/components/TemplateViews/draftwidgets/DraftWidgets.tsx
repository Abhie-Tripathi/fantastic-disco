import React, { useState } from 'react'
import styles from './draftwidgets.style.module.css'
import WidgetCard from './WidgetCard'

interface Props {
  setYourWidgetModal: (value: boolean) => void
  draftWidgets: string[];
}

const DraftWidgets = ({ setYourWidgetModal, draftWidgets }: Props) => {
  const [widgetType, setWidgetType] = useState<string>("All");

  return (
    <div className={styles.body}>
      <div className={styles.heading_btnContainer}>
        <div className={styles.heading}>Saved Drafts</div>
        <div className={styles.closeBtn} onClick={() => (setYourWidgetModal(false))}>{`>>`}</div>
      </div>
      {/* <div className={styles.filterContainer}>
        <div className={styles.filterHeading}>Filters : </div>
        <div className={`${styles.filterBtn} ${widgetType === "All" ? styles.activeFilter : ""}`} onClick={() => setWidgetType("All")}>All</div>
        <div className={`${styles.filterBtn} ${widgetType === "Page" ? styles.activeFilter : ""}`} onClick={() => setWidgetType("Page")}>Page</div>
        <div className={`${styles.filterBtn} ${widgetType === "Section" ? styles.activeFilter : ""}`} onClick={() => setWidgetType("Section")}>Section</div>
        <div className={`${styles.filterBtn} ${widgetType === "Sticky" ? styles.activeFilter : ""}`} onClick={() => setWidgetType("Sticky")}>Sticky</div>
        <div className={`${styles.filterBtn} ${widgetType === "Popup" ? styles.activeFilter : ""}`} onClick={() => setWidgetType("Popup")}>Popup</div>
      </div> */}
      {draftWidgets.length === 0 && <div className={styles.emptyMessage}>
        No widgets added to Draft.
        <br/>Save a widget to draft to see here
      </div>}
      <div className={styles.widgets}>
        {draftWidgets.map((widget, key) => (
          <WidgetCard status='Active' statusIcon="green" widgetType={widget} key={key} />
        ))}
      </div>

    </div>
  )
}

export default DraftWidgets