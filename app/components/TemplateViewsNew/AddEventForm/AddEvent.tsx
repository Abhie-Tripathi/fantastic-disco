import React, { useState } from 'react'
import styles from './addevent.style.module.css'  
import Appearance from './Appearance/Appearance'
import Details from './Details/Details'

interface Props{
    setIsAddEventModalOpen : (value : boolean)=>void
    widgetId : string;
    fetchEvents : () => Promise<void>; 
}
const AddEvent = ({setIsAddEventModalOpen, widgetId,fetchEvents} : Props) => {

  const [pageBgColor, setPageBgColor] = useState<string>("rgba(70, 83, 216, 0.1)")
  const [eventFont, setEventFont] = useState<string>("Arial")
  const [extractedColors, setExtractedColors] = useState<string[]>(["#843DF8", "#424FDF", "#1A56F3", "#3097F5", "#0785A2"])

  return (
    <div className={styles.body}>
        <div className={styles.appearance}><Appearance extractedColors={extractedColors} setExtractedColors={setExtractedColors} setEventFont={setEventFont} eventFont = {eventFont} setPageBgColor={setPageBgColor} pageBgColor={pageBgColor}/></div>
        <div className={styles.details}><Details fetchEvents={fetchEvents} widgetId={widgetId} eventFont={eventFont} pageBgColor= {pageBgColor} setIsAddEventModalOpen={setIsAddEventModalOpen}/></div>
    </div>
  )
}

export default AddEvent