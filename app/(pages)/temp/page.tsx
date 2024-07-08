'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.style.module.css'
import usePosterGenerator from '@/hooks/usePosterGenerator';
import Image from 'next/image';

const Page = () => {
    const { isLoading, imageUrl, generatePrompt } = usePosterGenerator();

    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [desc, setDesc] = useState("");
    const [height, setHeight] = useState<number>(256);
    const [width, setWidth] = useState<number>(256);
    const [image, setImage] = useState<string>("")

    const handlePoster = () => {
        generatePrompt(location, desc, name, height, width)
    }

    useEffect(() => {
        // Update the image state when generatedImage change
        if (imageUrl) {
            setImage(imageUrl);
        }
    }, [imageUrl]);

    return (
        <div className={styles.body}>
            <div className={styles.inputBannerContainer}>
                <div className={styles.inputContainer}>
                    <input type="text" placeholder='Event Name' onChange={(e) => setName(e.target.value)} />
                    <input type="text" placeholder='Location' onChange={(e) => setLocation(e.target.value)} />
                    <input type="text" placeholder='Description' onChange={(e) => setDesc(e.target.value)} />
                    <div>
                <label>
                    Height: {height}px
                    <input
                        type="range"
                        min="256"
                        max="1024"
                        step="256"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                    />
                </label>
            </div>
            <div>
                <label>
                    Width: {width}px
                    <input
                        type="range"
                        min="256"
                        max="1024"
                        step="256"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                    />
                </label>
            </div>
                </div>
                <div className={styles.bannerContainer} style={{ height: height, width: width }}>
                    <Image src={image} alt='image' width={width} height={height} />
                </div>
            </div>
        
            <div className={styles.btnBannerContainer}>
                <button className={styles.btn} onClick={handlePoster}>Generate</button>

            </div>


        </div>
    )
}

export default Page