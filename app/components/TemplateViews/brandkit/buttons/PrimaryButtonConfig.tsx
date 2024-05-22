import React, { useState } from 'react'
import styles from './primarybuttonconfig.style.module.css'
import PrimaryButton from './PrimaryButton';

const PrimaryButtonConfig = () => {
    const [fontSize, setFontSize] = useState('16px');
    const [padding, setPadding] = useState('10px 20px');
    const [fontColor, setFontColor] = useState('#ffffff');
    const [buttonColor, setButtonColor] = useState('#007bff');
    const [borderRadius, setBorderRadius] = useState('4px');
    const [borderColor, setBorderColor] = useState('#007bff');
    const [borderWidth, setBorderWidth] = useState('1px');

    return (
        <div className={styles.body}>
            <div className={styles.buttonContainer}>
                <PrimaryButton
                    fontSize={fontSize}
                    padding={padding}
                    fontColor={fontColor}
                    buttonColor={buttonColor}
                    borderRadius={borderRadius}
                    borderColor={borderColor}
                    borderWidth={borderWidth}
                />
            </div>
            <div className={styles.controls}>
                <div className={styles.colorControls}>
                    <label className={styles.label}>
                        Font Color:
                        <div className={styles.colorInputWrapper}>
                            <input type="color" className={styles.colorInput} value={fontColor} onChange={(e) => setFontColor(e.target.value)} />
                        </div>
                    </label>
                    <label className={styles.label}>
                        Button Color:
                        <div className={styles.colorInputWrapper}>
                            <input type="color" className={styles.colorInput} value={buttonColor} onChange={(e) => setButtonColor(e.target.value)} />
                        </div>
                    </label>
                    <label className={styles.label}>
                        Border Color:
                        <div className={styles.colorInputWrapper}>
                            <input type="color" className={styles.colorInput} value={borderColor} onChange={(e) => setBorderColor(e.target.value)} />
                        </div>
                    </label>
                </div>
                <label className={styles.label}>
                    Font Size:
                    <input type="text" value={fontSize} onChange={(e) => setFontSize(e.target.value)} />
                </label>
                <label className={styles.label}>
                    Padding:
                    <input type="text" value={padding} onChange={(e) => setPadding(e.target.value)} />
                </label>


                <label className={styles.label}>
                    Border Radius:
                    <input type="text" value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)} />
                </label>

                <label className={styles.label}>
                    Border Width:
                    <input type="text" value={borderWidth} onChange={(e) => setBorderWidth(e.target.value)} />
                </label>
            </div>
        </div >
    )
}

export default PrimaryButtonConfig