import React, { useState } from 'react'
import styles from './editsettings.style.module.css'
import ColorsEdit from './colors/ColorsEdit';
import FontsEdit from './fonts/FontsEdit';

const EditSettings = () => {
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [cardRadius, setCardRadius] = useState<number>(10);
    const [cardBgColor, setCardBgColor] = useState<string>('#688bc4');
    const [eventNameColor, setEventNameColor] = useState<string>('#000000');
    const [eventNameSize, setEventNameSize] = useState<number>(18);
    const [typeBgColor, setTypeBgColor] = useState<string>('#eeeeee');
    const [typeFontSize, setTypeFontSize] = useState<number>(14);
    const [dateFontSize, setDateFontSize] = useState<number>(14);
    const [locationFontSize, setLocationFontSize] = useState<number>(14);
    const [dateLocationColor, setDateLocationColor] = useState<string>('#333333');
    const [btnBgColor, setBtnBgColor] = useState<string>('#9968c4');
    const [btnFontColor, setBtnFontColor] = useState<string>('#ffffff');
    const [btnBorderWidth, setBtnBorderWidth] = useState<number>(1);
    const [btnBorderColor, setBtnBorderColor] = useState<string>('#9968c4');
    const [btnRadius, setBtnRadius] = useState<number>(5);
    const [btnFontSize, setBtnFontSize] = useState<number>(16);
    const [bgColor, setBgColor] = useState<string>("#9968c4")

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
                    <div className={styles.container} onClick={() => handleModal("radius")}>Borders</div>
                    <div className={styles.container} onClick={() => handleModal("font")}>Fonts</div>
                </div>
            )}
            {activeModal === "color" && (
                <div className={styles.modal}>
                    <div className={styles.heading_btnContainer}>
                        <div className={styles.heading}>Colors</div>
                        <div className={styles.backBtn} onClick={handleBack}>Back</div>
                    </div>
                    <ColorsEdit setBgColor = {setBgColor} setCardBgColor = {setCardBgColor} setBtnBgColor = {setBtnBgColor} setBtnBorderColor = {setBtnBorderColor} setEventNameColor = {setEventNameColor} setBtnFontColor = {setBtnFontColor} />   
                </div>
            )}
            {activeModal === "radius" && (
                <div className={styles.modal}>
                    <div className={styles.heading_btnContainer}>
                        <div className={styles.heading}>Borders</div>
                        <div className={styles.backBtn} onClick={handleBack}>Back</div>
                    </div>
                </div>
            )}
            {activeModal === "font" && (
                <div className={styles.modal} >
                    <div className={styles.heading_btnContainer}>
                        <div className={styles.heading}>Fonts</div>
                        <div className={styles.backBtn} onClick={handleBack}>Back</div>
                    </div>
                    <FontsEdit setEventNameSize = {setEventNameSize} setBtnFontSize = {setBtnFontSize} setDateFontSize={setDateFontSize} setLocationFontSize = {setLocationFontSize} />        
                </div>
            )}
        </div>
    )
}

export default EditSettings