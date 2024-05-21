import React from 'react'
import styles from './templatecard.style.module.css'

interface TemplateCardProps {
  name: string;
  isHidden : boolean;
  id : string;
  setPreview: (id: string) => void;
}

const TemplateCard = ({ name, isHidden, id, setPreview }: TemplateCardProps) => {
  return (
    <div className={`${styles.card} ${isHidden ? styles.hiddenCard : ""}`}>
      <div className={styles.placeHolder}>
        <div className={styles.previewBtnContainer}>
          <div className={styles.previewBtn} onClick={()=>setPreview(id)}>Preview</div>
        </div>
      </div>
      <div className={styles.cardHeading}>{name}</div>
    </div>
  )
}

export default TemplateCard