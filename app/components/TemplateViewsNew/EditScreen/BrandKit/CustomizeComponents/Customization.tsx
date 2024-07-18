import React from 'react'
import styles from './customization.style.module.css'
import LogoComponent from './LogoComponent'
import BrandColor from './BrandColor'
import CardCustomization from './CardCustomization'
import ButtonCustomization from './ButtonCustomization'
import TypographyCustomization from './TypographyCustomization'

interface EditScreenProps {
  extractedColors: string[]
  setExtractedColors: (value: string[]) => void
  setCardBgColor: React.Dispatch<React.SetStateAction<string>>;
  setCardBorderRadius: React.Dispatch<React.SetStateAction<number>>;
  setFontSettings: React.Dispatch<React.SetStateAction<FontSettingsState>>;
  setButtonSettings : React.Dispatch<React.SetStateAction<ButtonSettingsState>>;
  buttonSettings : ButtonSettingsState
  cardBgColor : string
  fontSettings : FontSettingsState
  cardBorderRadius : number;
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
interface ButtonSettings{
  buttonColor : string;
  fontColor : string;
  borderRadius : number;
  borderColor : string;
  buttonText : string;
}
interface ButtonSettingsState{
  primary : ButtonSettings;
  secondary : ButtonSettings;
}

const Customization = ({ extractedColors, setExtractedColors, setCardBgColor, setCardBorderRadius,fontSettings, setFontSettings,setButtonSettings, cardBorderRadius,cardBgColor, buttonSettings  }: EditScreenProps) => {
  return (
    <div className={styles.body}>
      <div className={styles.headerContainer}>
        <div>Appearance</div>
        <button>Apply</button>
      </div>
      <div className={styles.line}></div>
      {/* <div className={styles.logoContainer}>
        <LogoComponent />
      </div> */}
      {/* <div className={styles.line}></div> */}
      {/* <div className={styles.brandColorContainer}>
        <BrandColor setExtractedColors={setExtractedColors} extractedColors={extractedColors} />
      </div> */}
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
        <ButtonCustomization buttonSettings={buttonSettings} setButtonSettings={setButtonSettings} extractedColors={extractedColors} />
      </div>

    </div>
  )
}

export default Customization