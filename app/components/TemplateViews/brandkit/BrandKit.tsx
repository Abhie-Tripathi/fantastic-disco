'use client'
import React, { useState } from 'react'
import styles from './brandkit.style.module.css'
import TemplateCard from '@/app/components/TemplateViews/designs/TemplateCard'
import ButtonsModal from '@/app/components/TemplateViews/brandkit/buttons/ButtonsModal'

import TypographyModal from '@/app/components/TemplateViews/brandkit/typography/TypographyModal'
import LogoContainer from './logo/LogoContainer'
import ColorContainer from './color/ColorContainer'
import TypoContainer from './typography/TypoContainer'


// interface EditProps {
//     setCardRadius: (value: number) => void,
//     setCardBgColor: (value: string) => void,
//     setEventNameColor: (value: string) => void,
//     setEventNameSize: (value: number) => void,
//     setDateFontSize: (value: number) => void,
//     setLocationFontSize: (value: number) => void,
//     setBtnBgColor: (value: string) => void,
//     setBtnFontColor: (value: string) => void,
//     setBtnBorderWidth: (value: number) => void,
//     setBtnBorderColor: (value: string) => void,
//     setBtnRadius: (value: number) => void,
//     setBtnFontSize: (value: number) => void,
//     setBgColor: (value: string) => void,
// }

interface Props {
    preview: string;
    setPreview: (value: string) => void
    setColorCode: (value: string) => void
    fetchedColors : string[]
    fetchedFonts:string[]; 
    fetchedLogos: string[];
    fetchedDomain: string 
}

const BrandKit = ({ preview, setPreview,setColorCode,fetchedColors, fetchedFonts,fetchedLogos,fetchedDomain }: Props) => {
    return (
        <div className={styles.body}>
            <div className={styles.container}>
                <LogoContainer fetchedLogos={fetchedLogos} setPreview={setPreview} />
                <ColorContainer fetchedColors={fetchedColors} setColorCode={setColorCode} setPreview={setPreview} />
                <TypoContainer fetchedFonts={fetchedFonts} setPreview={setPreview} />
            </div>
        </div>
    )
}

export default BrandKit