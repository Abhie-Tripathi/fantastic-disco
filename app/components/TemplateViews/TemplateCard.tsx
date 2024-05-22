import React from 'react'
import styles from './templatecard.style.module.css'

interface TemplateCardProps {
  name: string;
  isHidden : boolean;
  id : string;
  setPreview: (id: string) => void;
  desc? : string;
}

const TemplateCard = ({ name, isHidden, id, setPreview, desc }: TemplateCardProps) => {
  return (
    <div className={`${styles.card} ${isHidden ? styles.hiddenCard : ""}`}>
      <div className={styles.placeHolder}>
        <div className={styles.previewBtnContainer}>
          <div className={styles.previewBtn} onClick={()=>setPreview(id)}>Preview</div>
        </div>
      </div>
      <div className={styles.cardHeading} style={desc ? {fontSize : 14} : {fontSize: 12}}>{name}</div>
      <div className={styles.cardDesc}>{desc}</div>
    </div>
  )
}

export default TemplateCard