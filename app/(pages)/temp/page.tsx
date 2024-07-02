'use client'
import React, { useEffect } from 'react'
import Script from 'next/script'
import styles from './page.style.module.css'
import { baseUrl } from '@/constants'
import aiBanner from '/public/aiBanner.png'
const Page = () => {
    // useEffect(() => {
    //     async function sendBase64ToBackend(base64Data: string | ArrayBuffer | null): Promise<void> {
    //         if (typeof base64Data !== 'string') {
    //             console.error('Invalid Base64 data');
    //             return;
    //         }

    //         try {
    //             const response = await fetch(`${baseUrl}/auth/customer/profile`, {
    //                 method: 'PATCH',
    //                 credentials: 'include',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({ image: base64Data }),
    //             });
    //             const data = await response.json();
    //             console.log('Image saved successfully on backend:', data);
    //         } catch (error) {
    //             console.error('Error saving image on backend:', error);
    //             throw error;
    //         }
    //     }
    //     (async () => {
    //         try {
    //             await sendBase64ToBackend(aiBanner);
    //         } catch (error) {
    //             console.error('Error processing image:', error);
    //         }
    //     })();
    // }, []);

    return (
        <div className={styles.list}>
        </div>
    )
}

export default Page