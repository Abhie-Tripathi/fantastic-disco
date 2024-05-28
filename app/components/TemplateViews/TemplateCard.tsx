import React from 'react'
import styles from './templatecard.style.module.css'

interface TemplateCardProps {
  name: string;
  isHidden : boolean;
  id : string;
  setPreview: (id: string) => void;
  desc? : string;
  setEditModal?: (value: boolean) => void;
}

const TemplateCard = ({ name, isHidden, id, setPreview, desc,setEditModal }: TemplateCardProps) => {

  const handleModal = ()=>{
    if(setEditModal){
      setEditModal(true)
    }
  }
  return (
    <div className={`${styles.card} ${isHidden ? styles.hiddenCard : ""}`}>
      <div className={styles.placeHolder}>
        <div className={styles.btnContainer}>
          <div className={styles.previewBtn} onClick={()=>setPreview(id)}>Preview</div>
          <div className={styles.editBtn} onClick={handleModal}>Edit</div>
        </div>
      </div>
      <div className={styles.cardHeading} style={desc ? {fontSize : 14} : {fontSize: 12}}>{name}</div>
      <div className={styles.cardDesc}>{desc}</div>
    </div>
  )
}

export default TemplateCard