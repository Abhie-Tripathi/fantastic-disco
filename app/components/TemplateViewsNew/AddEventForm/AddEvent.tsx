import React from 'react'
import styles from './addevent.style.module.css'

import Appearance from './Appearance/Appearance'
import Details from './Details/Details'

interface Props{
    setIsAddEventModalOpen : (value : boolean)=>void
}
const AddEvent = ({setIsAddEventModalOpen} : Props) => {
  return (
    <div className={styles.body}>
        <div className={styles.appearance}><Appearance/></div>
        <div className={styles.details}><Details setIsAddEventModalOpen={setIsAddEventModalOpen}/></div>


    </div>
  )
}

export default AddEvent