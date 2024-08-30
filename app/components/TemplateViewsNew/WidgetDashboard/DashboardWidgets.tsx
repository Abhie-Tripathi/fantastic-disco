import React, { useState } from 'react'
import styles from './dashboardwidgets.style.module.css'
import Errorpage from '@/app/components/TemplateViewsNew/Errorpage'


const DashboardWidgets = () => {
  const [selectedBtn, setSelectedBtn] = useState<string>("Widgets")
  return (
    <div className={styles.body}>
      <div className={styles.btnContainer}>
        <button className={selectedBtn === "Widgets" ? styles.selectedBtn : styles.deselectedBtn} onClick={() => setSelectedBtn("Widgets")}>Widgets</button>
        <button className={selectedBtn === "Drafts" ? styles.selectedBtn : styles.deselectedBtn} onClick={() => setSelectedBtn("Drafts")}>Drafts</button>
      </div>
      <Errorpage size='short' type='list' />
    </div>
  )
}

export default DashboardWidgets