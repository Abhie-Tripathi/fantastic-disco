import React, { ChangeEvent, useState } from 'react'
import styles from './logo.style.module.css'
import Image, { StaticImageData } from 'next/image'
import PlaceHolder from '/public/placeholder.png'

interface Props{
    flex : boolean;
    fetchedLogos? : string[]
}
const LogoComponent = ({flex,fetchedLogos}: Props) => {
    const [imageSrc, setImageSrc] = useState<string | StaticImageData>(PlaceHolder);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target?.result) {
                    setImageSrc(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={`${styles.body} ${!flex ?styles.columnbody:""}`}>
            <div className={`${styles.headingContainer} ${!flex ? styles.colheadingcontainer:""}`}>
                <div className={styles.heading}>Company Logo</div>
                <div className={styles.subheading}>Update your company logo</div>
            </div>
            <div className={styles.editContainer} >
                <div className={styles.logoContainer}>
                    <Image src={fetchedLogos ? fetchedLogos[0] : imageSrc} alt='logo' width={48} height={48}/>
                </div>
                <input type="file" id="fileInput" className={styles.fileInput} onChange={handleFileChange}/>
                {/* <label htmlFor="fileInput" className={styles.customFileButton}>
                    Upload
                </label> */}
            </div>
        </div>
    )
}

export default LogoComponent