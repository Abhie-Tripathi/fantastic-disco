import React, { useEffect, useState } from 'react'
import styles from './brandcolor.style.module.css'
import ColorPicker from './ColorPicker';


interface Props {
    extractedColors: string[]
    setExtractedColors : (value : string[])=>void
    setValueUpdated : (value : boolean)=>void
}

const BrandColor = ({ extractedColors,setExtractedColors,setValueUpdated }: Props) => {

    const [color, setColor] = useState('#2c68f6');
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);

    const handleSelectColor = (index: number) => {
        setSelectedColorIndex(index)

    }
    useEffect(() => {
        setColor(extractedColors[selectedColorIndex]);
    }, [selectedColorIndex])


    const handleChange = (color: any) => {
        setValueUpdated(true)
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
                    <ColorPicker heading='Pick Colour' extractedColors={extractedColors} color={color} handleChange={handleChange} />
                </div>
            </div>
        </div>
    )
}

export default BrandColor