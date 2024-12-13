import React, { useEffect, useState } from 'react'
import styles from './brandcolor.style.module.css'
import ColorPicker from './ColorPicker';
import { AllEventsType, EventsType } from '@/types/alleventtype';
import { usePathname } from 'next/navigation';

interface Props {
    extractedColors: string[]
    setExtractedColors: (value: string[]) => void
    setValueUpdated: (value: boolean) => void
    flex: boolean;
    setPageBgColor?: (value: string) => void
    pageBgColor?: string;
    setCardBgColor?: (value: string) => void
    clickable: boolean;
    prefilledEvent?: EventsType | null
}

const BrandColor = ({ extractedColors, setExtractedColors, setValueUpdated, flex, setPageBgColor, pageBgColor, setCardBgColor, clickable, prefilledEvent }: Props) => {
    const [color, setColor] = useState('#2c68f6');
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const pathname = usePathname();
    const pathName = pathname.split("/")[2];
    const handleSelectColor = (index: number, color: any) => {
        setSelectedColorIndex(index)
        const rgbaColor = hexToRgba(color, 0.1);
        if (setPageBgColor) {
            setPageBgColor(rgbaColor);
        }
        if (setCardBgColor) {
            setCardBgColor(color)
            // setCardBgColor(rgbaColor)
        }
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
    useEffect(() => {
        if (clickable) {
            setColor(extractedColors[selectedColorIndex]);
        }
    }, [selectedColorIndex])

    useEffect(() => {
        if (extractedColors.length > 0 && setPageBgColor) {
            if (setPageBgColor && !prefilledEvent) {
                setPageBgColor(hexToRgba(extractedColors[0], 0.1));
            }
        }
    }, [extractedColors, setPageBgColor]);

    // const handleChange = (color: any) => {
    //     setValueUpdated(true)
    //     setColor(color.hex);
    //     const updatedColors = [...extractedColors];
    //     if (selectedColorIndex !== null) {
    //         updatedColors[selectedColorIndex] = color.hex;
    //         setExtractedColors(updatedColors);
    //     }
    //     const rgbaColor = hexToRgba(color.hex, 0.1);
    //     if(setPageBgColor){
    //         setPageBgColor(rgbaColor);    
    //     }
    //     if(setCardBgColor){
    //         setCardBgColor(color)
    //     }
    // };

    // const handleHexInputChange = (hexColor: string) => {
    //     setValueUpdated(true);
    //     setColor(hexColor);
    //     const updatedColors = [...extractedColors];
    //     if (selectedColorIndex !== null) {
    //         updatedColors[selectedColorIndex] = hexColor;
    //         setExtractedColors(updatedColors);
    //     }
    // };

    return (
        <div className={`${styles.body} ${!flex ? styles.columnbody : ""}`}>
            <div className={`${styles.headingContainer} ${!flex ? styles.colheadingcontainer : ""}`}>
                <div className={styles.heading}>Brand Colour</div>
                {
                    pathName !== "dashboard" &&(<div className={styles.subheading}>Select or customise your brand colour</div>)
                }
              
            </div>
            <div className={styles.editContainer}>
                <div className={styles.colorList}>
                    {clickable ? extractedColors.map((color, key) => (
                        <div key={key} className={`${styles.extractedColorOutter} ${key === selectedColorIndex ? styles.activeColor : ""}`}
                            style={{ backgroundColor: key === selectedColorIndex ? "transparent" : color, borderColor: key === selectedColorIndex ? color : "transparent" }} onClick={() => handleSelectColor(key, color)}>
                            {key === selectedColorIndex && <div className={styles.extractedColorInner} style={{ backgroundColor: color }}></div>}
                        </div>
                    )) :
                        extractedColors.map((color, key) => (
                            <div key={key} className={styles.extractedColorOutter} style={{ backgroundColor: color, cursor:"default" }}></div>
                        ))
                    }
                </div>
                {/* <div className={styles.pickColorContainer}>
                    <ColorPicker heading='Pick Colour' extractedColors={extractedColors} color={color} handleChange={handleChange} handleHexInputChange={handleHexInputChange} />
                </div> */}
            </div>
        </div>
    )
}

export default BrandColor