import React, { useState } from 'react'
import styles from './logomodal.style.module.css'
import UploadIcon1 from '/public/drive.svg'
import Image from 'next/image'

const LogoModal = () => {
    const [uploadedImage, setUploadedImage] = useState<string | ArrayBuffer | null>(null);
    const [imageSize, setImageSize] = useState<'small' | 'medium' | 'large'>('small');
    const [borderRadius, setBorderRadius] = useState<number>(0);
    const [companyWebsite, setCompanyWebsite] = useState<string>("");
    const [logoUrl, setLogoUrl] = useState<string>("");

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

    const handleLogoGenerate = () => {
        if (!companyWebsite) {
            alert('Please enter a company website.');
            return;
        }
        const baseUrl = 'https://logo.clearbit.com/';
        const url = `${baseUrl}${companyWebsite}`;
        // Checking if the URL is valid and fetchable
        fetch(url)
            .then(response => {
                if (response.ok) {
                    setLogoUrl(url);
                } else {
                    alert('Logo not found for the provided website.');
                    setLogoUrl('');
                }
            })
            .catch(error => {
                console.error('Error fetching the logo:', error);
                alert('There was an error fetching the logo. Please try again.');
                setLogoUrl('');
            });
    }
    return (
        <div className={styles.body}>
            <div className={styles.input_btnsContainer}>
                <div className={styles.input}>
                    <div className={styles.generateLogoContainer}>
                        <input type="text" placeholder="Enter Your Company URL" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} />
                        <button type='button' className={styles.generateBtn} onClick={handleLogoGenerate}>Generate</button>
                    </div>
                    <div>OR</div>
                    <div className={styles.logoUploadContainer}>
                        <input type="file" id="fileInput" className={styles.fileInput} onChange={handleFileChange} />
                        <label htmlFor="fileInput" className={styles.uploadBtn}>
                            <Image src={UploadIcon1} alt='Upload' className={styles.uploadLogo} />
                            <span>Upload Logo</span>
                        </label>
                    </div>
                </div>
                <div className={styles.btnContainer}>
                    <button className={`${styles.smallBtn} ${imageSize === "small" ? styles.activeBtn : ""}`} onClick={() => handleSizeChange('small')}>Small</button>
                    <button className={`${styles.medBtn} ${imageSize === "medium" ? styles.activeBtn : ""}`} onClick={() => handleSizeChange('medium')}>Medium</button>
                    <button className={`${styles.largeBtn} ${imageSize === "large" ? styles.activeBtn : ""}`} onClick={() => handleSizeChange('large')}>Large</button>
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
                        <Image
                            src={uploadedImage as string}
                            alt="Uploaded Logo"
                            width={50} height={50}
                            className={`${styles.logo} ${styles[imageSize]}`}
                            style={{ borderRadius: `${borderRadius}%` }} />
                    ) :
                        logoUrl.length > 0 ? (<Image
                            src={logoUrl as string}
                            alt="Uploaded Logo"
                            width={100} height={100}
                            className={`${styles.logo} ${styles[imageSize]}`}
                            style={{ borderRadius: `${borderRadius}%` }} />
                        ) :
                            <div className={styles.dummyLogo}>Logo</div>}
                </div>
            </div>
        </div>
    )
}

export default LogoModal