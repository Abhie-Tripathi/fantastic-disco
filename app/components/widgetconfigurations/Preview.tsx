'use client'
import React, { useState } from 'react'
import styles from './preview.style.module.css'

interface PreviewProps {
    toggle: () => void;
  }

const Preview = ({ toggle } : PreviewProps) => {
    const [toggleState, setToggleState] = useState<string>("Side Preview")

    const handleToggleState = () => {
        if (toggleState === "Side Preview") {
            setToggleState("Full Preview")
        } else setToggleState("Side Preview")
        toggle()
    }
    return (
        <div className={styles.container}>
            <div className={styles.toggleHeading} onClick={handleToggleState}>{toggleState}</div>
            <div className={styles.screen}></div>
        </div>
    )
}

export default Preview