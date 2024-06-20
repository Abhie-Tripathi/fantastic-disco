import React from 'react'
import styles from './widgetoptions.style.module.css'
import WidgetCard from './WidgetCard'

const WidgetOptions = () => {
  return (  
    <div className={styles.body}>
        <WidgetCard widgetType = "Page"/>
        <WidgetCard widgetType = "Section"/>
        <WidgetCard widgetType = "Sticky"/>
        <WidgetCard widgetType = "Popup"/>
    </div>
  )
}


export default WidgetOptions