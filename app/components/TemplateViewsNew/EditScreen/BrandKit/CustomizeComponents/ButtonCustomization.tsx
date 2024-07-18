import React, { useState } from 'react'
import styles from './buttoncustom.style.module.css'
import ColorPicker from './ColorPicker';

interface Props {
    extractedColors: string[]
    setButtonSettings: React.Dispatch<React.SetStateAction<ButtonSettingsState>>;
    buttonSettings: ButtonSettingsState
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
const ButtonCustomization = ({ extractedColors, setButtonSettings, buttonSettings }: Props) => {
    const [selectedBtn, setSelectedBtn] = useState<"primary" | "secondary">("primary");

    const handleCheckboxChange = () => {
        setSelectedBtn(selectedBtn === "primary" ? "secondary" : "primary");
    };
    const handleBtnColorChange = (color: any) => {
        setButtonSettings(prevSettings => ({
            ...prevSettings,
            [selectedBtn]: {
                ...prevSettings[selectedBtn],
                buttonColor: color.hex,
            },
        }));
    };

    const handleFontColorChange = (color: any) => {
        setButtonSettings(prevSettings => ({
            ...prevSettings,
            [selectedBtn]: {
                ...prevSettings[selectedBtn],
                fontColor: color.hex,
            },
        }));
    };
    const handleBorderColorChange = (color: any) => {
        setButtonSettings(prevSettings => ({
            ...prevSettings,
            [selectedBtn]: {
                ...prevSettings[selectedBtn],
                borderColor: color.hex,
            },
        }));
    };

    const handleIncreaseRadius = () => {
        setButtonSettings((prevSettings) => ({
            ...prevSettings,
            [selectedBtn]: {
                ...prevSettings[selectedBtn],
                borderRadius: prevSettings[selectedBtn].borderRadius + 1,
            }
        }));
    };
    const handleDecreaseRadius = () => {
        setButtonSettings((prevSettings) => ({
            ...prevSettings,
            [selectedBtn]: {
                ...prevSettings[selectedBtn],
                borderRadius: prevSettings[selectedBtn].borderRadius > 0 ? prevSettings[selectedBtn].borderRadius - 1 : 0,
            }
        }));
    };
    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newText = event.target.value;
        setButtonSettings((prevSettings) => ({
          ...prevSettings,
          [selectedBtn]: {
            ...prevSettings[selectedBtn],
            buttonText: newText,
          },
        }));
      };

    return (
        <div className={styles.body}>
            <div className={styles.headingContainer}>
                <div className={styles.heading}>Button Customisations</div>
                <div className={styles.subheading}>Select or customise your button components</div>
            </div>
            <div className={styles.editContainer}>
                <div className={styles.btnPreviewContainer}>
                    {selectedBtn === "primary" ? <button style={{ color: buttonSettings.primary.fontColor, backgroundColor: buttonSettings.primary.buttonColor, borderRadius: buttonSettings.primary.borderRadius, borderColor: buttonSettings.primary.borderColor }} className={styles.primaryPreview}>{buttonSettings.primary.buttonText}</button>
                        : <button style={{ color: buttonSettings.secondary.fontColor, backgroundColor: buttonSettings.secondary.buttonColor, borderRadius: buttonSettings.secondary.borderRadius, borderColor: buttonSettings.secondary.borderColor }} className={styles.secondaryPreview}>{buttonSettings.secondary.buttonText}</button>}
                </div>
                <div className={styles.btnOptions}>
                    <label className={styles.checkboxContainer}>
                        <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={selectedBtn === "primary"}
                            onChange={handleCheckboxChange}
                        />
                        <span className={styles.customCheckbox}></span>
                        <span className={styles.checkboxLabel}>Primary</span>
                    </label>
                    <label className={styles.checkboxContainer}>
                        <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={selectedBtn === "secondary"}
                            onChange={handleCheckboxChange}
                        />
                        <span className={styles.customCheckbox}></span>
                        <span className={styles.checkboxLabel}>Secondary</span>
                    </label>
                </div>
                <div className={styles.line}></div>
                <div className={styles.btnFontColorContainer}>
                    <ColorPicker
                        color={selectedBtn === "primary" ? buttonSettings.primary.buttonColor : buttonSettings.secondary.buttonColor}
                        extractedColors={extractedColors}
                        heading="Button Colour"
                        handleChange={handleBtnColorChange}
                    />
                    <ColorPicker
                        color={selectedBtn === "primary" ? buttonSettings.primary.fontColor : buttonSettings.secondary.fontColor}
                        extractedColors={extractedColors}
                        heading="Font Colour"
                        handleChange={handleFontColorChange}
                    />
                </div>
                <div className={styles.colorRadiusContainer}>
                    <ColorPicker
                        color={selectedBtn === "primary" ? buttonSettings.primary.borderColor : buttonSettings.secondary.borderColor}
                        extractedColors={extractedColors}
                        heading="Border Colour"
                        handleChange={handleBorderColorChange}
                    />
                    <div className={styles.radiusContainer}>
                        <div className={styles.heading}>Border Radius</div>
                        <RadiusIcon />
                        <div className={styles.radiusValue}>{selectedBtn === "primary" ? buttonSettings.primary.borderRadius : buttonSettings.secondary.borderRadius}px</div>
                        <div className={styles.arrows}>
                            <div onClick={handleIncreaseRadius}><UpIcon /></div>
                            <div onClick={handleDecreaseRadius}><DownIcon /></div>
                        </div>
                    </div>
                </div>
                <div className={styles.btnTextContainer}>
                    <div className={styles.heading}>Button Text</div>
                    <TextIcon/>
                    <input type="text" value={selectedBtn === "primary" ? buttonSettings.primary.buttonText : buttonSettings.secondary.buttonText} onChange={handleTextChange}/>
                </div>
            </div>
        </div>
    )
}

export default ButtonCustomization

function RadiusIcon() {
    return (
        <svg width="15" height="8" viewBox="0 0 15 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.75 7C13.75 3.54813 10.9519 0.75 7.5 0.75C4.04813 0.75 1.25 3.54813 1.25 7" stroke="black" stroke-width="0.9375" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}

function UpIcon() {
    return (
        <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.64659 0.146393C3.74035 0.0526578 3.86751 0 4.00009 0C4.13267 0 4.25983 0.0526578 4.35359 0.146393L7.18209 2.97489C7.27317 3.06919 7.32357 3.1955 7.32243 3.32659C7.32129 3.45769 7.2687 3.5831 7.176 3.6758C7.0833 3.76851 6.95789 3.82109 6.82679 3.82223C6.69569 3.82337 6.56939 3.77297 6.47509 3.68189L4.00009 1.20689L1.52509 3.68189C1.43079 3.77297 1.30449 3.82337 1.17339 3.82223C1.04229 3.82109 0.916885 3.76851 0.824181 3.6758C0.731477 3.5831 0.678892 3.45769 0.677753 3.32659C0.676614 3.1955 0.727011 3.06919 0.81809 2.97489L3.64659 0.146393Z" fill="black" />
        </svg>
    )
}

function DownIcon() {
    return (
        <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.35341 3.85361C4.25965 3.94734 4.13249 4 3.99991 4C3.86733 4 3.74017 3.94734 3.64641 3.85361L0.817909 1.02511C0.72683 0.930806 0.676433 0.804505 0.677572 0.673406C0.678711 0.542308 0.731296 0.416902 0.824 0.324198C0.916704 0.231493 1.04211 0.178909 1.17321 0.17777C1.30431 0.176631 1.43061 0.227028 1.52491 0.318107L3.99991 2.79311L6.47491 0.318107C6.56921 0.227028 6.69551 0.176631 6.82661 0.17777C6.95771 0.178909 7.08312 0.231493 7.17582 0.324198C7.26852 0.416902 7.32111 0.542308 7.32225 0.673406C7.32339 0.804505 7.27299 0.930806 7.18191 1.02511L4.35341 3.85361Z" fill="black" />
        </svg>
    )
}

function TextIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.1875 0.875H1.8125C1.29473 0.875 0.875 1.29473 0.875 1.8125V11.1875C0.875 11.7053 1.29473 12.125 1.8125 12.125H11.1875C11.7053 12.125 12.125 11.7053 12.125 11.1875V1.8125C12.125 1.29473 11.7053 0.875 11.1875 0.875Z" stroke="black" stroke-width="1.25" stroke-linejoin="round" />
            <path d="M3.99951 4.9375V4H8.99951V4.9375M5.87451 9.625H7.12451M6.49951 4.625V9.625" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}