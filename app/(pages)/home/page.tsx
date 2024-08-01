'use client';
import React, { useState } from 'react';
import styles from './page.style.module.css';
import Link from 'next/link';
import RightArrow from '/public/rightArrow.svg'
import Image from 'next/image';
import { ApiResponse } from '@/types/fetchEventsApiType';
import { baseUrl } from '@/constants';

const Page: React.FC = () => {

    const [events, setEvents] = useState<ApiResponse | null>(null);
    const [input, setInput] = useState<string>("");
    
    const fetchData = async()=>{  
        try {
            const response = await fetch(`${baseUrl}/event/search?orgWebsite=${input}`, {
                method: 'GET',
                credentials: 'include' // This will include cookies in the request
            });
            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`);
            }
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    return (
        <div className={styles.body}>
            <div className={styles.websiteContainer}>
                <div className={styles.websiteContent}>Get Started</div>
                <div className={styles.websiteContentTwo}>Enter your Website</div>
                <input type="text" className={styles.websiteInput} placeholder="Enter Website URL" onChange={(e)=>setInput(e.target.value)} />
                <div className={styles.example}>eg : 10times.com</div>
                <button type="button" className={styles.btn} onClick={fetchData}>Extract</button>
            </div>
            <div className={styles.rightContent}>
                <div className={styles.eventHeading}>Your Events</div>
                <div className={styles.events}>
                    {events?.data.events.map((event : any,key : any)=>(
                        <div key={key} className={styles.eventName}>{event.name}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Page