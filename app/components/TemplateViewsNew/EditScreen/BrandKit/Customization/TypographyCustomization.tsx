import React, { useState } from 'react'
import styles from './typography.style.module.css'
import ColorPicker from './ColorPicker'

interface Props {
    extractedColors: string[]
    setFontSettings: React.Dispatch<React.SetStateAction<FontSettingsState>>;
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

const TypographyCustomization = ({ extractedColors, setFontSettings }: Props) => {
    const [selectedType, setSelectedType] = useState("heading")
    const [heading, setHeading] = useState({
        fontColor: "#000000", fontSize: 24, fontFamily: "Arial", fontWeight
            : "bolder"
    })
    const [subHeading, setSubHeading] = useState({ fontColor: "#000000", fontSize: 16, fontFamily: "Verdana", fontWeight: "normal" })
    const [body, setBody] = useState({ fontColor: "#000000", fontSize: 14, fontFamily: "Tahoma", fontWeight: "nroaml" })

    const fontsList = ["Arial", "Verdana", "Tahoma", "Trebuchet MS", "Times New Roman", "Georgia", "Garamond", "Courier New", "Brush Script"]

    const fontStyleList = ["normal", "bold", "bolder", "lighter"]

    const [familyDropdownOpen, setFamilyDropdownOpen] = useState(false);
    const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);

    const handleCheckboxChange = (value: string) => {
        setSelectedType(value);
    };

    const handleFontChange = (font: string) => {
        if (selectedType === "heading") {
            setHeading((prev) => ({ ...prev, fontFamily: font }));
        } else if (selectedType === "subheading") {
            setSubHeading((prev) => ({ ...prev, fontFamily: font }));
        } else setBody((prev) => ({ ...prev, fontFamily: font }));
    }

    const handleFontStyleChange = (style: string) => {
        if (selectedType === "heading") {
            setHeading((prev) => ({ ...prev, fontWeight: style }));
        } else if (selectedType === "subheading") {
            setSubHeading((prev) => ({ ...prev, fontWeight: style }));
        } else setBody((prev) => ({ ...prev, fontWeight: style }));
    }

    const handleFontColorChange = (color: any) => {
        if (selectedType === "heading") {
            setHeading((prev) => ({ ...prev, fontColor: color.hex }));
        } else if (selectedType === "subheading") {
            setSubHeading((prev) => ({ ...prev, fontColor: color.hex }));
        } else setBody((prev) => ({ ...prev, fontColor: color.hex }));
    }

    const handleIncreaseFontsize = () => {
        if (selectedType === "heading") {
            let size = heading.fontSize + 1;
            setHeading((prev) => ({ ...prev, fontSize: size }));
        } else if (selectedType === "subheading") {
            let size = subHeading.fontSize + 1;
            setSubHeading((prev) => ({ ...prev, borderRadius: size }));
        } else {
            let size = body.fontSize + 1;
            setBody((prev) => ({ ...prev, borderRadius: size }));
        }
    }
    const handleDecreaseFontsize = () => {
        if (selectedType === "heading") {
            let size = heading.fontSize;
            if (size != 0) {
                setHeading((prev) => ({ ...prev, fontSize: size - 1 }));
            }

        } else if (selectedType === "subheading") {
            let size = subHeading.fontSize;
            if (size != 0) {
                setSubHeading((prev) => ({ ...prev, borderRadius: size - 1 }));
            }
        } else {
            let size = body.fontSize;
            if (size != 0) {
                setBody((prev) => ({ ...prev, borderRadius: size - 1 }));
            }
        }
    }

    return (
        <div className={styles.body}>
            <div className={styles.headingContainer}>
                <div className={styles.heading}>Typography Customisations</div>
                <div className={styles.subheading}>Select or customise your text components</div>
            </div>
            <div className={styles.editContainer}>
                <div className={styles.textPreviewContainer}>
                    {selectedType === "heading" ? <div className={styles.headingPreview} style={{ color: heading.fontColor, fontSize: heading.fontSize, fontFamily: heading.fontFamily, fontWeight: heading.fontWeight }}>HEADING</div>
                        : selectedType === "subheading" ? <div className={styles.subHeadingPreview} style={{ color: subHeading.fontColor, fontSize: subHeading.fontSize, fontFamily: subHeading.fontFamily, fontWeight: subHeading.fontWeight }}>Sub Heading</div>
                            : <div className={styles.bodyPreview} style={{ color: body.fontColor, fontSize: body.fontSize, fontFamily: body.fontFamily, fontWeight: body.fontWeight }}>Body</div>}
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
                            checked={selectedType === "Body"}
                            onChange={() => handleCheckboxChange("Body")}
                        />
                        <span className={styles.customCheckbox}></span>
                        <span className={styles.checkboxLabel}>Body</span>
                    </label>
                </div>
                <div className={styles.line}></div>
                <div className={styles.familyColorContainer}>
                    <div className={styles.fontFamilyContainer}>
                        <div className={styles.heading}>Font Family</div>
                        <FontFamilyIcon />
                        <div className={styles.dropDownContainer} onClick={() => setFamilyDropdownOpen(!familyDropdownOpen)}>
                            <div className={styles.display}>{selectedType === "heading" ? heading.fontFamily : selectedType === "subheading" ? subHeading.fontFamily : body.fontFamily}</div>
                            <DownIcon />
                            {familyDropdownOpen && <div className={styles.dropDown}>
                                {fontsList.map((font, key) => (
                                    <div className={styles.dropdownFont} onClick={() => handleFontChange(font)}>{font}</div>
                                ))}
                            </div>}
                        </div>
                    </div>
                    <ColorPicker heading='Font Colour' color={selectedType === "heading" ? heading.fontColor : selectedType === "subheaing" ? subHeading.fontColor : body.fontColor}
                        extractedColors={extractedColors}
                        // setColor={(color) => {
                        //     if (selectedType === "heading") {
                        //         setHeading((prev) => ({ ...prev, fontColor: color }));
                        //     } else if (selectedType === "subheading") {
                        //         setSubHeading((prev) => ({ ...prev, fontColor: color }));
                        //     } else {
                        //         setBody((prev) => ({ ...prev, fontColor: color }));
                        //     }
                        // }}
                        handleChange={handleFontColorChange}
                    />
                </div>
                <div className={styles.fontSizeStyleContainer}>
                    <div className={styles.fontSizeContainer}>
                        <div className={styles.heading}>Font Size</div>
                        <FontSizeIcon />
                        <div className={styles.sizeContainer}>
                            <div className={styles.display}>{selectedType === "heading" ? `${heading.fontSize}px` : selectedType === "subheading" ? `${subHeading.fontSize}px` : `${body.fontSize}px`}</div>
                        </div>
                        <div className={styles.arrows}>
                            <div onClick={handleIncreaseFontsize}><UpIcon /></div>
                            <div onClick={handleDecreaseFontsize}><DownIcon /></div>
                        </div>
                    </div>
                    <div className={styles.fontStyleContainer}>
                        <div className={styles.heading}>Font Weight</div>
                        <FontStyleIcon />
                        <div className={styles.dropDownContainer} onClick={() => setStyleDropdownOpen(!styleDropdownOpen)}>
                            <div className={styles.display}>{selectedType === "heading" ? heading.fontWeight : selectedType === "subheading" ? subHeading.fontWeight : body.fontWeight}</div>
                            <DownIcon />
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
export default TypographyCustomization