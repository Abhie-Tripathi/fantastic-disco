import React, { useState } from 'react'
import styles from './colorsedit.style.module.css'

interface ColorProps {
    setBgColor: (value: string) => void,
    setCardBgColor: (value: string) => void,
    setBtnBgColor: (value: string) => void,
    setBtnBorderColor: (value: string) => void,
    setEventNameColor: (value: string) => void,
    setBtnFontColor: (value: string) => void,
}

const ColorsEdit = (props: ColorProps) => {

    const [cardBgColor, setCardBgColor] = useState<string>('#688bc4');
    const [btnBgColor, setBtnBgColor] = useState<string>('#9968c4');
    const [btnBorderColor, setBtnBorderColor] = useState<string>('#9968c4');
    const [bgColor, setBgColor] = useState<string>("#9968c4")
    const [btnFontColor, setBtnFontColor] = useState<string>('#688bc4');
    const [eventNameColor, setEventNameColor] = useState<string>('#688bc4');

    const handleBgChange = (value: string) => {
        setBgColor(value)
        props.setBgColor(value)
    }
    const handleBtnBgChange = (value: string) => {
        setBtnBgColor(value)
        props.setBtnBgColor(value)
    }
    const handleBtnBorderChange = (value: string) => {
        setBtnBorderColor(value)
        props.setBtnBorderColor(value)
    }
    const handleCardBgChange = (value: string) => {
        setCardBgColor(value)
        props.setCardBgColor(value)
    }
    const handleBtnColorChange = (value: string) => {
        setBtnFontColor(value)
        props.setBtnFontColor(value)
    }

    const handleEventChange = (value: string) => {
        setEventNameColor(value)
        props.setEventNameColor(value)
    }


    return (
        <div className={styles.colorEditsContainer}>
            <div className={styles.colorContainer}>
                <div className={styles.colorHeading}>Background</div>
                <div className={styles.colorInputWrapper}>
                    <input
                        type="color"
                        className={styles.colorInput}
                        value={bgColor}
                        onChange={(e) => handleBgChange(e.target.value)}
                    />
                </div>
            </div>
            <div className={styles.colorContainer}>
                <div className={styles.colorHeading}>Card Background</div>
                <div className={styles.colorInputWrapper}>
                    <input
                        type="color"
                        className={styles.colorInput}
                        value={cardBgColor}
                        onChange={(e) => handleCardBgChange(e.target.value)}
                    />
                </div>
            </div>
            <div className={styles.colorContainer}>
                <div className={styles.colorHeading}>Button Background Color</div>
                <div className={styles.colorInputWrapper}>
                    <input
                        type="color"
                        className={styles.colorInput}
                        value={btnBgColor}
                        onChange={(e) => handleBtnBgChange(e.target.value)}
                    />
                </div>
            </div>
            <div className={styles.colorContainer}>
                <div className={styles.colorHeading}>Button Border Color</div>
                <div className={styles.colorInputWrapper}>
                    <input
                        type="color"
                        className={styles.colorInput}
                        value={btnBorderColor}
                        onChange={(e) => handleBtnBorderChange(e.target.value)}
                    />
                </div>
            </div>
            <div className={styles.colorContainer}>
                <div className={styles.colorHeading}>Button Name Color</div>
                <div className={styles.colorInputWrapper}>
                    <input
                        type="color"
                        className={styles.colorInput}
                        value={btnFontColor}
                        onChange={(e) => handleBtnColorChange(e.target.value)}
                    />
                </div>
            </div>
            <div className={styles.colorContainer}>
                <div className={styles.colorHeading}>Event Name Color</div>
                <div className={styles.colorInputWrapper}>
                    <input
                        type="color"
                        className={styles.colorInput}
                        value={eventNameColor}
                        onChange={(e) => handleEventChange(e.target.value)}
                    />
                </div>
            </div>

        </div>
    )
}

export default ColorsEdit