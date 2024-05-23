import React from 'react'
import styles from './stickypreview.style.module.css'

interface StickyProps {
    type: string;
}

const StickyPreview = ({ type }: StickyProps) => {
    return (
        <div className={styles.preview}>
            <div className={type === "top" ? styles.stickyTop : styles.stickyFooter}>Your Event Name</div>
            {/* <iframe src="https://10times.com/" className={styles.website}></iframe> */}
            <div className={styles.website}>Your Website</div>
        </div>
    )
}

export default StickyPreview