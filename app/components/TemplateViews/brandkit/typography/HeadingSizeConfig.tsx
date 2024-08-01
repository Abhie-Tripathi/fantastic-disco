import React, { useEffect, useState } from 'react'
import styles from './heading.style.module.css'

interface Props {
    selectedFont: string;
    type: string;
    setPrimaryFontSize: React.Dispatch<React.SetStateAction<string>>;
    setSecondaryFontSize: React.Dispatch<React.SetStateAction<string>>;
    setDescFontSize: React.Dispatch<React.SetStateAction<string>>;
}

const HeadingSizeConfig = ({ selectedFont, type, setPrimaryFontSize, setSecondaryFontSize, setDescFontSize }: Props) => {
    const [fontSize, setFontSize] = useState<number>(0)

    useEffect(() => {
        if (type === "Primary") {
            setFontSize(24)
        } else if (type === "Secondary") {
            setFontSize(20)
        } else {
            setFontSize(16)
        }
    }, [type])

    useEffect(() => {
        if (type === "Primary") {
            setPrimaryFontSize(`${fontSize}px`)
        } else if (type === "Secondary") {
            setSecondaryFontSize(`${fontSize}px`)
        }
        else {
            setDescFontSize(`${fontSize}px`)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fontSize])
    return (
        <div className={styles.body}>
            <div className={styles.fontPreview} style={{ fontFamily: selectedFont }}>
                <div className={styles.fontBody} style={{ fontSize: fontSize }}>{type} Font Size</div>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
            </div>
            <div className={styles.fontsizeConfigContainer}>
                <div className={styles.decreaseBtn} onClick={() => setFontSize(fontSize - 1)}>-</div>
                <div className={styles.fontSize}>{fontSize} px</div>
                <div className={styles.increaseBtn} onClick={() => setFontSize(fontSize + 1)}>+</div>
            </div>
        </div>
    )
}

export default HeadingSizeConfig