import React from 'react'
import styles from './templatecard.style.module.css'

interface TemplateCardProps {
  name: string;
  isHidden : boolean;
}

const TemplateCard = ({ name, isHidden }: TemplateCardProps) => {
  return (
    <div className={`${styles.card} ${isHidden ? styles.hiddenCard : ""}`}>
      <div className={styles.placeHolder}>
        <div className={styles.previewBtnContainer}>
          <div className={styles.previewBtn}>Preview</div>
        </div>
      </div>
      <div className={styles.cardHeading}>{name}</div>

    </div>
  )
}

export default TemplateCard