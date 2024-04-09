"use client"
import React,{useState} from 'react'
import styles from './page.module.css'
import Background from '@/public/background.png'
import Image from 'next/image'
import Notes from '@/app/components/eventDetail/Notes'
import SingleEvent from '@/app/components/eventDetail/SingleEvent'
import eventData from '@/public/data/demoEvent.json'
import ScheduleMeetings from '@/app/components/eventDetail/ScheduleMeetings'
const page = ({params}) => {
    const [data,setData]=useState(null);
    const [userCta,setUserCta]=useState("Notes");
    const singledata = eventData.find(item => parseInt(params?.eventDetail) === item.id);
    return (
        <div className={styles.container}>
            <div className={styles.innerContainer}>
                <div className={styles.containerLeft}><div className={styles.containerOne}><SingleEvent data={singledata}/></div></div>
                <div className={styles.containerRight}>
                    <div className={styles.containerTopRight}>
                    <div className={userCta === "Notes" ? `${styles.btn} ${styles.active}` : styles.btn} onClick={()=>setUserCta("Notes")}>Notes</div>
                    <div className={styles.line}></div>
                    <div className={userCta === "Schedule Meetings" ? `${styles.btn} ${styles.active}` : styles.btn} onClick={()=>setUserCta("Schedule Meetings")}>Schedule Meetings</div>
                    <div className={styles.line}></div>
                    <div className={userCta === "My Meetings" ? `${styles.btn} ${styles.active}` : styles.btn} onClick={()=>setUserCta("My Meetings")}>My Meetings</div>
                    </div>
                    <div className={styles.containerBottomRight}>
                       {userCta==="Notes"&& <Notes/>}
                       {userCta==="Schedule Meetings"&& <ScheduleMeetings/>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default page
