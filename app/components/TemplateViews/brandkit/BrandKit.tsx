'use client'
import React from 'react'
import styles from './brandkit.style.module.css'
import LogoContainer from './logo/LogoContainer'
import ColorContainer from './color/ColorContainer'
import TypoContainer from './typography/TypoContainer'

interface Props {
    preview: string;
    setPreview: (value: string) => void
    setColorCode: (value: string) => void
    fetchedColors : string[]
    setFetchedColors : (value : string[])=>void;
    fetchedFonts:string[]; 
    setFetchedFonts: (value : string[])=>void;
    fetchedLogos: string[];
    fetchedDomain: string 
    handleColorModal : (type: string, index : number) => void
    setTypography:(value: string) => void
}

const BrandKit = ({ preview, setPreview,setColorCode,fetchedColors, fetchedFonts,fetchedLogos,fetchedDomain,handleColorModal, setFetchedColors, setFetchedFonts, setTypography}: Props) => {
    return (
        <div className={styles.body}>
            <div className={styles.container}>
                <LogoContainer fetchedLogos={fetchedLogos} setPreview={setPreview} />
                <ColorContainer setFetchedColors={setFetchedColors} handleColorModal={handleColorModal} fetchedColors={fetchedColors} setColorCode={setColorCode} setPreview={setPreview} />
                <TypoContainer setFetchedFonts={setFetchedFonts} fetchedFonts={fetchedFonts} setPreview={setPreview}  handleColorModal={handleColorModal} setTypography={setTypography}/>
            </div>
        </div>
    )
}

export default BrandKit