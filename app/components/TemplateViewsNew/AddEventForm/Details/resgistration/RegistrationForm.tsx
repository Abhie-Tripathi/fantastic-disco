import React, { useState } from 'react'
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
    const [accordian, setAccordian] = useState<boolean>(false)
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
            <div className={styles.headerContainer} onClick={()=>setAccordian(!accordian)}>
                <div className={styles.info}>
                    <div className={styles.iBtn}>i</div>
                    <div className={styles.heading}>Customize your event registration form</div>
                </div>
                <div className={styles.accordianBtn}><DownIcon/></div>
            </div>
            {accordian && <div className={styles.accordian}>
                <div className={styles.header}>
                    <div>Join us at the event</div>
                    <Image src={EditIcon} alt='edit' onClick={() => setRegisterModal(true)} />
                </div>
                <div className={styles.formSubHeading}>{registerMessage}
                </div>
                <input className={styles.inputField} type="text" placeholder='Name' disabled />
                <input className={styles.inputField} type="text" placeholder='Email' disabled />
                <button
                    style={{ backgroundColor: registerBtnColor, color: fontColor }}
                    className={styles.submitBtn}>
                    {registerBtnText}
                </button>
            </div>}
        </div>
    )
}

export default RegistrationForm

function DownIcon() {
    return (
        <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.35341 3.85361C4.25965 3.94734 4.13249 4 3.99991 4C3.86733 4 3.74017 3.94734 3.64641 3.85361L0.817909 1.02511C0.72683 0.930806 0.676433 0.804505 0.677572 0.673406C0.678711 0.542308 0.731296 0.416902 0.824 0.324198C0.916704 0.231493 1.04211 0.178909 1.17321 0.17777C1.30431 0.176631 1.43061 0.227028 1.52491 0.318107L3.99991 2.79311L6.47491 0.318107C6.56921 0.227028 6.69551 0.176631 6.82661 0.17777C6.95771 0.178909 7.08312 0.231493 7.17582 0.324198C7.26852 0.416902 7.32111 0.542308 7.32225 0.673406C7.32339 0.804505 7.27299 0.930806 7.18191 1.02511L4.35341 3.85361Z" fill="black" />
        </svg>
    )
}