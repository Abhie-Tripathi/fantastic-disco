import React, { useState } from 'react'
import styles from './primarycolorconfig.style.module.css'
import { ChromePicker } from 'react-color';

const isColorLight = (color:any) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  };

const SecondaryColorConfig = () => {

    const [color, setColor] = useState("#d1c7b8");

    const handleColorChange = (color:any) => {
        setColor(color.hex);
      };
    return (
        <div className={styles.body}>
            <div className={styles.colorPreview} style={{ backgroundColor: color }}>
                <div className={styles.colorCode} style={{ color: isColorLight(color) ? 'black' : 'white' }}>{color}</div>
            </div>
            <div className={styles.colorPicker}>
                <div>Select Color</div>
                <ChromePicker
                    color={color}
                    onChange={handleColorChange}
                />
            </div>
        </div>
    )
}

export default SecondaryColorConfig