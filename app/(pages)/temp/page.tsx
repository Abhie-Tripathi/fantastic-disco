'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.style.module.css'
import { Notes } from "@/app/components/eventDetail/Notes";
import usePosterGenerator from '@/hooks/usePosterGenerator';
import Image from 'next/image';

const Page = () => {
    const { isLoading, imageUrl, generatePrompt } = usePosterGenerator();

    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [desc, setDesc] = useState("");
    const [height, setHeight] = useState<number>(200);
    const [width, setWidth] = useState<number>(200);
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
            <div className={styles.inputContainer}>
                <input type="text" placeholder='Event Name' onChange={(e)=>setName(e.target.value)}/>
                <input type="text" placeholder='Location' onChange={(e)=>setLocation(e.target.value)}/>
                <input type="text" placeholder='Description' onChange={(e)=>setDesc(e.target.value)}/>
            </div>
            <div>
                <label>
                    Height: {height}px
                    <input
                        type="range"
                        min="200"
                        max="700"
                        step="50"
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
                        min="200"
                        max="700"
                        step="50"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                    />
                </label>
            </div>
            <div className={styles.bannerContainer} style={{height :height, width : width}}>
                <Image src={image} alt='image' width={width} height={height}/>
            </div>
            <button className={styles.btn} onClick={handlePoster}>Generate</button>
        </div>
    )
}

export default Page