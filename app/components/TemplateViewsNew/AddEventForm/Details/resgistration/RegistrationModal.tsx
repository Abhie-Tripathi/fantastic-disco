import React, { useState } from 'react'
import styles from './registrationmodal.style.module.css'
import ColorPicker from '../../../EditScreen/BrandKit/CustomizeComponents/ColorPicker'

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        setRegisterBtnColor(btnColor)
        setRegisterBtnText(btnText)
        setRegisterMessage(customMessage)
        setRegisterModal(false)
    }

    const handleColor = (color : any)=>{
        setBtnColor(color.hex)
    }
    const handleHexInputChange = (hexcolor : string)=>{
        setBtnColor(hexcolor)
    }

  return (
    <form className={styles.body} onSubmit={handleSubmit}>
        <div className={styles.closeContainer}>
            <button className={styles.closeBtn} onClick={()=>setRegisterModal(false)} type='button'>Close</button>
        </div>
        <div className={styles.container}>
            <span>Customize your message</span>
            <input type="text" value={customMessage} onChange={(e)=>setCustomMessage(e.target.value)} maxLength={150}/>
        </div>
        <div className={styles.container}>
            <span>Button Text</span>
            <input type="text" value={btnText} onChange={(e)=>setBtnText(e.target.value)} maxLength={30}/>
        </div>
        <div className={styles.colorPicker}>
        <ColorPicker handleHexInputChange={handleHexInputChange} heading='Button Colour' color={btnColor} handleChange={handleColor}/>
        </div>
        <button className={styles.saveBtn} type='submit'>Save</button>
    </form>
  )
}

export default RegistrationModal