import React, { useState } from 'react'
import styles from './addevent.style.module.css'  
import Appearance from './Appearance/Appearance'
import Details from './Details/Details'

interface Props{
    setIsAddEventModalOpen : (value : boolean)=>void
}
const AddEvent = ({setIsAddEventModalOpen} : Props) => {

  const [pageBgColor, setPageBgColor] = useState<string>("rgba(70, 83, 216, 0.1)")
  const [eventFont, setEventFont] = useState<string>("Arial")

  return (
    <div className={styles.body}>
        <div className={styles.appearance}><Appearance setEventFont={setEventFont} eventFont = {eventFont} setPageBgColor={setPageBgColor} pageBgColor={pageBgColor}/></div>
        <div className={styles.details}><Details eventFont={eventFont} pageBgColor= {pageBgColor} setIsAddEventModalOpen={setIsAddEventModalOpen}/></div>
    </div>
  )
}

export default AddEvent