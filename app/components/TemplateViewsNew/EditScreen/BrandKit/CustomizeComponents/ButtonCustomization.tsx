import React, { useState } from 'react'
import styles from './buttoncustom.style.module.css'
import ColorPicker from './ColorPicker';
import { useTheme } from '@/context';
import { ButtonSettingsState } from '@/types/buttoncustomizetypes';

interface Props {
    extractedColors: string[]
    setButtonSettings: React.Dispatch<React.SetStateAction<ButtonSettingsState>>;
    buttonSettings: ButtonSettingsState
    setSelectedBtn: (value: "primary" | "secondary") => void
    selectedBtn: "primary" | "secondary"
}

const ButtonCustomization = ({ extractedColors, setButtonSettings, buttonSettings, setSelectedBtn, selectedBtn }: Props) => {
    const [accordian, setAccordian] = useState<boolean>(false)

    const handleCheckboxChange = () => {
        setSelectedBtn(selectedBtn === "primary" ? "secondary" : "primary");
    };
    const { theme } = useTheme()
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

    // Hexinput methods are for the Input color code feature
    const handleBtnHexInputChange = (hexColor: string) => {
        setButtonSettings(prevSettings => ({
            ...prevSettings,
            [selectedBtn]: {
                ...prevSettings[selectedBtn],
                buttonColor: hexColor,
            },
        }));
    };

    const handleFontHexInputChange = (hexColor: string) => {
        setButtonSettings(prevSettings => ({
            ...prevSettings,
            [selectedBtn]: {
                ...prevSettings[selectedBtn],
                fontColor: hexColor,
            },
        }));
    };

    const handleBorderHexInputChange = (hexColor: string) => {
        setButtonSettings(prevSettings => ({
            ...prevSettings,
            [selectedBtn]: {
                ...prevSettings[selectedBtn],
                borderColor: hexColor,
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
    const handleInputRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        // const newRadius = parseInt(value, 10);

        if (!isNaN(value) && value >= 0) {
            setButtonSettings((prevSettings) => ({
                ...prevSettings,
                [selectedBtn]: {
                    ...prevSettings[selectedBtn],
                    borderRadius: value,
                },
            }));
        }
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
            <div className={styles.header} onClick={() => setAccordian(!accordian)}>
                <div className={styles.headingContainer}>
                    <div className={styles.heading}>Button Customisations</div>
                    <div className={styles.subheading}>Select or customise your button components</div>
                </div>
                {accordian ?
                    <div className={styles.btn} onClick={() => setAccordian(false)}><UpArrow height='6' width='10'/></div> : <div className={styles.btn} onClick={() => setAccordian(true)}><DownArrow height='6' width='10'/></div>}
            </div>
            {accordian && <div className={styles.editContainer} >
                <div className={styles.btnPreviewContainer}>
                    {selectedBtn === "primary" ? <button style={{ color: buttonSettings.primary.fontColor, backgroundColor: buttonSettings.primary.buttonColor, borderRadius: buttonSettings.primary.borderRadius, borderColor: buttonSettings.primary.borderColor }} className={styles.primaryPreview}>{buttonSettings.primary.buttonText}</button>
                        : <button style={{ color: buttonSettings.secondary.fontColor, borderRadius: buttonSettings.secondary.borderRadius, borderColor: buttonSettings.secondary.borderColor }} className={styles.secondaryPreview}>{buttonSettings.secondary.buttonText}</button>}
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
                <div className={styles.colorsContainer}>
                    <div className={styles.btnAndBorderColorContainer}>
                        <div className={styles.btnColorContainer}>
                            <ColorPicker
                                color={buttonSettings.primary.buttonColor}
                                extractedColors={extractedColors}
                                heading="Button Colour"
                                handleChange={handleBtnColorChange}
                                handleHexInputChange={handleBtnHexInputChange}
                            />
                        </div>
                        <div>
                            <ColorPicker
                                color={selectedBtn === "primary" ? buttonSettings.primary.borderColor : buttonSettings.secondary.borderColor}
                                extractedColors={extractedColors}
                                heading="Border Colour"
                                handleChange={handleBorderColorChange}
                                handleHexInputChange={handleBorderHexInputChange}
                            />
                        </div>
                    </div>
                    <div className={styles.fontColorBorderRadiusContainer}>
                        <ColorPicker
                            color={selectedBtn === "primary" ? buttonSettings.primary.fontColor : buttonSettings.secondary.fontColor}
                            extractedColors={extractedColors}
                            heading="Font Colour"
                            handleChange={handleFontColorChange}
                            handleHexInputChange={handleFontHexInputChange}
                        />
                        <div className={styles.radiusContainer}>
                            <div className={styles.heading}>Border Radius</div>
                            <RadiusIcon />
                            <div className={styles.inputContainer}>
                                <input className={styles.radiusValue} value={selectedBtn === "primary" ? buttonSettings.primary.borderRadius : buttonSettings.secondary.borderRadius} maxLength={2} onChange={(e) => handleInputRadiusChange(e)} />
                                <span>px</span>
                            </div>
                            <div className={styles.arrows}>
                                <div onClick={handleIncreaseRadius}><UpArrow height='4' width='8' /></div>
                                <div onClick={handleDecreaseRadius}><DownArrow height='4' width='8'/></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.btnTextContainer}>
                    <div className={styles.heading}>Button Text</div>
                    <TextIcon />
                    <input type="text" value={selectedBtn === "primary" ? buttonSettings.primary.buttonText : buttonSettings.secondary.buttonText} onChange={handleTextChange} maxLength={25} />
                </div>
            </div>}
        </div>
    )
}

export default ButtonCustomization

interface IconProps {
    height?: string;
    width?: string;
}

function RadiusIcon() {
    return (
        <svg width="15" height="8" viewBox="0 0 15 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.75 7C13.75 3.54813 10.9519 0.75 7.5 0.75C4.04813 0.75 1.25 3.54813 1.25 7" stroke="currentColor" stroke-width="0.9375" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}
function UpArrow({ height, width }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.52876 0.529741C4.65378 0.40476 4.82332 0.334549 5.0001 0.334549C5.17687 0.334549 5.34641 0.40476 5.47143 0.529741L9.24276 4.30107C9.30644 4.36257 9.35723 4.43613 9.39216 4.51747C9.4271 4.59881 9.44549 4.68629 9.44626 4.77481C9.44703 4.86333 9.43017 4.95111 9.39664 5.03304C9.36312 5.11497 9.31362 5.18941 9.25103 5.252C9.18843 5.3146 9.114 5.3641 9.03207 5.39762C8.95014 5.43114 8.86235 5.44801 8.77383 5.44724C8.68531 5.44647 8.59783 5.42808 8.51649 5.39314C8.43516 5.3582 8.36159 5.30741 8.3001 5.24374L5.0001 1.94374L1.7001 5.24374C1.57436 5.36518 1.40596 5.43238 1.23116 5.43086C1.05637 5.42934 0.889156 5.35922 0.765551 5.23562C0.641946 5.11201 0.571833 4.94481 0.570313 4.77001C0.568794 4.59521 0.635991 4.42681 0.757429 4.30107L4.52876 0.529741Z" fill="currentColor" />
        </svg>
    )
}
function DownArrow({ height, width }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.47124 5.47026C5.34622 5.59524 5.17668 5.66545 4.9999 5.66545C4.82313 5.66545 4.65359 5.59524 4.52857 5.47026L0.757237 1.69893C0.693563 1.63743 0.642775 1.56387 0.607836 1.48253C0.572896 1.40119 0.554505 1.31371 0.553736 1.22519C0.552967 1.13667 0.569835 1.04889 0.603355 0.966957C0.636876 0.885027 0.686378 0.810592 0.748973 0.747996C0.811568 0.685401 0.886003 0.635899 0.967934 0.602379C1.04986 0.568858 1.13765 0.55199 1.22617 0.55276C1.31469 0.553529 1.40217 0.57192 1.48351 0.606859C1.56484 0.641798 1.63841 0.692586 1.6999 0.75626L4.9999 4.05626L8.2999 0.75626C8.42564 0.634821 8.59404 0.567625 8.76884 0.569144C8.94363 0.570663 9.11084 0.640775 9.23445 0.76438C9.35805 0.887986 9.42817 1.05519 9.42969 1.22999C9.43121 1.40479 9.36401 1.57319 9.24257 1.69893L5.47124 5.47026Z" fill="currentColor" />
        </svg>

    )
}
function TextIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.1875 0.875H1.8125C1.29473 0.875 0.875 1.29473 0.875 1.8125V11.1875C0.875 11.7053 1.29473 12.125 1.8125 12.125H11.1875C11.7053 12.125 12.125 11.7053 12.125 11.1875V1.8125C12.125 1.29473 11.7053 0.875 11.1875 0.875Z" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round" />
            <path d="M3.99951 4.9375V4H8.99951V4.9375M5.87451 9.625H7.12451M6.49951 4.625V9.625" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}