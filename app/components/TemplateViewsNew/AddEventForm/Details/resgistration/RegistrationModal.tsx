import React, { useState } from 'react'
import styles from './registrationmodal.style.module.css'
import ColorPicker from '../../../EditScreen/BrandKit/CustomizeComponents/ColorPicker'
import { showToast } from "@/utils/showToast";
interface Props{
    setRegisterModal : (value : boolean)=>void
    setRegisterBtnColor : (value : string)=>void
    setRegisterBtnText: (value : string)=>void
    setRegisterMessage: (value : string)=>void
    registerMessage:string
    registerBtnText:string
    registerBtnColor : string
}

const RegistrationModal = ({setRegisterModal,setRegisterBtnColor,setRegisterBtnText,setRegisterMessage ,registerMessage ,registerBtnText, registerBtnColor}:Props) => {

    const [customMessage, setCustomMessage] = useState<string>(registerMessage)
    const [btnText, setBtnText] = useState<string>(registerBtnText)
    const [btnColor, setBtnColor] = useState<string>(registerBtnColor)
    const [customErrorMessage, setCustomErrorMessage] = useState<string>('');
    const [buttonErrorMessage, setButtonErrorMessage] = useState<string>('');

    // const handleSubmit = (e: React.FormEvent<HTMLFormElement>)=>{
    //     e.preventDefault()
    //     setRegisterBtnColor(btnColor)
    //     setRegisterBtnText(btnText)
    //     setRegisterMessage(customMessage)
    //     setRegisterModal(false)
    // }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();  
    
        const trimmedCustomMessage = customMessage.trim();
        const trimmedBtnText = btnText.trim();
    
        if (trimmedCustomMessage === '') {
            setCustomErrorMessage('Please fill in all fields with valid input.');
            return;  
        }

         if (trimmedBtnText === '') {
            setButtonErrorMessage('Please fill in all fields with valid cta input.');
            return;  
        }
        
    
        setCustomErrorMessage('');
        setButtonErrorMessage("")
    
        setRegisterBtnColor(btnColor);
        setRegisterBtnText(trimmedBtnText);
        setRegisterMessage(trimmedCustomMessage);
    
        // Close modal only after successful validation
        setRegisterModal(false);
    };

    const handleColor = (color : any)=>{
        setBtnColor(color.hex)
    }
    const handleHexInputChange = (hexcolor : string)=>{
        setBtnColor(hexcolor)
    }

    const handleCustomMessageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        setCustomErrorMessage("")
        const specialCharRegex = /[@#$%^&*"|<>]/g;

        if (specialCharRegex.test(value)) {
            showToast("error", "Please check, input should not contain any special character");
        } else {
            setCustomMessage(value);
        }
    };
    const handleButtonInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        setButtonErrorMessage("")
        const specialCharRegex = /[@#$%^&*"|<>]/g;

        if (specialCharRegex.test(value)) {
            showToast("error", "Please check, input should not contain any special character");
        } else {
            setBtnText(value);
        }
    };
  return (
    <form className={styles.body} onSubmit={handleSubmit}>
        <div className={styles.closeContainer}>
            <button className={styles.closeBtn} onClick={()=>setRegisterModal(false)} type='button'>Close</button>
        </div>
        <div className={styles.container}>
            <span>Customize your message</span>
            <input type="text" value={customMessage}onChange={(e) => { handleCustomMessageInputChange(e) }} maxLength={150}/>
            {customErrorMessage && (
                <span className={styles.errorMessage}>{customErrorMessage}</span>
            )}
        </div>
        <div className={styles.container}>
            <span>Button Text</span>
            <input type="text" value={btnText} onChange={(e)=>handleButtonInputChange(e)} maxLength={30}/>
            {buttonErrorMessage && (
                <span className={styles.errorMessage}>{buttonErrorMessage}</span>
            )}
        </div>
        <div className={styles.colorPicker}>
        <ColorPicker handleHexInputChange={handleHexInputChange} heading='Button Colour' color={btnColor} handleChange={handleColor}/>
        </div>
        <button className={styles.saveBtn} type='submit'>Save</button>
    </form>
  )
}

export default RegistrationModal