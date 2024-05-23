import React, { useState } from 'react'
import styles from './logomodal.style.module.css'
import UploadIcon1 from '/public/drive.svg'
import Image from 'next/image'

const LogoModal = () => {
    const [uploadedImage, setUploadedImage] = useState<string | ArrayBuffer | null>(null);
    const [imageSize, setImageSize] = useState<'small' | 'medium' | 'large'>('small');
    const [borderRadius, setBorderRadius] = useState<number>(0);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSizeChange = (size: 'small' | 'medium' | 'large') => {
        setImageSize(size);
    };

    const handleBorderRadiusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBorderRadius(Number(event.target.value));
    };
    return (
        <div className={styles.body}>
            <div className={styles.input_btnsContainer}>
                <div className={styles.input}>
                    <input type="file" id="fileInput" className={styles.fileInput} onChange={handleFileChange} />
                    <label htmlFor="fileInput" className={styles.uploadBtn}>
                        <Image src={UploadIcon1} alt='Upload' className={styles.uploadLogo} />
                        <span>Upload Logo</span>
                    </label>
                </div>
                <div className={styles.btnContainer}>
                    <button className={`${styles.smallBtn} ${imageSize === "small" ?styles.activeBtn : ""}`} onClick={() => handleSizeChange('small')}>Small</button>
                    <button className={`${styles.medBtn} ${imageSize === "medium" ?styles.activeBtn : ""}`} onClick={() => handleSizeChange('medium')}>Medium</button>
                    <button className={`${styles.largeBtn} ${imageSize === "large" ?styles.activeBtn : ""}`} onClick={() => handleSizeChange('large')}>Large</button>
                </div>
                <div className={styles.borderRadius}>
                    <label htmlFor="borderRadius">Border Radius:</label>
                    <input
                        type="number"
                        id="borderRadius"
                        value={borderRadius}
                        onChange={handleBorderRadiusChange}
                        min="0"
                        max="100"
                    />
                </div>
            </div>
            <div className={styles.previewCard}>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
                <div className={styles.logoPlaceholder} style={{ borderRadius: `${borderRadius}%` }}>
                    {uploadedImage ? (
                        <img
                            src={uploadedImage as string}
                            alt="Uploaded Logo"
                            className={`${styles.logo} ${styles[imageSize]}`}
                            style={{ borderRadius: `${borderRadius}%` }}
                        />
                    ) : <div className={styles.dummyLogo}>Logo</div>}
                </div>
            </div>
        </div>
    )
}

export default LogoModal