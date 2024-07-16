import React from 'react'
import styles from './customization.style.module.css'
import LogoComponent from './LogoComponent'
import BrandColor from './BrandColor'
import CardCustomization from './CardCustomization'
import ButtonCustomization from './ButtonCustomization'
import TypographyCustomization from './TypographyCustomization'

interface Props{
  extractedColors : string[]
  setExtractedColors : (value : string[])=>void
}

const Customization = ({extractedColors, setExtractedColors} : Props) => {
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
          <BrandColor setExtractedColors={setExtractedColors} extractedColors={extractedColors}/>
        </div>
        <div className={styles.line}></div>
        <div className={styles.cardCustomizationContainer}>
          <CardCustomization extractedColors={extractedColors}/>
        </div>
        <div className={styles.line}></div>
        <div className={styles.buttonCustomizationContainer}>
          <ButtonCustomization extractedColors={extractedColors}/>
        </div>
        <div className={styles.line}></div>
        <div className={styles.fontCustomizationContainer}>
          <TypographyCustomization extractedColors={extractedColors}/>
        </div>
    </div>
  )
}

export default Customization