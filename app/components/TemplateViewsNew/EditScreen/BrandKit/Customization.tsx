import React from 'react'
import styles from './customization.style.module.css'
import LogoComponent from './CustomizeComponents/LogoComponent'
import BrandColor from './CustomizeComponents/BrandColor'
import CardCustomization from './CustomizeComponents/CardCustomization'
import ButtonCustomization from './CustomizeComponents/ButtonCustomization'
import TypographyCustomization from './CustomizeComponents/TypographyCustomization'
import CardStyles from './CustomizeComponents/CardStyles'
import BrandKit from './CustomizeComponents/BrandKit'

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
interface ButtonSettings {
  buttonColor: string;
  fontColor: string;
  borderRadius: number;
  borderColor: string;
  buttonText: string;
}
interface ButtonSettingsState {
  primary: ButtonSettings;
  secondary: ButtonSettings;
}

const Customization = ({ extractedColors, setExtractedColors, setCardBgColor, setCardBorderRadius, fontSettings, setFontSettings, setButtonSettings, cardBorderRadius, cardBgColor, buttonSettings, cardStyle, setCardStyle, setSelectedBtn,selectedBtn }: EditScreenProps) => {
  return (
    <div className={styles.body}>
      <div className={styles.headerContainer}>
        <div>Appearance</div>
        <button>Apply</button>
      </div>
      <div className={styles.brandKit}>
        <BrandKit extractedColors={extractedColors} setExtractedColors={setExtractedColors} />
      </div>
      <div className={styles.cardStylesContainer}>
        <CardStyles cardStyle={cardStyle} setCardStyle={setCardStyle} />
      </div>
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