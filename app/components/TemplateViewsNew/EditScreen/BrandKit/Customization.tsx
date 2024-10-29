import React from 'react'
import styles from './customization.style.module.css'
import CardCustomization from './CustomizeComponents/CardCustomization'
import ButtonCustomization from './CustomizeComponents/ButtonCustomization'
import TypographyCustomization from './CustomizeComponents/TypographyCustomization'
import CardStyles from './CustomizeComponents/CardStyles'
import BrandKit from './CustomizeComponents/BrandKit'
import { ButtonSettingsState } from '@/types/buttoncustomizetypes'

interface EditScreenProps {
  extractedColors: string[]
  setExtractedColors: (value: string[]) => void
  setCardBgColor: React.Dispatch<React.SetStateAction<string>>;
  setCardBorderRadius: React.Dispatch<React.SetStateAction<number>>;
  setFontSettings: React.Dispatch<React.SetStateAction<FontSettingsState>>;
  setButtonSettings: React.Dispatch<React.SetStateAction<ButtonSettingsState>>;
  buttonSettings: ButtonSettingsState
  cardBgColor: string
  fontSettings: FontSettingsState
  cardBorderRadius: number;
  cardStyle: string;
  setCardStyle: React.Dispatch<React.SetStateAction<string>>;
  setSelectedBtn: (value: "primary" | "secondary") => void
  selectedBtn: "primary" | "secondary"
  handleUpdateCustomization: () => Promise<void>;
  selectedTemplate:string
}

interface FontSettings {
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  fontWeight: string;
}

interface FontSettingsState {
  heading: FontSettings;
  subheading: FontSettings;
  body: FontSettings;
}


const Customization = ({ extractedColors, setExtractedColors, setCardBgColor, setCardBorderRadius, fontSettings, setFontSettings, setButtonSettings, cardBorderRadius, cardBgColor, buttonSettings, cardStyle, setCardStyle, setSelectedBtn, selectedBtn, handleUpdateCustomization,selectedTemplate }: EditScreenProps) => {

  const handleUpdate = async () => {
    handleUpdateCustomization()
  }
  console.log("selectedTemplate",selectedTemplate)
  return (
    <div className={styles.body}>
      <div className={styles.headerContainer}>
        <div>Appearance</div>
        <button onClick={handleUpdate}>Apply</button>
      </div>
      <div className={styles.brandKit}>
        <BrandKit setFontSettings={setFontSettings} setCardBgColor={setCardBgColor} extractedColors={extractedColors} setExtractedColors={setExtractedColors} flex />
      </div>
      {
        selectedTemplate ==="ST" ? <></>: <div className={styles.cardStylesContainer}>
        <CardStyles cardStyle={cardStyle} setCardStyle={setCardStyle} />
      </div>
      }
     
      <div className={styles.line}></div>
      <div className={styles.cardCustomizationContainer}>
        <CardCustomization cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} setCardBgColor={setCardBgColor} setCardBorderRadius={setCardBorderRadius} extractedColors={extractedColors} />
      </div>
      <div className={styles.line}></div>
      <div className={styles.fontCustomizationContainer}>
        <TypographyCustomization fontSettings={fontSettings} setFontSettings={setFontSettings} extractedColors={extractedColors} />
      </div>
      <div className={styles.line}></div>
      <div className={styles.buttonCustomizationContainer}>
        <ButtonCustomization selectedBtn={selectedBtn} setSelectedBtn={setSelectedBtn} buttonSettings={buttonSettings} setButtonSettings={setButtonSettings} extractedColors={extractedColors} />
      </div>

    </div>
  )
}

export default Customization