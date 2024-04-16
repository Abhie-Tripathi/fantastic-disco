import React from 'react'
import styles from './declineNotes.module.css'
import Send from '@/public/send.svg';
import Image from 'next/image';
const DeclineNote = () => {
  return (
    <div className={styles.inputBox}>
     <input type="text" className={styles.box} placeholder='Add a note,  @name' />
     <Image style={{cursor:"pointer"}} src={Send} alt="Send"/>
    </div>
  )
}

export default DeclineNote
