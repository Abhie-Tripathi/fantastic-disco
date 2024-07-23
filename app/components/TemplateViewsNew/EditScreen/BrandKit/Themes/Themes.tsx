import React from 'react'
import styles from './theme.style.module.css'
import KitCard from './KitCard'

interface Props {
  extractedColors: string[]
}

const Themes = ({ extractedColors }: Props) => {
  return (

    // API FOR KITS WILL BE CALLED

    <div className={styles.body}>
      <div className={styles.headerContainer}>
        <div className={styles.heading}>My Custom Kits <span className={styles.count}>0</span></div>
        <button>Create Kit</button>
      </div>
      <div className={styles.line}></div>
      <div className={styles.yourKits}>
        <KitCard backgroundColor="white" extractedColors={extractedColors} />
        <KitCard backgroundColor="white" />
        <KitCard backgroundColor="white" />
      </div>
      <div className={styles.line}></div>
      <div className={styles.headerContainer}>
        <div className={styles.heading}>System Themes <span className={styles.count}>0</span></div>
      </div>
      <div className={styles.themesContainer}>
        <KitCard backgroundColor="#F9F9FF" />
        <KitCard backgroundColor="#FFF5F5" />
        <KitCard backgroundColor="#FFF8ED" />
      </div>
    </div>
  )
}

export default Themes