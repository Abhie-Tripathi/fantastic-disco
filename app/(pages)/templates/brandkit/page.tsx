'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.style.module.css'
import TemplateCard from '@/app/components/TemplateViews/TemplateCard'
import ButtonsModal from '@/app/components/TemplateViews/brandkit/buttons/ButtonsModal'

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
                </div>
            </div>
            {preview.length > 0 && <div className={styles.modal}>
                <div className={styles.heading_btnContainer}>
                    <div className={styles.modalHeading}>Buttons</div>
                    <div className={styles.closeBtn} onClick={() => setPreview("")}>x</div>
                </div>
                <ButtonsModal />
                <div className={styles.btnContainer}>
                    <button type='button' className={styles.cancelBtn}>Cancel</button>
                    <button type='button' className={styles.submitBtn}>Save Changes</button>
                </div>
            </div>}

        </div>
    )
}

export default Page