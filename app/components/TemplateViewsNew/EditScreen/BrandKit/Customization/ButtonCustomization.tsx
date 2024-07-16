import React, { useState } from 'react'
import styles from './buttoncustom.style.module.css'
import ColorPicker from './ColorPicker';

const ButtonCustomization = () => {
    const [extractedColors, setExtractedColors] = useState(["#843DF8", "#424FDF", "#1A56F3", "#3097F5", "#0785A2"])
    const [selectedBtn, setSelectedBtn] = useState("primary");
    const [btnOne, setBtnOne] = useState({ btnColor: "#0072F5", borderColor: "#0072F5", borderRadius: 4, fontColor: "#000000" })
    const [btnTwo, setBtnTwo] = useState({ btnColor: "#6750a4", borderColor: "#6750a4", borderRadius: 4, fontColor: "#000000" })

    const handleCheckboxChange = (value: string) => {
        setSelectedBtn(value);
    };
    const handleBtnColorChange = (color: any) => {
        if (selectedBtn === "primary") {
            setBtnOne((prev) => ({ ...prev, btnColor: color.hex }));
        } else {
            setBtnTwo((prev) => ({ ...prev, btnColor: color.hex }));
        }
    };

    const handleFontColorChange = (color: any) => {
        if (selectedBtn === "primary") {
            setBtnOne((prev) => ({ ...prev, fontColor: color.hex }));
        } else {
            setBtnTwo((prev) => ({ ...prev, fontColor: color.hex }));
        }
    };
    const handleBorderColorChange = (color: any) => {
        if (selectedBtn === "primary") {
            setBtnOne((prev) => ({ ...prev, borderColor: color.hex }));
        } else {
            setBtnTwo((prev) => ({ ...prev, borderColor: color.hex }));
        }
    };

    const handleIncreaseRadius = () => {
        if (selectedBtn === "primary") {
            let radius = btnOne.borderRadius + 1;
            setBtnOne((prev) => ({ ...prev, borderRadius: radius }));
        } else {
            let radius = btnTwo.borderRadius + 1;
            setBtnTwo((prev) => ({ ...prev, borderRadius: radius }));
        }
    }
    const handleDecreaseRadius = () => {
        if (selectedBtn === "primary") {
            let radius = btnOne.borderRadius;
            if (radius != 0) {
                setBtnOne((prev) => ({ ...prev, borderRadius: radius - 1 }));
            }

        } else {
            let radius = btnTwo.borderRadius
            if (radius != 0) {
                setBtnTwo((prev) => ({ ...prev, borderRadius: radius - 1 }));
            }
        }
    }

    return (
        <div className={styles.body}>
            <div className={styles.headingContainer}>
                <div className={styles.heading}>Button Customisations</div>
                <div className={styles.subheading}>Select or customise your button components</div>
            </div>
            <div className={styles.editContainer}>
                <div className={styles.btnPreviewContainer}>
                    {selectedBtn === "primary" ? <button style={{ color: btnOne.fontColor, backgroundColor: btnOne.btnColor, borderRadius: btnOne.borderRadius, borderColor: btnOne.borderColor }} className={styles.primaryPreview}>Button</button>
                        : <button style={{ color: btnTwo.fontColor, backgroundColor: btnTwo.btnColor, borderRadius: btnTwo.borderRadius, borderColor: btnTwo.borderColor }} className={styles.secondaryPreview}>Button</button>}
                </div>
                <div className={styles.btnOptions}>
                    <label className={styles.checkboxContainer}>
                        <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={selectedBtn === "primary"}
                            onChange={() => handleCheckboxChange("primary")}
                        />
                        <span className={styles.customCheckbox}></span>
                        <span className={styles.checkboxLabel}>Primary</span>
                    </label>
                    <label className={styles.checkboxContainer}>
                        <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={selectedBtn === "secondary"}
                            onChange={() => handleCheckboxChange("secondary")}
                        />
                        <span className={styles.customCheckbox}></span>
                        <span className={styles.checkboxLabel}>Secondary</span>
                    </label>
                </div>
                <div className={styles.line}></div>
                <div className={styles.btnFontColorContainer}>
                    <ColorPicker
                        color={selectedBtn === "primary" ? btnOne.btnColor : btnTwo.btnColor}
                        extractedColors={extractedColors}
                        setColor={(color) => {
                            if (selectedBtn === "primary") {
                                setBtnOne((prev) => ({ ...prev, btnColor: color }));
                            } else {
                                setBtnTwo((prev) => ({ ...prev, btnColor: color }));
                            }
                        }}
                        heading="Button Colour"
                        handleChange={handleBtnColorChange}
                    />
                    <ColorPicker
                        color={selectedBtn === "primary" ? btnOne.fontColor : btnTwo.fontColor}
                        extractedColors={extractedColors}
                        setColor={(color) => {
                            if (selectedBtn === "primary") {
                                setBtnOne((prev) => ({ ...prev, fontColor: color }));
                            } else {
                                setBtnTwo((prev) => ({ ...prev, fontColor: color }));
                            }
                        }}
                        heading="Font Colour"
                        handleChange={handleFontColorChange}
                    />
                </div>
                <div className={styles.colorRadiusContainer}>
                    <ColorPicker
                        color={selectedBtn === "primary" ? btnOne.borderColor : btnTwo.borderColor}
                        extractedColors={extractedColors}
                        setColor={(color) => {
                            if (selectedBtn === "primary") {
                                setBtnOne((prev) => ({ ...prev, borderColor: color }));
                            } else {
                                setBtnTwo((prev) => ({ ...prev, borderColor: color }));
                            }
                        }}
                        heading="Border Colour"
                        handleChange={handleBorderColorChange}
                    />
                    <div className={styles.radiusContainer}>
                        <div className={styles.heading}>Border Radius</div>
                        <RadiusIcon />
                        <div className={styles.radiusValue}>{selectedBtn === "primary" ? btnOne.borderRadius : btnTwo.borderRadius}px</div>
                        <div className={styles.arrows}>
                            <div onClick={handleIncreaseRadius}><UpIcon /></div>
                            <div onClick={handleDecreaseRadius}><DownIcon /></div>
                        </div>
                    </div>
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