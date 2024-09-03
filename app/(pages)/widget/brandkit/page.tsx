'use client'
import React, { useState } from 'react'
import styles from './page.style.module.css'
import BrandKit from '@/app/components/TemplateViews/brandkit/BrandKit'
import DetailSection from '@/app/components/TemplateViews/brandkit/DetailSection'
import ColorModal from '@/app/components/TemplateViews/brandkit/color/ColorModal'
import LogoModal from '@/app/components/TemplateViews/brandkit/logo/LogoModal'

const Page = () => {
  const [preview, setPreview] = useState<string>("");
  const [colorCode, setColorCode] = useState<string>("")
  return (
    <div className={`${styles.body} ${preview ? styles.fixBody : ""}`}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <DetailSection />
        </div>
        <div className={styles.rightSection}>
          <BrandKit setColorCode={setColorCode} setPreview={setPreview} preview={preview} />
        </div>
      </div>
      {preview.length > 0 && <div className={styles.blackScreen}></div>}
      <div className={styles.modalContainer}>
      {preview.length > 0 && <div className={styles.closBtn} onClick={()=>setPreview("")}>X</div>}
        <div className={styles.modal}>
          {preview === "logo" ? <LogoModal /> : preview === "color" ? <ColorModal setColorCode={setColorCode} colorCode={colorCode} /> : <></>}
        </div>
      </div>
    </div>
  )
}

export default Page
