"use client"
import React, { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import MyMeetings from '@/app/components/eventDetail/MyMeetings';
import Background from '@/public/background.png';
import Image from 'next/image';
import {Notes} from '@/app/components/eventDetail/Notes';
import SingleEvent from '@/app/components/eventDetail/SingleEvent';
import ScheduleMeetings from '@/app/components/eventDetail/ScheduleMeetings';
import eventData from '@/public/data/demoEvent.json';

interface EventData {
    id: number;
    imageUrl: string;
    name: string;
    description:string;
}

const Page = ({ params }: { params: { eventDetail: string } }) => {
    const [userCta, setUserCta] = useState<string>("Notes");
    const [meet,setMeet]=useState(false);
    const [single, setSingle] = useState<EventData>();
    const leftContainerRef = useRef<HTMLDivElement>(null); // Define leftContainerRef
    const rightContainerRef = useRef<HTMLDivElement>(null); // Define rightContainerRef

    const singledata: EventData | undefined = eventData.find((item: EventData) => parseInt(params?.eventDetail) === item.id);

    useEffect(() => {
        if (leftContainerRef.current && rightContainerRef.current) {
            const leftContainerHeight = leftContainerRef.current.clientHeight;
            rightContainerRef.current.style.height = leftContainerHeight + 'px';
            console.log(leftContainerHeight);
        }
       
    }, [singledata]); 
    const meetings=()=>{
        setMeet(!meet);
    }
    return (
        <div className={meet ? `${styles.container} ${styles.fullHeight}` : styles.container}>
            <div className={styles.innerContainer}>
                <div className={styles.containerLeft} ref={leftContainerRef}>
                    <div className={styles.containerOne}>
                        {/* Pass data as a prop to SingleEvent component */}
                        {singledata && <SingleEvent data={singledata} />}
                    </div>
                </div>
                <div className={styles.containerRight} ref={rightContainerRef}>
                    <div style={{height:"100%", display:"flex",flexDirection:"column", gap:"10px"}}>
                    <div className={styles.containerTopRight}>
                        {/* Add onClick handlers to update userCta state */}
                        <div className={userCta === "Notes" ? `${styles.btn} ${styles.active}` : styles.btn} onClick={() => setUserCta("Notes")}>Notes</div>
                        <div className={styles.line}></div>
                        <div className={userCta === "Schedule Meetings" ? `${styles.btn} ${styles.active}` : styles.btn} onClick={() => setUserCta("Schedule Meetings")}>Schedule Meetings</div>
                        <div className={styles.line}></div>
                        <div className={userCta === "My Meetings" ? `${styles.btn} ${styles.active}` : styles.btn} onClick={() => setUserCta("My Meetings")}>My Meetings</div>
                    </div>
                    <div className={styles.containerBottomRight}>
                        {/* Render component based on userCta state */}
                        {userCta === "Notes" && <Notes />}
                        {userCta === "Schedule Meetings" && <ScheduleMeetings meets={meetings} meet={meet} />}
                        {userCta === "My Meetings" && <MyMeetings/>}
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;

