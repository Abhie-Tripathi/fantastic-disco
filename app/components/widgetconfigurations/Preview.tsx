'use client'
import React, { useState } from 'react'
import styles from './preview.style.module.css'
import Script from 'next/script'
import lorem from '../../../public/data/lorem.json'

interface PreviewProps {
    toggle: () => void;
    type : string;
  }

const Preview = ({ toggle, type } : PreviewProps) => {
    const [toggleState, setToggleState] = useState<string>("Side Preview")

    const handleToggleState = () => {
        if (toggleState === "Side Preview") {
            setToggleState("Full Preview")
        } else setToggleState("Side Preview")
        toggle()
    }
    return (
        <div className={styles.container}>
            <Script src='https://widget-webcomp-nolit.vercel.app/dist/eventgeni.js'/>
            <div className={styles.toggleHeading} onClick={handleToggleState}>{toggleState}</div>
            <div className={`${toggleState === "Side Preview" ? styles.sidescreen : styles.fullscreen}`}>
            {type === "Sticky" ?   
            <div className={styles.stickywidget}>
                <sticky-widget/> 
                <div>{lorem[0]}</div>
            </div>
            : type === "Page" ? <page-widget/> : <section-widget/>} 
            </div>
        </div>
    )
}

export default Preview