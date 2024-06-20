import React from 'react'
import styles from './widgetoptions.style.module.css'
import WidgetCard from './WidgetCard'

const WidgetOptions = () => {
  return (  
    <div className={styles.body}>
        <WidgetCard/>
        <WidgetCard/>
        <WidgetCard/>
        <WidgetCard/>
    </div>
  )
}


export default WidgetOptions