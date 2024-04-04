'use client'
import React, {useState} from 'react'
import styles from './descriptionmodal.style.module.css'

interface DescriptionModalProps {
    handleModal: () => void;
    handleDescription: (value: string) => void;
  }
const DescriptionModal = (props : DescriptionModalProps) => {

  const [description, setDescription] = useState('');

  const handleDescription = ()=>{
    props.handleDescription(description)
    props.handleModal()
  }
  const handleModal = ()=>{
    props.handleModal()
  }
   
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        Enter Description
        <div className={styles.closeBtn} onClick={handleModal}>x</div>
      </div>
      <textarea onChange={(e)=>setDescription(e.target.value)}></textarea>
      <div className={styles.saveBtn}>
        <button onClick={handleDescription}>Save</button>
      </div>
    </div>
  )
}

export default DescriptionModal