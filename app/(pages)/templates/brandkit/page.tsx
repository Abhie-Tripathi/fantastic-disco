'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.style.module.css'
import TemplateCard from '@/app/components/TemplateViews/TemplateCard'
import ButtonsModal from '@/app/components/TemplateViews/brandkit/buttons/ButtonsModal'
import ColorModal from '@/app/components/TemplateViews/brandkit/color/ColorModal'
import LogoModal from '@/app/components/TemplateViews/brandkit/logo/LogoModal'
import TypographyModal from '@/app/components/TemplateViews/brandkit/typography/TypographyModal'

const Page = () => {

    const [preview, setPreview] = useState("")

    return (
        <div className={styles.body}>
            <div className={`${styles.container} ${preview.length > 0 ? styles.blurContainer : ""}`}>
                <div className={styles.heading}>
                    Brand Kit
                </div>
                <div className={styles.templates}>
                    <TemplateCard name='Buttons' id='button' isHidden={false} setPreview={setPreview} desc='Customize button styles according to your website' />
                    <TemplateCard name='Colors' id='color' isHidden={false} setPreview={setPreview} desc='Create a color palette according to your website' />
                    <TemplateCard name='Social Links' id='link' isHidden={false} setPreview={setPreview} desc='Customize social link icons' />
                    <TemplateCard name='Brand Logo' id='logo' isHidden={false} setPreview={setPreview} desc='Customize and Add your brand logo' />
                    <TemplateCard name='Typography' id='font' isHidden={false} setPreview={setPreview} desc='Text Styling for diff texts' />
                </div>
            </div>
            {preview.length > 0 && <div className={styles.modal}>
                    <div className={styles.modalHeading}>
                        {preview === "button" ? "Buttons" :
                        preview === "color" ? "Colors" : 
                        preview === "logo"? "Logo" :
                        preview === "font"? "Typography" :""}
                    </div>
                {preview === "button" ? <ButtonsModal /> :
                preview === "color" ?  <ColorModal/> : 
                preview === "logo" ?  <LogoModal/> : 
                preview === "font" ?  <TypographyModal/> : <></>}
                <div className={styles.btnContainer}>
                    <button type='button' className={styles.cancelBtn} onClick={() => setPreview("")}>Cancel</button>
                    <button type='button' className={styles.submitBtn}>Save Changes</button>
                </div>
            </div>}

        </div>
    )
}

export default Page