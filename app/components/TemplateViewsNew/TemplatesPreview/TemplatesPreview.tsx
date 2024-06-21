import React from 'react'
import styles from './templatepreview.style.module.css'
import PageTemplates from '../PageTemplates/PageTemplates'

const TemplatesPreview = () => {
    return (
        <div className={`${styles.body}`}>
            <div className={styles.templatesContainer}>
                <div className={styles.heading}>Choose your widget style</div>
                <div className={styles.templates}>
                    <PageTemplates />
                </div>
            </div>
            <div className={styles.previewContainer}>
                <div className={styles.heading}>Preview</div>
                <div className={styles.preview_btnContainer}>
                    <div className={styles.preview}></div>
                    <div className={styles.previewBtnContainer}>
                        <button className={styles.previewBtn}>Save to my widgets</button>
                        <button className={styles.previewBtn}>Continue with this template</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TemplatesPreview