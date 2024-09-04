import React from 'react'
import styles from './registration.style.module.css'
import EditIcon from '/public/EditIcon.svg'
import Image from 'next/image'

interface Props {
    setRegisterModal: (value: boolean) => void
    registerMessage: string
    registerBtnText: string
    registerBtnColor: string
}

const RegistrationForm = ({ setRegisterModal, registerMessage, registerBtnText, registerBtnColor }: Props) => {
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
                <Image src={EditIcon} alt='edit' onClick={() => setRegisterModal(true)} />
            </div>
            <div className={styles.formSubHeading}>{registerMessage}
            </div>
            <input className={styles.inputField} type="text" placeholder='Name' disabled/>
            <input className={styles.inputField} type="text" placeholder='Email' disabled/>
            <button
                style={{ backgroundColor: registerBtnColor, color: fontColor }}
                className={styles.submitBtn}>
                {registerBtnText}
            </button>
        </div>
    )
}

export default RegistrationForm