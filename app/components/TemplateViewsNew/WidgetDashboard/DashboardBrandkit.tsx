import React, { useEffect, useState } from 'react'
import styles from './dashboardbrandkit.style.module.css'
import LogoComponent from '../EditScreen/BrandKit/CustomizeComponents/LogoComponent'
import BrandColor from '../EditScreen/BrandKit/CustomizeComponents/BrandColor'
import BrandkitTypography from '../EditScreen/BrandKit/CustomizeComponents/BrandkitTypography'
import GotoIcon from "/public/goTo.svg";
import Image from 'next/image'
import Link from 'next/link'
import { baseUrl } from '@/constants'
import { myFetch } from '@/utils/myFetch'
import Loading from '../../UI/Loading'

interface Props {
    setBrandkitLoadingState: (value: boolean) => void;
    brandkitLoadingState: boolean;
    polling: boolean;
    setPolling: (value: boolean) => void;
    setFetchedDomain: (value: string) => void;
    brandkitFetched: boolean;
    setBrandkitFetched: (value: boolean) => void;
}

const DashboardBrandkit = ({ setBrandkitLoadingState, brandkitLoadingState, setPolling, polling, setFetchedDomain, brandkitFetched, setBrandkitFetched }: Props) => {
    const [extractedColors, setExtractedColors] = useState<string[]>(["#843DF8", "#424FDF", "#1A56F3", "#3097F5", "#0785A2"])
    const [valueUpdate, setValueUpdated] = useState<boolean>(false)
    const [fetchedColors, setFetchedColors] = useState<string[]>([])
    const [fetchedFonts, setFetchedFonts] = useState<string[]>([])
    const [fetchedLogos, setFetchedLogos] = useState<string[]>([])


    const fetchBrandkit = async () => {
        const { data, error } = await myFetch(`${baseUrl}/kit`)
        if (error) {
            console.error('Error fetching brand kit:', error);
            return;
        }
        const cleanedFonts: string[] = Array.from(new Set(data.fontFamily.map((font: string) => font.trim().replace(/['"]+/g, ''))));
        setFetchedColors(data.color)
        setFetchedFonts(cleanedFonts)
        setFetchedLogos(data.logo)
        setFetchedDomain(data.domain.domain)
    }
    useEffect(() => {
        // Initial fetch
        fetchBrandkit();
        // Set up polling
        const intervalId = setInterval(() => {
            if (polling) {
                fetchBrandkit();
            }
        }, 1000); // Poll every 1 s 
        const timerId = setTimeout(() => {
            setBrandkitLoadingState(false);
            setPolling(false);
            if (fetchedLogos.length === 0) {
                setBrandkitFetched(false); // Update state if brandkit not fetched within time
            }

        }, 10000); // 10 seconds timeout
        // Clear interval on component unmount
        return () => {
            clearInterval(intervalId);
            clearTimeout(timerId);
        };
    }, [polling]);

    useEffect(() => {
        console.log("logo length : ", fetchedLogos.length)
        if (fetchedLogos.length > 0) {
            setBrandkitLoadingState(false)
            setPolling(false);
            setBrandkitFetched(true);
        }
    }, [fetchedLogos])

    return (
        <div className={styles.body}>
            <div className={styles.header}>
                <div className={styles.heading}>Brand Kit</div>
                <Link href={"/widget/brandkit"}><Image src={GotoIcon} alt='linkicon' /></Link>
            </div>
            {brandkitLoadingState ? (
                <div className={styles.loader}>
                    {/* <Loading /> */}
                    <div className={styles.progressBarContainer}>
                        <div className={styles.progressBar}></div>
                    </div>
                    <div className={styles.loadingHeading}>Fetching your Brandkit</div>
                </div>
            ) : brandkitFetched ? (
                <div className={styles.brandKitContainer}>
                    <div className={styles.container}>
                        <LogoComponent flex={false} fetchedLogos={fetchedLogos} />
                    </div>
                    <div className={styles.container}>
                        <BrandColor
                            clickable={false}
                            setValueUpdated={setValueUpdated}
                            flex={false}
                            setExtractedColors={setExtractedColors}
                            extractedColors={fetchedColors}
                        />
                    </div>
                    <div className={styles.container}>
                        <BrandkitTypography clickable={false} fetchedFonts={fetchedFonts} flex={false} />
                    </div>
                </div>
            ) : (
                <div className={styles.errorMessage}>
                    <span className={styles.error1}>Having issues while fetching your Brand kit</span>
                    <span className={styles.error2}>Check the Domain or try fetching again later</span>
                </div>
            )}
        </div>
    )
}

export default DashboardBrandkit