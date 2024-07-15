import React from 'react'
import styles from './customization.style.module.css'
import LogoComponent from './LogoComponent'

const Customization = () => {
  return (
    <div className={styles.body}>
        <div className={styles.headerContainer}>
            <div>Appearance</div>
            <button>Save Kit</button>
        </div>
        <div className={styles.line}></div>
        <div className={styles.logoContainer}>
          <LogoComponent/>
        </div>
        <div className={styles.line}></div>
        <div className={styles.brandColorContainer}>

        </div>
        <div className={styles.line}></div>
        <div className={styles.cardCustomizationContainer}>

        </div>
        <div className={styles.line}></div>
        <div className={styles.buttonCustomizationContainer}>

        </div>
        <div className={styles.line}></div>
        <div className={styles.fontCustomizationContainer}>

        </div>
    </div>
  )
}

export default Customization