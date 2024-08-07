import React, { useState } from 'react'
import styles from './colorpicker.style.module.css'
import { SketchPicker } from 'react-color';
import { useTheme } from '@/context';
import useOutsideClick from '@/hooks/useOutsideClick';

interface ColorProps {
    color: string;
    extractedColors? : string[]
    heading : string;
    handleChange : (value : any)=>void
    handleHexInputChange: (color: string) => void
}

const ColorPicker = ({ color,extractedColors,heading , handleChange,handleHexInputChange}: ColorProps) => {
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const handleClick = () => {
        setDisplayColorPicker(!displayColorPicker);
    };
    const colorPickerRef = useOutsideClick(() => setDisplayColorPicker(false));
    const {theme} = useTheme()

    const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const hexColor = e.target.value;
        handleHexInputChange(hexColor);
    };

    
    return (
        <div className={styles.body} ref={colorPickerRef}>
            <div className={styles.heading}>{heading}</div>
            {displayColorPicker ? (
                <div className={styles.colorPickerModal}>
                    <div className={styles.cover} />
                    <SketchPicker
                        color={color}
                        onChange={handleChange}
                        presetColors={extractedColors}
                        disableAlpha={true}
                    />
                </div>
            ) : null}
            <input
                className={styles.pickedColorCode}
                style={{ backgroundColor: theme === "light" ? "#F2F2F2" : "#1A1A1A", color: theme === "light" ? "black" : "white" }}
                maxLength={7}
                value={color}
                onChange={handleHexInput}
            />
            <div className={styles.pickedColorOuter} onClick={handleClick}>
                <div className={styles.pickedColorInner} style={{ backgroundColor: color }}></div>
            </div>
        </div>
    )
}

export default ColorPicker