import React, { useState } from 'react'
import styles from './brandkittypo.style.module.css'
// import Image from 'next/image'
// import WarningIcon from '/public/warningicon.svg'
import { useTheme } from '@/context';
import useOutsideClick from '@/hooks/useOutsideClick';

interface Props {
    flex: boolean;
    eventFont?: string;
    setEventFont?: (value: string) => void
    setFontSettings?: React.Dispatch<React.SetStateAction<FontSettingsState>>;
    fetchedFonts : string[]
    clickable : boolean;
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

const BrandkitTypography = ({ flex, eventFont, setEventFont, setFontSettings,fetchedFonts,clickable }: Props) => {
    const { theme } = useTheme()
    const fontsList = ["Arial", "Verdana", "Tahoma", "Trebuchet MS", "Times New Roman", "Georgia", "Garamond", "Courier New", "Brush Script"]
    const [familyDropdownOpen, setFamilyDropdownOpen] = useState(false);
    const [selectedFont, setSelectedFont] = useState<string>("Arial")
    const familyDropdownRef = useOutsideClick(() => setFamilyDropdownOpen(false));

    const handleFontSelect = (font: string) => {
        setSelectedFont(font)
        if (setEventFont) {
            setEventFont(font)
        }
        if (setFontSettings) {
            setFontSettings((prevSettings) => ({
                ...prevSettings,
                heading: {
                    ...prevSettings.heading,
                    fontFamily: font,
                },
                subheading: {
                    ...prevSettings.subheading,
                    fontFamily: font,
                },
                body: {
                    ...prevSettings.body,
                    fontFamily: font,
                }
            }));
        }

    }

    return (
        <div className={`${styles.body} ${!flex ? styles.columnbody : ""}`}>
            <div className={`${styles.headingContainer} ${!flex ? styles.colheadingcontainer : ""}`}>
                <div className={styles.heading}>Typography</div>
                <div className={styles.subheading}>Select or customise your text styles</div>
            </div>
            <div className={styles.fontFamilyWarningContainer}>
                <div className={styles.fontFamilyContainer}>
                    <div className={styles.heading}>Font Family</div>
                    <FontFamilyIcon color={theme === "light" ? "black" : "white"} />
                    <div ref={familyDropdownRef} className={styles.dropDownContainer} style={{ backgroundColor: theme === "light" ? "#F2F2F2" : "#1A1A1A" }} onClick={() => setFamilyDropdownOpen(!familyDropdownOpen)}>
                        <div className={styles.display}>{selectedFont}</div>
                        <DownArrow color={theme === "light" ? "black" : "white"} />
                        {familyDropdownOpen && <div className={`${styles.dropDown} ${theme === "light" ? styles.lightDropdown : styles.darkDropdown}`}>
                            {fetchedFonts.map((font, key) => (
                                <div key={key} className={styles.dropdownFont} onClick={() => handleFontSelect(font)}>{font}</div>
                            ))}
                        </div>}
                    </div>
                </div>
                {/* <div className={styles.warning}>
                    <Image src={WarningIcon} alt='warning' />
                    <span>Failed to fetch your site&apos;s Typography styles</span>
                </div> */}
            </div>
        </div>
    )
}

export default BrandkitTypography
interface IconProps {
    color: string;
}
function FontFamilyIcon({ color }: IconProps) {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 6H6V8H4V14H2V8H0V6ZM14 2H10.0664V14H7.93359V2H4V0H14V2Z" fill={color} />
        </svg>
    )
}
function DownArrow({ color }: IconProps) {
    return (
        <svg width="8" height="4" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.47124 5.47026C5.34622 5.59524 5.17668 5.66545 4.9999 5.66545C4.82313 5.66545 4.65359 5.59524 4.52857 5.47026L0.757237 1.69893C0.693563 1.63743 0.642775 1.56387 0.607836 1.48253C0.572896 1.40119 0.554505 1.31371 0.553736 1.22519C0.552967 1.13667 0.569835 1.04889 0.603355 0.966957C0.636876 0.885027 0.686378 0.810592 0.748973 0.747996C0.811568 0.685401 0.886003 0.635899 0.967934 0.602379C1.04986 0.568858 1.13765 0.55199 1.22617 0.55276C1.31469 0.553529 1.40217 0.57192 1.48351 0.606859C1.56484 0.641798 1.63841 0.692586 1.6999 0.75626L4.9999 4.05626L8.2999 0.75626C8.42564 0.634821 8.59404 0.567625 8.76884 0.569144C8.94363 0.570663 9.11084 0.640775 9.23445 0.76438C9.35805 0.887986 9.42817 1.05519 9.42969 1.22999C9.43121 1.40479 9.36401 1.57319 9.24257 1.69893L5.47124 5.47026Z" fill={color} />
        </svg>

    )
}