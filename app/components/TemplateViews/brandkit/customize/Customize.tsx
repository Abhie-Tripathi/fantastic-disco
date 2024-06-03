import React, {useState } from 'react'
import styles from './customize.style.module.css'
import ColorsEdit from './colors/ColorsEdit';
import FontsEdit from './fonts/FontsEdit';
import BordersEdit from './borders/BordersEdit';

interface EditProps{
    setCardRadius: (value: number) => void,
    setCardBgColor: (value: string) => void,
    setEventNameColor: (value: string) => void,
    setEventNameSize: (value: number) => void,
    setDateFontSize: (value: number) => void,
    setLocationFontSize: (value: number) => void,
    setBtnBgColor: (value: string) => void,
    setBtnFontColor: (value: string) => void,
    setBtnBorderWidth: (value: number) => void,
    setBtnBorderColor: (value: string) => void,
    setBtnRadius: (value: number) => void,
    setBtnFontSize: (value: number) => void,
    setBgColor: (value: string) => void,
}

const Customize = (props : EditProps) => {
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const handleModal = (modalType: string) => {
        setActiveModal(modalType);
    };

    const handleBack = () => {
        setActiveModal(null);
    };

    return (
        <div className={styles.body}>
            {!activeModal && (
                <div className={styles.editContainer}>
                    <div className={styles.container} onClick={() => handleModal("color")}>Colors</div>
                    <div className={styles.container} onClick={() => handleModal("border")}>Borders</div>
                    <div className={styles.container} onClick={() => handleModal("font")}>Fonts</div>
                    <div className={styles.container}>Auto Generate</div>
                </div>
            )}
            {activeModal === "color" && (
                <div className={styles.modal}>
                    <div className={styles.heading_btnContainer}>
                        <div className={styles.heading}>Colors</div>
                        <div className={styles.backBtn} onClick={handleBack}>Back</div>
                    </div>
                    <ColorsEdit setBgColor = {props.setBgColor} setCardBgColor = {props.setCardBgColor} setBtnBgColor = {props.setBtnBgColor} setBtnBorderColor = {props.setBtnBorderColor} setEventNameColor = {props.setEventNameColor} setBtnFontColor = {props.setBtnFontColor} />   
                </div>
            )}
            {activeModal === "border" && (
                <div className={styles.modal}>
                    <div className={styles.heading_btnContainer}>
                        <div className={styles.heading}>Borders</div>
                        <div className={styles.backBtn} onClick={handleBack}>Back</div>
                    </div>
                    <BordersEdit setCardRadius={props.setCardRadius} setBtnBorderWidth = {props.setBtnBorderWidth} setBtnRadius = {props.setBtnRadius}/>  
                </div>
            )}
            {activeModal === "font" && (
                <div className={styles.modal} >
                    <div className={styles.heading_btnContainer}>
                        <div className={styles.heading}>Fonts</div>
                        <div className={styles.backBtn} onClick={handleBack}>Back</div>
                    </div>
                    <FontsEdit setEventNameSize = {props.setEventNameSize} setBtnFontSize = {props.setBtnFontSize} setDateFontSize={props.setDateFontSize} setLocationFontSize = {props.setLocationFontSize} />        
                </div>
            )}
        </div>
    )
}

export default Customize