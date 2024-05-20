import React from 'react'
import styles from './stickypreview.style.module.css'

interface StickyProps {
    type: string;
    setPreview: (id: string) => void;
}

const StickyPreview = ({ type, setPreview }: StickyProps) => {
    return (
        <div className={styles.previewContainer}>
            <div className={styles.heading_btnContainer}>
                <div className={styles.heading}>{type === "top" ? "Sticky Top" : "Sticky Footer"}</div>
                <div className={styles.closeBtn} onClick={() => setPreview("")}>x</div>
            </div>
            <div className={styles.preview}>
                <div className={type === "top" ? styles.stickyTop : styles.stickyFooter}>Your Event Name</div>
                {/* <iframe src="https://10times.com/" className={styles.website}></iframe> */}
                <div className={styles.website}>Your Website</div>
            </div>
        </div>
    )
}

export default StickyPreview