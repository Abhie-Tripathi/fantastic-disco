import React, { useState } from 'react'
import styles from './dashboardbrandkit.style.module.css'
import LogoComponent from '../EditScreen/BrandKit/CustomizeComponents/LogoComponent'
import BrandColor from '../EditScreen/BrandKit/CustomizeComponents/BrandColor'
import BrandkitTypography from '../EditScreen/BrandKit/CustomizeComponents/BrandkitTypography'
import GotoIcon from "/public/goTo.svg";
import Image from 'next/image'
import Link from 'next/link'

const DashboardBrandkit = () => {
    const [extractedColors, setExtractedColors] = useState<string[]>(["#843DF8", "#424FDF", "#1A56F3", "#3097F5", "#0785A2"])
    const [valueUpdate, setValueUpdated] = useState<boolean>(false)
    return (
        <div className={styles.body}>
            <div className={styles.header}>
                <div className={styles.heading}>Brand Kit</div>
                <Link href={"/widget/brandkit"}><Image src={GotoIcon} alt='linkicon' /></Link>
            </div>
            <div className={styles.brandKitContainer}>
                <div className={styles.container}>
                    <LogoComponent flex={false} />
                </div>
                <div className={styles.container}>
                    <BrandColor setValueUpdated={setValueUpdated} flex={false} setExtractedColors={setExtractedColors} extractedColors={extractedColors} />
                </div>
                <div className={styles.container}>
                    <BrandkitTypography flex={false} />
                </div>
            </div>
        </div>
    )
}

export default DashboardBrandkit