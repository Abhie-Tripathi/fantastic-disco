import React from 'react'
import styles from './logo.style.module.css'
import Image from 'next/image'
import PlaceHolder from '/public/placeholder.png'

const LogoComponent = () => {
    return (
        <div className={styles.body}>
            <div className={styles.headingContainer}>
                <div className={styles.heading}>Company Logo</div>
                <div className={styles.subheading}>Update your company logo</div>
            </div>
            <div className={styles.editContainer}>
                <div className={styles.logoContainer}>
                    <Image src={PlaceHolder} alt='logo' />
                </div>
                <input type="file" id="fileInput" className={styles.fileInput} />
                <label htmlFor="fileInput" className={styles.customFileButton}>
                    Upload
                </label>
            </div>
        </div>
    )
}

export default LogoComponent