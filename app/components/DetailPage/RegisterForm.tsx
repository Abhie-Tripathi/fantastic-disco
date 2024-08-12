import React from 'react'
import styles from './registerform.style.module.css'

interface Props {
    registerMessage: string
    registerBtnText: string
    registerBtnColor: string
}

const RegisterForm = ({ registerMessage, registerBtnText, registerBtnColor }: Props) => {
    // Function to convert hex to RGB
    const hexToRgb = (hex: string) => {
        const cleanHex = hex.replace('#', '');
        const bigint = parseInt(cleanHex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b };
    };

    // Function to calculate brightness
    const calculateBrightness = ({ r, g, b }: { r: number, g: number, b: number }) => {
        return (r * 299 + g * 587 + b * 114) / 1000;
    };

    // Determine if the button color is dark or light
    const rgb = hexToRgb(registerBtnColor);
    const brightness = calculateBrightness(rgb);
    const fontColor = brightness > 155 ? '#000000' : '#FFFFFF';
    return (
        <div className={styles.registerContainer} >
            <div className={styles.header}>
                <div>Join us at the event</div>
            </div>
            <div className={styles.formSubHeading}>{registerMessage}
            </div>
            <input className={styles.inputField} type="text" placeholder='Name' />
            <input className={styles.inputField} type="text" placeholder='Email' />
            <button
                style={{ backgroundColor: registerBtnColor, color: fontColor }}
                className={styles.submitBtn}>
                {registerBtnText}
            </button>
        </div>
    )
}

export default RegisterForm