import React from 'react'
import styles from './yourwidget.style.module.css'
import WidgetCard from './WidgetCard'

interface Props {
  setYourWidgetModal: (value: boolean) => void
}

const YourWidgets = ({ setYourWidgetModal }: Props) => {
  return (
    <div className={styles.body}>
      <div className={styles.heading_btnContainer}>
        <div className={styles.heading}>Your Widgets</div>
        <div className={styles.closeBtn} onClick={() => (setYourWidgetModal(false))}>{`>>`}</div>
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