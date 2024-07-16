import React, { useState } from 'react'
import styles from './brandkit.style.module.css'
import Customization from './Customization/Customization'
import Themes from './Themes/Themes'

const BrandKit = () => {

    const [selectedBtn, setSelectedBtn] = useState<string>("customization")
    const [extractedColors, setExtractedColors] = useState<string[]>(["#843DF8", "#424FDF", "#1A56F3", "#3097F5", "#0785A2"])
    return (
        <div className={styles.body}>
            <div className={styles.navbar}>
                <li onClick={()=>setSelectedBtn("customization")} className={selectedBtn === "customization" ? styles.activeItem : ""}>Customisations</li>
                <li onClick={()=>setSelectedBtn("theme")} className={selectedBtn === "theme" ? styles.activeItem : ""}>Theme templates</li>
            </div>
            <div className={styles.line}></div>
            <div className={styles.container}>
                {selectedBtn === "customization" ? <Customization setExtractedColors={setExtractedColors} extractedColors={extractedColors}/> : <Themes extractedColors={extractedColors}/>}
            </div>
        </div>
    )
}

export default BrandKit