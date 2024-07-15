import React, { useEffect, useState } from 'react'
import styles from './brandcolor.style.module.css'
import ColorPickIcon from '/public/colorPick.png'
import Image from 'next/image'
import { SketchPicker } from 'react-color';
import ColorPicker from './ColorPicker';

const BrandColor = () => {

    const [extractedColors, setExtractedColors] = useState(["#843DF8", "#424FDF", "#1A56F3", "#3097F5", "#0785A2"])
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [color, setColor] = useState('#2c68f6');
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);

    const handleSelectColor = (index: number) => {
        setSelectedColorIndex(index)

    }
    useEffect(() => {
        setColor(extractedColors[selectedColorIndex]);
    }, [selectedColorIndex])

    const handleClick = () => {
        setDisplayColorPicker(!displayColorPicker);
    };

    const handleChange = (color: any) => {
        setColor(color.hex);
        const updatedColors = [...extractedColors];
        if (selectedColorIndex !== null) {
            updatedColors[selectedColorIndex] = color.hex;
            setExtractedColors(updatedColors);
        }
    };

    return (
        <div className={styles.body}>
            <div className={styles.headingContainer}>
                <div className={styles.heading}>Brand Colour</div>
                <div className={styles.subheading}>Select or customise your brand colour</div>
            </div>
            <div className={styles.editContainer}>
                <div className={styles.colorList}>
                    {extractedColors.map((color, key) => (
                        <div key={key} className={`${styles.extractedColorOutter} ${key === selectedColorIndex ? styles.activeColor : ""}`} style={{ backgroundColor: key === selectedColorIndex ? "transparent" : color, borderColor: key === selectedColorIndex ? color : "transparent" }} onClick={() => handleSelectColor(key)}>
                            {key === selectedColorIndex && <div className={styles.extractedColorInner} style={{ backgroundColor: color }}></div>}
                        </div>
                    ))}
                </div>
                <div className={styles.pickColorContainer}>
                    <ColorPicker heading='Pick Colour' extractedColors={extractedColors} color={color} setColor={setColor} handleChange={handleChange}/>
                </div>
            </div>
        </div>
    )
}

export default BrandColor