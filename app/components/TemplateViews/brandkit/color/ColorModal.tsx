import React, { useState } from 'react'
import styles from './colormodal.style.module.css'
import PrimaryColorConfig from './PrimaryColorConfig'
import SecondaryColorConfig from './SecondaryColorConfig'
import GeneratePalette from '../palette/Palette'
import { ChromePicker } from 'react-color';


interface Props {
    colorCode: string
    setColorCode: (value: string) => void
    fetchedColors :  string[]
}

const ColorModal = ({ colorCode, setColorCode,fetchedColors }: Props) => {

    const handleColorChange = (color: any) => {
        setColorCode(color.hex);
    };
    const isColorDark = (color: string) => {
        // Convert hex color to RGB
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);

        // Convert RGB values to linear space
        const linearize = (value: number) => {
            const v = value / 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };

        const rLin = linearize(r);
        const gLin = linearize(g);
        const bLin = linearize(b);

        // Calculate luminance using the linear RGB values
        const luminance = 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;

        // Return true if the color is dark (luminance is less than 0.5)
        return luminance < 0.5;
    };
    return (
        <div className={styles.body}>
            <div className={styles.colorContainer} style={{ backgroundColor: colorCode }}>
                <span style={{ color: isColorDark(colorCode) ? '#ffffff' : '#000000' }}>{colorCode}</span>
            </div>
            <div className={styles.configure}>
                <div className={styles.colorPicker}>
                    <ChromePicker
                        color={colorCode}
                        onChange={handleColorChange}
                    />
                </div>
                <div className={styles.line}></div>
                <button style={{backgroundColor : colorCode,color: isColorDark(colorCode) ? '#ffffff' : '#000000'}}>Save</button>
            </div>
        </div>
    )
}

export default ColorModal