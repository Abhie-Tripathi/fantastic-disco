import React, { useState } from 'react'
import styles from './typography.style.module.css'
import Image from 'next/image';
import DropdownIcon from '/public/dropDown.svg'

interface Props{
    setSelectedFont: React.Dispatch<React.SetStateAction<string>>;
}

const FontPreviewSelect = (props : Props) => {
    const fontOptions = [
        'Arial',
        'Helvetica',
        'Times New Roman',
        'Georgia',
        'Courier New',
        'Verdana',
        'Geneva',
        'Trebuchet MS',
        'Arial Black',
        'Impact'
    ];
    const [selectedFont, setSelectedFont] = useState<string>('Times New Roman');
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)

    // Function to handle font selection change
    const handleFontChange = (font: string) => {
        setSelectedFont(font);
        props.setSelectedFont(font)
    };
    return (
        <div className={styles.fontConfig}>
            <div className={styles.fontPreview} style={{ fontFamily: selectedFont }}>
                <div className={styles.fontBody}>Your Font Style</div>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
            </div>
            <div className={styles.dropdownContainer}>
                <div className={styles.dropdownHeadingContainer} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <div>Select Font</div>
                    <Image src={DropdownIcon} alt='down' />
                </div>
                {isDropdownOpen && <div className={styles.fontsDropDown}>
                    {fontOptions.map((font, key) => (
                        <div key={key} className={styles.dropdownItem} style={{ fontFamily: font }} onClick={() => handleFontChange(font)}>
                            {font}
                        </div>
                    ))}
                </div>}
            </div>
        </div>
    )
}

export default FontPreviewSelect