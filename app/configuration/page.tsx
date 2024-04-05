'use client'
import React, { useState } from 'react'
import styles from './page.style.module.css'
import Navbar from '../components/Navbar'
import WidgetBtns from '../components/widgetconfigurations/WidgetBtns'
import StickyWidget from '../components/widgetconfigurations/StickyWidget'
import SectionWidget from '../components/widgetconfigurations/SectionWidget'
import Preview from '../components/widgetconfigurations/Preview'

const Page = () => {
    const [type, setType] = useState<string>("Sticky");
    const [previewState, setPreviewState] = useState<string>("Side Preview");

  const handlePreviewToggle = ()=>{
    if(previewState === "Side Preview"){
      setPreviewState("Full Preview")
    }else setPreviewState("Side Preview")
  }

    return (
        <div className={styles.body}>
            {/* <Navbar /> */}
            <div className={styles.container} >
                {previewState === "Side Preview" && <div className={styles.configurationForm}>
                    <WidgetBtns
                        type={type}
                        setType={setType}
                    />
                    <div className={styles.dropdown_container}>
                        {type === "Sticky" && <StickyWidget />}
                        {type === "Section" && <SectionWidget />}
                        {type === "Full Width" && <SectionWidget />}
                    </div>
                </div>}
                <div className={`${styles.previewSection} ${previewState === "Full Preview" ? styles.fullPreview : ""}`}>
                    <Preview toggle={handlePreviewToggle} />
                </div>
            </div>
        </div>
    )
}

export default Page