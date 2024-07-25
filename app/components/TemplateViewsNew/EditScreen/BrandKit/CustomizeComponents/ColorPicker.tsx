import React, { useState } from 'react'
import styles from './colorpicker.style.module.css'
import { SketchPicker } from 'react-color';

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
            <div className={styles.pickedColorCode}>{color}</div>
            <div className={styles.pickedColorOuter} style={{ borderColor: color }} onClick={handleClick}>
                <div className={styles.pickedColorInner} style={{ backgroundColor: color }}></div>
            </div>
        </div>
    )
}

export default ColorPicker