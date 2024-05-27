'use client'
import React, { useState } from 'react'
import styles from './page.style.module.css'
import { Palette } from 'color-thief-react';
import Image from 'next/image';
import UploadIcon1 from '/public/drive.svg'

const Page = () => {
    const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null);
    const [companyWebsite, setCompanyWebsite] = useState<string>("");
    const [colors, setColors] = useState<string[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateColors = async () => {
        try {
            const response = await fetch(`http://localhost:3001/extract-colors?url=${encodeURIComponent(companyWebsite)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setColors(data.colors);
        } catch (error) {
            console.error('Error fetching colors:', error);
        }
    }

    return (
        <div className={styles.body}>
            <div className={styles.header}>
                Upload Screenshot of your website. <span className={styles.subHeader}>(Note that the color extraction tool might pick up minor colors as well, so try to upload a screenshot that prominently displays the primary and secondary colors of your website. This will help us accurately capture the main colors used in your design.)</span>
            </div>
            <div className={styles.container}>
                <div className={styles.input_palettesContainer}>
                    <div className={styles.input}>
                        <input type="file" id="fileInput" className={styles.fileInput} onChange={handleFileChange} />
                        <label htmlFor="fileInput" className={styles.uploadBtn}>
                            <Image src={UploadIcon1} alt='Upload' className={styles.uploadLogo} />
                            <span>Upload Screenshot</span>
                        </label>
                    </div>
                    <div className={styles.generatedColorContainer}>
                        <div className={styles.generateColorInput}>
                            <input type="text" placeholder="Enter Your Website Url" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} />
                            <button className={styles.generateBtn} onClick={handleGenerateColors}>Generate</button>
                        </div>
                        <div className={styles.generatedPalleteContainer}>
                            {colors.map((color,key)=>(
                                <div className={styles.generatedColor} style={{backgroundColor : color}} key={key}></div>
                            ))}
                        </div>
                    </div>

                    <Palette src={imageSrc as string} crossOrigin="anonymous" format="hex" colorCount={3}>
                        {({ data, loading, error }) => (
                            <div className={styles.colorsContainer}>
                                {loading && <p>Loading colors...</p>}
                                {data && data.map((color, index) => (
                                    <div key={index} className={styles.colorBox} style={{ backgroundColor: color }}>
                                        <div className={styles.hexCode}>{color}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Palette>
                </div>
                {imageSrc && <Image src={imageSrc as string} alt="Uploaded" className={styles.imagePreview} width={500} height={500} />}
            </div>
        </div>
    );

}

export default Page