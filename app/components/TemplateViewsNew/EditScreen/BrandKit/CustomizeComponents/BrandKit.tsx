import React, { useState } from 'react'
import styles from './brandkit.style.module.css'
import Customization from '../Customization'
import Themes from '../Themes/Themes'

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
interface EditScreenProps {
    setCardBgColor: React.Dispatch<React.SetStateAction<string>>;
    setCardBorderRadius: React.Dispatch<React.SetStateAction<number>>;
    setFontSettings: React.Dispatch<React.SetStateAction<FontSettingsState>>;
    setButtonSettings : React.Dispatch<React.SetStateAction<ButtonSettingsState>>;
    buttonSettings : ButtonSettingsState
    cardBgColor : string
    cardBorderRadius : number;
    fontSettings : FontSettingsState
    cardStyle : string;
    setCardStyle : React.Dispatch<React.SetStateAction<string>>;
}

const BrandKit = ({setFontSettings, setCardBorderRadius, setCardBgColor, setButtonSettings, cardBorderRadius, cardBgColor, buttonSettings,fontSettings,cardStyle, setCardStyle} : EditScreenProps) => {

    // const [selectedBtn, setSelectedBtn] = useState<string>("customization")
    // const [extractedColors, setExtractedColors] = useState<string[]>(["#843DF8", "#424FDF", "#1A56F3", "#3097F5", "#0785A2"])
    return (
        <div className={styles.body}>
        </div>
    )
}

export default BrandKit