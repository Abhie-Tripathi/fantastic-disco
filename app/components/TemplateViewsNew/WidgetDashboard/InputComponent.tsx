'use client'
import React, { useState } from 'react'
import styles from './inputcomp.style.module.css'
import EmptyImage from '/public/widgetimages/emptyimages/addedeventempty.svg'
import Image from 'next/image'
import { baseUrl } from '@/constants'
import { myFetch } from '@/utils/myFetch'

interface Props {
    fetched: boolean;
    setFetchedBoolean : (value : boolean)=>void
    setBrandkitLoadingState : (value : boolean)=>void
}

const InputComponent = ({ fetched,setFetchedBoolean,setBrandkitLoadingState }: Props) => {

    const [domain, setDomain] = useState<string>("");

    const handleSubmit = (e : React.FormEvent)=>{
        e.preventDefault();
        setBrandkitLoadingState(true)
        const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
        // Check if the entered domain is valid
        if (!urlPattern.test(domain)) {
            alert("Please enter a valid domain.");
            return;
        }
        postBrandkit()
    }
    const postBrandkit = async()=>{
        const postDomain = {
            url: `https://${domain}`    
        };
        
        const {data, error}= await myFetch(`${baseUrl}/kit`,{
            method : "POST",
            body: JSON.stringify(postDomain),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(error){
            console.log(error)
            return;
        }
        setFetchedBoolean(true)
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
                    <input placeholder='Enter your company domain' onChange={(e)=>setDomain(e.target.value)} value={domain}/>
                </div>
                <button>Fetch</button>
            </form>
            {fetched && <div className={styles.infoContainer}>
                <span className={styles.infoBtn}>i</span>
                <span className={styles.info}>Once you&apos;ve created a widget, the URL cannot be changed. Please ensure all details are accurate before finalizing. However, if you delete all existing widgets, you will have the option to change the URL.</span>
            </div>}

        </div>
    )
}

export default InputComponent