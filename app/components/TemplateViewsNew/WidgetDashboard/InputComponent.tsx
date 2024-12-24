'use client'
import React, { useEffect, useState } from 'react'
import styles from './inputcomp.style.module.css'
import EmptyImage from '/public/widgetimages/emptyimages/addedeventempty.svg'
import Image from 'next/image'
import { baseUrl } from '@/constants'
import { myFetch } from '@/utils/myFetch'
import { useWidgetServices } from '@/services/geniservices/widgetService'
import { useBrandKitServices } from '@/services/geniservices/brandkitService'

interface Props {
    fetched: boolean;
    setFetchedBoolean: (value: boolean) => void
    setBrandkitLoadingState: (value: boolean) => void
    setPolling: (value: boolean) => void
    setFetchedDomain: (value: string) => void
    fetchedDomain: string;
    setBrandkitFetched : (value: boolean) => void;
    removeCalled : boolean;
}

const InputComponent = ({removeCalled, fetched, setFetchedBoolean, setBrandkitLoadingState, setPolling, setFetchedDomain, fetchedDomain, setBrandkitFetched }: Props) => {
    const {getActiveWidget, getDeActiveWidget, getDraftWidget} = useWidgetServices()
    const {addBrandkit, error} = useBrandKitServices()
    const [domain, setDomain] = useState<string>("");
    const [disableBtn, setDisableBtn] = useState<boolean>(false)

    useEffect(() => {
        fetchWidget()
        console.log("this is called")
    }, [removeCalled])

    // useEffect(() => {
    //     const interval = setInterval(fetchWidget, 1000); 
    //     return () => clearInterval(interval); 
    // }, []);

    useEffect(() => {
        setDomain(fetchedDomain.substring(8))
    }, [fetchedDomain])
    const fetchWidget = async () => {
        // const { data: draftData, error: draftError } = await myFetch(`${baseUrl}/widget`)
        // const { data: activeData, error: activeError } = await myFetch(`${baseUrl}/widget?status=active`);
        // const { data: deactivateData, error: deactivateError } = await myFetch(`${baseUrl}/widget?`)
        // console.log("widget_data", "draft__",draftData);
        // if (draftData.data.length > 0 || activeData.data.length > 0 || deactivateData.data.length > 0) {
        //     setDisableBtn(true)
        // }else{
        //     setDisableBtn(false)
        // }
        const draftData:any = await getDraftWidget()
        const activeData:any = await getActiveWidget()
        const deactivateData:any = await getDeActiveWidget()
        if (draftData.data.length > 0 || activeData.data.length > 0 || deactivateData.data.length > 0) {
            setDisableBtn(true)
        }else{
            setDisableBtn(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (disableBtn) {
            return;
        }
        // Remove 'https://' if it exists at the beginning of the domain
        const cleanDomain = domain.startsWith('https://')
            ? domain.replace('https://', '')
            : domain;
        const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
        // Check if the entered domain is valid
        if (!urlPattern.test(cleanDomain)) {
            alert("Please enter a valid domain.");
            return;
        }

        const cleanDomainResult = cleanDomain.split('/')[0]; 
        postBrandkit(cleanDomainResult)
    }

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    
    //     if (disableBtn) {
    //         return;
    //     }
    
    //     // Clean up the domain
    //     const cleanDomain = domain.startsWith('https://')
    //         ? domain.replace('https://', '')
    //         : domain;
    
    //     const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
    
    //     if (!urlPattern.test(cleanDomain)) {
    //         alert("Please enter a valid domain.");
    //         return;
    //     }
    
    //     const cleanDomainResult = cleanDomain.split('/')[0];
    
    //     try {
    //         const response = await fetch(`https://isitdown.site/api/v3/${cleanDomainResult}`);
    
    //         if (response.ok) {
    //             const data = await response.json();
    //             if (data.status === "up") {
    //                 // Domain exists and is up, proceed with your logic
    //                 postBrandkit(cleanDomainResult);
    //             } else {
    //                 alert("This domain does not exist or is unreachable.");
    //             }
    //         } else {
    //             alert("There was an issue checking the domain status.");
    //         }
    //     } catch (error) {
    //         console.error("Error:", error);
    //         alert("An error occurred while trying to verify the domain.");
    //     }
    // };
    
    const postBrandkit = async (cleanDomain : string) => {
        const postDomain = {
            url: `https://${cleanDomain}`
        };
        const { data, error } = await myFetch(`${baseUrl}/kit`, {
            method: "POST",
            body: JSON.stringify(postDomain),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (error) {
            console.log(error)
            return;
        }
        setFetchedBoolean(true)
        setBrandkitLoadingState(true)
        setPolling(true)
        setBrandkitFetched(true)






    // try {
    //     const res = await addBrandkit(postDomain);
    //     console.log("brandkit", res);
    // if (error) {
    //     console.log(error)
    //     return;
    // }
    //     setFetchedBoolean(true)
    //     setBrandkitLoadingState(true)
    //     setPolling(true)
    //     setBrandkitFetched(true)

    // } catch (error) {
    //     console.log("Caught error:", error);
    // }

    }

    return (
        <div className={`${styles.body} ${fetched ? styles.fetchedBody : ""}`}>
            {!fetched && <Image src={EmptyImage} alt='empty' />}
            {!fetched && <div className={styles.emptyHeading}>
                Build Personalized Widgets</div>}
            {!fetched && <div className={styles.emptySubHeading}>Paste your Website URL below and let our inbuilt model fetch your events and brand kit</div>}
            <form onSubmit={handleSubmit} className={`${styles.input_btnContainer} ${fetched ? styles.fetchedInputBtnContainer : ""}`}>
                <div className={styles.inputContainer}>
                    <span>https://</span>
                    <input placeholder='Enter your company domain' onChange={(e) => setDomain(e.target.value)} value={domain} disabled={disableBtn ? true : false} className={disableBtn ? styles.disableInput : ""}/>
                </div>
                <button className={disableBtn ? styles.disableBtn : ""} data-name="Delete existing widgets to fetch again">Fetch</button>
            </form>
            {fetched && <div className={styles.infoContainer}>
                <span className={styles.infoBtn}>i</span>
                <span className={styles.info}>Once you&apos;ve created a widget, the URL cannot be changed. Please ensure all details are accurate before finalizing. However, if you delete all existing widgets, you will have the option to change the URL.</span>
                {/* {domain
                    ? <span className={styles.info}>Once you&apos;ve created a widget, the URL cannot be changed. Please ensure all details are accurate before finalizing.</span>
                    : <span className={styles.info}>If you delete all existing widgets, you will have the option to change the URL.</span>} */}
            </div>}

        </div>
    )
}

export default InputComponent