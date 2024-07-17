import React from 'react'
import styles from './theme.style.module.css'
import KitCard from './KitCard'

interface Props{
  extractedColors : string[]
}

const Themes = ({extractedColors} : Props) => {
  return (

    // API FOR KITS WILL BE CALLED

    <div className={styles.body}>
      <div className={styles.headerContainer}>
        <div className={styles.heading}>My Custom Kits <span className={styles.count}>0</span></div>
        <button>Create Kit</button>
      </div>
      <div className={styles.line}></div>
      <div className={styles.yourKits}>
        <KitCard extractedColors={extractedColors}/>
        <KitCard/>
        <KitCard/>
      </div>
      <div className={styles.line}></div>
    </div>
  )
}

export default Themes