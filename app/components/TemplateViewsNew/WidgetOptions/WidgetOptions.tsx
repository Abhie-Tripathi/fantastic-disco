import React from 'react'
import styles from './widgetoptions.style.module.css'
import WidgetCard from './WidgetCard'

interface Props{
    setWidgetSelected : (value : string) => void
    widgetSelected : string;
}

const WidgetOptions = ({setWidgetSelected, widgetSelected} : Props) => {
  return (  
    <div className={styles.body}>
        <WidgetCard widgetType = "Page" setWidgetSelected={setWidgetSelected} widgetSelected={widgetSelected}/>
        <WidgetCard widgetType = "Section" setWidgetSelected={setWidgetSelected} widgetSelected={widgetSelected}/>
        <WidgetCard widgetType = "Sticky" setWidgetSelected={setWidgetSelected} widgetSelected={widgetSelected}/>
        <WidgetCard widgetType = "Popup" setWidgetSelected={setWidgetSelected} widgetSelected={widgetSelected}/>
    </div>
  )
}


export default WidgetOptions