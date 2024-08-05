import React, { useState } from 'react'
import styles from './colorpicker.style.module.css'
import { SketchPicker } from 'react-color';
import { useTheme } from '@/context';

interface ColorProps {
    color: string;
    extractedColors? : string[]
    heading : string;
    handleChange : (value : any)=>void
}

const ColorPicker = ({ color,extractedColors,heading , handleChange}: ColorProps) => {
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const handleClick = () => {
        setDisplayColorPicker(!displayColorPicker);
    };
    const {theme} = useTheme()
    return (
        <div className={styles.body}>
            <div className={styles.heading}>{heading}</div>
            {displayColorPicker ? (
                <div className={styles.colorPickerModal}>
                    <div className={styles.cover} />
                    <SketchPicker
                        color={color}
                        onChange={handleChange}
                        presetColors={extractedColors}
                    />
                </div>
            ) : null}
            <div className={styles.pickedColorCode} style={{backgroundColor :  theme === "light" ? "#F2F2F2" : "#1A1A1A"}}>{color}</div>
            <div className={styles.pickedColorOuter} onClick={handleClick}>
                <div className={styles.pickedColorInner} style={{ backgroundColor: color }}></div>
            </div>
        </div>
    )
}

export default ColorPicker