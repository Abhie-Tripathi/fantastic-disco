import React, { useState } from 'react'
import styles from './typography.style.module.css'
import ColorPicker from './ColorPicker'

interface Props {
    extractedColors: string[]
    setFontSettings: React.Dispatch<React.SetStateAction<FontSettingsState>>;
    fontSettings: FontSettingsState
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

const TypographyCustomization = ({ extractedColors, setFontSettings, fontSettings }: Props) => {
    const [selectedType, setSelectedType] = useState<"heading" | "subheading" | "body">("heading");

    const [heading, setHeading] = useState({
        fontColor: "#000000", fontSize: 24, fontFamily: "Arial", fontWeight
            : "bolder"
    })
    const [subHeading, setSubHeading] = useState({ fontColor: "#000000", fontSize: 16, fontFamily: "Verdana", fontWeight: "normal" })
    const [body, setBody] = useState({ fontColor: "#000000", fontSize: 14, fontFamily: "Tahoma", fontWeight: "nroaml" })

    const fontsList = ["Arial", "Verdana", "Tahoma", "Trebuchet MS", "Times New Roman", "Georgia", "Garamond", "Courier New", "Brush Script"]

    const fontStyleList = ["normal", "bold"]

    const [familyDropdownOpen, setFamilyDropdownOpen] = useState(false);
    const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);

    const handleCheckboxChange = (value: string) => {
        setSelectedType(value as "heading" | "subheading" | "body");
    };

    const handleFontChange = (font: string) => {
        setFontSettings((prevSettings) => ({
            ...prevSettings,
            [selectedType]: {
                ...prevSettings[selectedType],
                fontFamily: font,
            }
        }));
    };

    const handleFontStyleChange = (style: string) => {
        setFontSettings((prevSettings) => ({
            ...prevSettings,
            [selectedType]: {
                ...prevSettings[selectedType],
                fontWeight: style,
            }
        }));
    };

    const handleFontColorChange = (color: any) => {
        setFontSettings((prevSettings) => ({
            ...prevSettings,
            [selectedType]: {
                ...prevSettings[selectedType],
                fontColor: color.hex,
            }
        }));
    };

    const handleIncreaseFontSize = () => {
        setFontSettings((prevSettings) => ({
            ...prevSettings,
            [selectedType]: {
                ...prevSettings[selectedType],
                fontSize: prevSettings[selectedType].fontSize + 1,
            }
        }));
    };

    const handleDecreaseFontSize = () => {
        setFontSettings((prevSettings) => ({
            ...prevSettings,
            [selectedType]: {
                ...prevSettings[selectedType],
                fontSize: prevSettings[selectedType].fontSize > 0 ? prevSettings[selectedType].fontSize - 1 : 0,
            }
        }));
    };


    return (
        <div className={styles.body}>
            <div className={styles.headingContainer}>
                <div className={styles.heading}>Typography Customisations</div>
                <div className={styles.subheading}>Select or customise your text components</div>
            </div>
            <div className={styles.editContainer}>
                <div className={styles.textPreviewContainer}>
                    {selectedType === "heading" ? <div className={styles.headingPreview} style={{ color: fontSettings.heading.fontColor, fontSize: fontSettings.heading.fontSize, fontFamily: fontSettings.heading.fontFamily, fontWeight: fontSettings.heading.fontWeight }}>HEADING</div>
                        : selectedType === "subheading" ? <div className={styles.subHeadingPreview} style={{ color: fontSettings.subheading.fontColor, fontSize: fontSettings.subheading.fontSize, fontFamily: fontSettings.subheading.fontFamily, fontWeight: fontSettings.subheading.fontWeight }}>Sub Heading</div>
                            : <div className={styles.bodyPreview} style={{ color: fontSettings.body.fontColor, fontSize: fontSettings.body.fontSize, fontFamily: fontSettings.body.fontFamily, fontWeight: fontSettings.body.fontWeight }}>Body</div>}
                </div>
                <div className={styles.btnOptions}>
                    <label className={styles.checkboxContainer}>
                        <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={selectedType === "heading"}
                            onChange={() => handleCheckboxChange("heading")}
                        />
                        <span className={styles.customCheckbox}></span>
                        <span className={styles.checkboxLabel}>Heading</span>
                    </label>
                    <label className={styles.checkboxContainer}>
                        <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={selectedType === "subheading"}
                            onChange={() => handleCheckboxChange("subheading")}
                        />
                        <span className={styles.customCheckbox}></span>
                        <span className={styles.checkboxLabel}>Sub Heading</span>
                    </label>
                    <label className={styles.checkboxContainer}>
                        <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={selectedType === "body"}
                            onChange={() => handleCheckboxChange("body")}
                        />
                        <span className={styles.customCheckbox}></span>
                        <span className={styles.checkboxLabel}>Body</span>
                    </label>
                </div>
                <div className={styles.line}></div>
                <div className={styles.customizeContainer}>
                    <div className={styles.fontFamilySizeContainer}>
                        <div className={styles.fontFamilyContainer}>
                            <div className={styles.heading}>Font Family</div>
                            <FontFamilyIcon />
                            <div className={styles.dropDownContainer} onClick={() => setFamilyDropdownOpen(!familyDropdownOpen)}>
                                <div className={styles.display}>{selectedType === "heading" ? fontSettings.heading.fontFamily : selectedType === "subheading" ? fontSettings.subheading.fontFamily : fontSettings.body.fontFamily}</div>
                                <DownArrow />
                                {familyDropdownOpen && <div className={styles.dropDown}>
                                    {fontsList.map((font, key) => (
                                        <div key={key} className={styles.dropdownFont} onClick={() => handleFontChange(font)}>{font}</div>
                                    ))}
                                </div>}
                            </div>
                        </div>
                        <div className={styles.fontSizeContainer}>
                            <div className={styles.heading}>Font Size</div>
                            <FontSizeIcon />
                            <div className={styles.sizeContainer}>
                                <div className={styles.display}>{selectedType === "heading" ? `${fontSettings.heading.fontSize}px` : selectedType === "subheading" ? `${fontSettings.subheading.fontSize}px` : `${fontSettings.body.fontSize}px`}</div>
                            </div>
                            <div className={styles.arrows}>
                                <div onClick={handleIncreaseFontSize}><UpArrow /></div>
                                <div onClick={handleDecreaseFontSize}><DownArrow /></div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.fontColorWeightContainer}>
                        <div className={styles.fontColorContainer}>
                            <ColorPicker heading='Font Colour' color={selectedType === "heading" ? fontSettings.heading.fontColor : selectedType === "subheading" ? fontSettings.subheading.fontColor : fontSettings.body.fontColor}
                                extractedColors={extractedColors}
                                handleChange={handleFontColorChange}
                            />
                        </div>
                        <div className={styles.fontStyleContainer}>
                            <div className={styles.heading}>Font Weight</div>
                            <FontStyleIcon />
                            <div className={styles.dropDownContainer} onClick={() => setStyleDropdownOpen(!styleDropdownOpen)}>
                                <div className={styles.display}>{selectedType === "heading" ? fontSettings.heading.fontWeight : selectedType === "subheading" ? fontSettings.subheading.fontWeight : fontSettings.body.fontWeight}</div>
                                <DownArrow />
                                {styleDropdownOpen && <div className={styles.dropDown}>
                                    {fontStyleList.map((style, key) => (
                                        <div key={key} className={styles.dropdownFont} onClick={() => handleFontStyleChange(style)}>{style}</div>
                                    ))}
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function FontStyleIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.0417 3.66667H12.1667V12.1667H12.875V12.875H10.0417V12.1667H10.75V10.0417H7.91667L6.85417 12.1667H7.91667V12.875H5.08333V12.1667H5.79167L10.0417 3.66667ZM10.75 4.375L8.27083 9.33333H10.75V4.375ZM1.54167 0.125H5.08333C5.86958 0.125 6.5 0.755417 6.5 1.54167V9.33333H4.375V5.79167H2.25V9.33333H0.125V1.54167C0.125 0.755417 0.755417 0.125 1.54167 0.125ZM2.25 1.54167V4.375H4.375V1.54167H2.25Z" fill="black" />
        </svg>

    )
}
function FontFamilyIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 6H6V8H4V14H2V8H0V6ZM14 2H10.0664V14H7.93359V2H4V0H14V2Z" fill="black" />
        </svg>
    )
}
function FontSizeIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.6666 3.00065L10.6666 0.333984L8.66659 3.00065H9.99992V5.66732H8.66659L10.6666 8.33398L12.6666 5.66732H11.3333V3.00065H12.6666ZM4.20459 1.66732L0.20459 12.334H1.62926L2.87926 9.00065H7.12126L8.37126 12.334H9.79592L5.79592 1.66732H4.20459ZM3.37859 7.66732L4.99992 3.34398L6.62126 7.66732H3.37859Z" fill="black" />
        </svg>
    )
}
function UpArrow() {
    return (
        <svg width="8" height="4" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.52876 0.529741C4.65378 0.40476 4.82332 0.334549 5.0001 0.334549C5.17687 0.334549 5.34641 0.40476 5.47143 0.529741L9.24276 4.30107C9.30644 4.36257 9.35723 4.43613 9.39216 4.51747C9.4271 4.59881 9.44549 4.68629 9.44626 4.77481C9.44703 4.86333 9.43017 4.95111 9.39664 5.03304C9.36312 5.11497 9.31362 5.18941 9.25103 5.252C9.18843 5.3146 9.114 5.3641 9.03207 5.39762C8.95014 5.43114 8.86235 5.44801 8.77383 5.44724C8.68531 5.44647 8.59783 5.42808 8.51649 5.39314C8.43516 5.3582 8.36159 5.30741 8.3001 5.24374L5.0001 1.94374L1.7001 5.24374C1.57436 5.36518 1.40596 5.43238 1.23116 5.43086C1.05637 5.42934 0.889156 5.35922 0.765551 5.23562C0.641946 5.11201 0.571833 4.94481 0.570313 4.77001C0.568794 4.59521 0.635991 4.42681 0.757429 4.30107L4.52876 0.529741Z" fill="black" />
        </svg>
    )
}
function DownArrow() {
    return (
        <svg width="8" height="4" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.47124 5.47026C5.34622 5.59524 5.17668 5.66545 4.9999 5.66545C4.82313 5.66545 4.65359 5.59524 4.52857 5.47026L0.757237 1.69893C0.693563 1.63743 0.642775 1.56387 0.607836 1.48253C0.572896 1.40119 0.554505 1.31371 0.553736 1.22519C0.552967 1.13667 0.569835 1.04889 0.603355 0.966957C0.636876 0.885027 0.686378 0.810592 0.748973 0.747996C0.811568 0.685401 0.886003 0.635899 0.967934 0.602379C1.04986 0.568858 1.13765 0.55199 1.22617 0.55276C1.31469 0.553529 1.40217 0.57192 1.48351 0.606859C1.56484 0.641798 1.63841 0.692586 1.6999 0.75626L4.9999 4.05626L8.2999 0.75626C8.42564 0.634821 8.59404 0.567625 8.76884 0.569144C8.94363 0.570663 9.11084 0.640775 9.23445 0.76438C9.35805 0.887986 9.42817 1.05519 9.42969 1.22999C9.43121 1.40479 9.36401 1.57319 9.24257 1.69893L5.47124 5.47026Z" fill="black" />
        </svg>

    )
}
export default TypographyCustomization