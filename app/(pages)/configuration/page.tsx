'use client'
import React, { useState } from 'react'
import styles from './page.style.module.css'
import WidgetBtns from '../../components/widgetconfigurations/WidgetBtns'
import StickyWidget from '../../components/widgetconfigurations/StickyWidget'
import SectionWidget from '../../components/widgetconfigurations/SectionWidget'
import Preview from '../../components/widgetconfigurations/Preview'
import PageWidget from '@/app/components/widgetconfigurations/PageWidget'
import CodeWindow from '@/app/components/widgetconfigurations/CodeWindow'

const Page = () => {
    const [type, setType] = useState<string>("Sticky");
    const [previewState, setPreviewState] = useState<string>("Side Preview");
    const [stickyId, setStickyId] = useState<string>("")

  const handlePreviewToggle = ()=>{
    if(previewState === "Side Preview"){
      setPreviewState("Full Preview")
    }else setPreviewState("Side Preview")
  }

    return (
        <div className={styles.body}>
            <div className={styles.container} >
                {previewState === "Side Preview" && <div className={styles.configurationForm}>
                    <WidgetBtns
                        type={type}
                        setType={setType}
                    />
                    <div className={styles.dropdown_container}>
                        {type === "Sticky" && <StickyWidget setStickyId = {setStickyId} />}
                        {type === "Section" && <SectionWidget />}
                        {type === "Page" && <PageWidget />}
                        {type === "Code" && <CodeWindow stickyId = {stickyId} />}
                    </div>
                </div>}
                <div className={`${styles.previewSection} ${previewState === "Full Preview" ? styles.fullPreview : ""}`}>
                    <Preview type={type} toggle={handlePreviewToggle} stickyId = {stickyId} />
                </div>
            </div>
        </div>
    )
}

export default Page