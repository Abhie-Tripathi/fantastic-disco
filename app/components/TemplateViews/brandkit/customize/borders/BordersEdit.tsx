import React, { useState } from 'react'
import styles from './borderedit.style.module.css'

interface BorderProps {
    setCardRadius: (value: number) => void,
    setBtnBorderWidth: (value: number) => void,
    setBtnRadius: (value: number) => void,
  }
  
const BordersEdit = (props : BorderProps) => {

    const [accordian, setAccordian] = useState<string>("")
    const [cardRadius, setCardRadius] = useState<number>(10)
    const [buttonRadius, setButtonRadius] = useState<number>(10)
    const [btnBorderWidth, setBtnBorderWidth] = useState<number>(1)

    const handleAccordian = (value: string) => {
        setAccordian(value)
    }

    const handleCardRadius = (e: any) => {
        setCardRadius(e.target.value)
        props.setCardRadius(e.target.value)
    }
    const handleBtnRadius = (e: any) => {
        setButtonRadius(e.target.value)
        props.setBtnRadius(e.target.value)
    }
    const handleButtonBorderWidth = (e: any) => {
        setBtnBorderWidth(e.target.value)
        props.setBtnBorderWidth(e.target.value)
    }
    return (
        <div className={styles.body}>
            <div className={styles.accordianContainer}>
                <div onClick={() => handleAccordian("card")} className={styles.heading}>Card</div>
                {accordian === "card" && <div className={styles.accordian}>
                    <label>
                        Radius:
                        <input
                            type="range"
                            min="0"
                            max="50"
                            value={cardRadius}
                            onChange={(e) => handleCardRadius(e)}
                        />
                        <span>{cardRadius}px</span>
                    </label>
                </div>}
            </div> <div className={styles.accordianContainer}>
                <div onClick={() => handleAccordian("button")} className={styles.heading}>Button</div>
                {accordian === "button" && <div className={styles.accordian}>
                    <label>
                        Radius:
                        <input
                            type="range"
                            min="0"
                            max="50"
                            value={buttonRadius}
                            onChange={(e) => handleBtnRadius(e)}
                        />
                        <span>{buttonRadius}px</span>
                    </label>
                </div>}
                {accordian === "button" && <div className={styles.accordian}>
                    <label>
                        Border Width:
                        <input
                            type="range"
                            min="0"
                            max="5"
                            value={btnBorderWidth}
                            onChange={(e) => handleButtonBorderWidth(e)}
                        />
                        <span>{btnBorderWidth}px</span>
                    </label>
                </div>}
            </div>
        </div>
    )
}

export default BordersEdit