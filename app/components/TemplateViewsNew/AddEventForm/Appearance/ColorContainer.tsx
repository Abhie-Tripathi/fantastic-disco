import React, { useState } from 'react'
import styles from './colors.style.module.css'
import { SketchPicker } from 'react-color';
import { useTheme } from '@/context';
import useOutsideClick from '@/hooks/useOutsideClick';

interface Props {
    pageBgColor: string;
    setPageBgColor: (value: string) => void
}

const ColorContainer = ({ setPageBgColor, pageBgColor }: Props) => {
    const {theme} = useTheme()

    const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false)
    const [extractedColors, setExtractedColors] = useState<string[]>(["#843DF8", "#424FDF", "#1A56F3", "#3097F5", "#0785A2"])
    const colorPickerRef = useOutsideClick(() => setDisplayColorPicker(false));

    const handleChange = (color: any) => {
        // Convert hex to rgba with 10% opacity
        const rgbaColor = hexToRgba(color.hex, 0.1);
        setPageBgColor(rgbaColor);
    }
    const handleColorClick = (color : any)=>{
        const rgbaColor = hexToRgba(color, 0.1);
        setPageBgColor(rgbaColor);
    }

    const hexToRgba = (hex: string, opacity: number) => {
        let r = 0, g = 0, b = 0;

        // 3 digits
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);

            // 6 digits
        } else if (hex.length === 7) {
            r = parseInt(hex[1] + hex[2], 16);
            g = parseInt(hex[3] + hex[4], 16);
            b = parseInt(hex[5] + hex[6], 16);
        }

        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return (
        <div className={styles.body}>
            <div className={styles.header}>
                <ColorIcon color={theme === "light" ? "black" : "white"}/>
                <span>COLOURS</span>
            </div>
            <div className={styles.editContainer} >
                <div className={`${styles.bgContainer} ${theme == "light" ? styles.bgLightContainer : styles.bgDarkContainer}`}><PaintIcon /> <span>Background Fill</span></div>
                <div className={styles.colorPickerContainer} style={{backgroundColor : theme === "light" ? "#f2f2f2" : "#1a1a1a"}}>
                    <span>{pageBgColor}</span>
                    <div className={styles.colorPickerOuter} style={{ borderColor: pageBgColor }} onClick={() => setDisplayColorPicker(!displayColorPicker)}>
                        <div className={styles.colorPickerInner} style={{ backgroundColor: pageBgColor }}>
                        </div>
                    </div>
                    {displayColorPicker && <div ref={colorPickerRef} className={styles.sketchPicker}>
                        <SketchPicker
                            color={pageBgColor}
                            onChange={handleChange}
                            presetColors={extractedColors}
                        /></div>}
                </div>
                <div className={styles.extractedColors}>
                    {extractedColors.map((color, key) => (
                        <div className={styles.extractedColor} onClick={()=>handleColorClick(color)} style={{ backgroundColor: color }} key={key}></div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ColorContainer

interface IconProps{
    color : string;
}

function ColorIcon({color}: IconProps) {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.85627 0.333984C8.90568 0.333984 11.3786 2.53075 11.3786 5.24275C11.3778 6.0562 11.0543 6.83613 10.4791 7.41128C9.90382 7.98643 9.12384 8.30979 8.31038 8.31038H7.2247C6.71554 8.31038 6.30413 8.72179 6.30413 9.23094C6.30413 9.46398 6.39635 9.6788 6.53717 9.83839C6.68462 10.0041 6.77684 10.2189 6.77684 10.458C6.77684 10.9677 6.35328 11.3786 5.85627 11.3786C2.80686 11.3786 0.333984 8.90568 0.333984 5.85627C0.333984 2.80686 2.80686 0.333984 5.85627 0.333984ZM5.19967 9.23094C5.19945 8.96495 5.25168 8.70153 5.35337 8.45574C5.45506 8.20996 5.60422 7.98663 5.7923 7.79855C5.98039 7.61047 6.20371 7.46131 6.44949 7.35962C6.69528 7.25793 6.9587 7.2057 7.2247 7.20592H8.31038C8.83082 7.20534 9.32979 6.99841 9.69791 6.6305C10.066 6.2626 10.2732 5.76374 10.2741 5.2433C10.2741 3.17189 8.32363 1.43844 5.85627 1.43844C4.71624 1.4374 3.61994 1.87711 2.79658 2.66563C1.97323 3.45416 1.48657 4.53044 1.43836 5.66946C1.39016 6.80847 1.78413 7.92203 2.53791 8.7773C3.29169 9.63258 4.34692 10.1633 5.48297 10.2586C5.29811 9.94787 5.20026 9.59254 5.19967 9.23094ZM3.37124 5.85627C3.15155 5.85627 2.94086 5.769 2.78552 5.61366C2.63017 5.45831 2.5429 5.24762 2.5429 5.02793C2.5429 4.80824 2.63017 4.59755 2.78552 4.4422C2.94086 4.28686 3.15155 4.19959 3.37124 4.19959C3.59093 4.19959 3.80163 4.28686 3.95697 4.4422C4.11231 4.59755 4.19959 4.80824 4.19959 5.02793C4.19959 5.24762 4.11231 5.45831 3.95697 5.61366C3.80163 5.769 3.59093 5.85627 3.37124 5.85627ZM8.3413 5.85627C8.12161 5.85627 7.91092 5.769 7.75557 5.61366C7.60023 5.45831 7.51296 5.24762 7.51296 5.02793C7.51296 4.80824 7.60023 4.59755 7.75557 4.4422C7.91092 4.28686 8.12161 4.19959 8.3413 4.19959C8.56099 4.19959 8.77168 4.28686 8.92703 4.4422C9.08237 4.59755 9.16965 4.80824 9.16965 5.02793C9.16965 5.24762 9.08237 5.45831 8.92703 5.61366C8.77168 5.769 8.56099 5.85627 8.3413 5.85627ZM5.85627 4.19959C5.63658 4.19959 5.42589 4.11231 5.27055 3.95697C5.1152 3.80163 5.02793 3.59093 5.02793 3.37124C5.02793 3.15155 5.1152 2.94086 5.27055 2.78552C5.42589 2.63017 5.63658 2.5429 5.85627 2.5429C6.07596 2.5429 6.28665 2.63017 6.442 2.78552C6.59734 2.94086 6.68462 3.15155 6.68462 3.37124C6.68462 3.59093 6.59734 3.80163 6.442 3.95697C6.28665 4.11231 6.07596 4.19959 5.85627 4.19959Z" fill={color} />
        </svg>
    )
}
function PaintIcon() {
    return (
        <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.2499 8.625C12.2499 8.625 10.7499 10.2525 10.7499 11.25C10.7499 11.6478 10.908 12.0294 11.1893 12.3107C11.4706 12.592 11.8521 12.75 12.2499 12.75C12.6477 12.75 13.0293 12.592 13.3106 12.3107C13.5919 12.0294 13.7499 11.6478 13.7499 11.25C13.7499 10.2525 12.2499 8.625 12.2499 8.625ZM1.90742 7.5L5.49992 3.9075L9.09242 7.5M10.4199 6.705L3.71492 0L2.65742 1.0575L4.44242 2.8425L0.579922 6.705C0.137422 7.125 0.137422 7.8525 0.579922 8.295L4.70492 12.42C4.92242 12.6375 5.21492 12.75 5.49992 12.75C5.78492 12.75 6.07742 12.6375 6.29492 12.42L10.4199 8.295C10.8624 7.8525 10.8624 7.125 10.4199 6.705Z" fill="#7D7D7D" />
        </svg>
    )
}