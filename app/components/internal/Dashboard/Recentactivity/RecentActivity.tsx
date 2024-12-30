import React, { useState } from 'react'
import styles from './recentactivity.style.module.css'
import ActivitiesNull from '/public/internal/dashboard/ActivitiesNull.png'
import Activities_null_top from '/public/internal/dashboard/Activities_null_top.png'
import ActivitiesOpen from '/public/internal/dashboard/ActivitiesOpen.png'
import Image from 'next/image'
import ClosedCard from './ClosedCard'
import SpeakerProfile from '/public/speaker1.jpeg'
import { ChevronDown } from 'geist-icons'
import OpenCard from './OpenCard'

const RecentActivity = () => {

    const notifications = [
        { name: "Walter White", id: "@walter", heading: "Metioned you in conversation", mssg: "Please find the propsal", time: "9:00 AM", date: "Dec 1, 2024" },
        { name: "Walter White", id: "@walter", heading: "Metioned you in conversation", mssg: "Please find the propsal", time: "9:00 AM", date: "Dec 1, 2024" },
        { name: "Walter White", id: "@walter", heading: "Metioned you in conversation", mssg: "Please find the propsal", time: "9:00 AM", date: "Dec 1, 2024" },
        { name: "Walter White", id: "@walter", heading: "Metioned you in conversation", mssg: "Please find the propsal", time: "9:00 AM", date: "Dec 1, 2024" },
        { name: "Walter White", id: "@walter", heading: "Metioned you in conversation", mssg: "Please find the propsal", time: "9:00 AM", date: "Dec 1, 2024" },
    ]

    const [notifOpen, setNotifOpen] = useState<boolean>(false)

    return (
        <div className={`${styles.body} bg-[var(--background-secondary-color)] flex flex-col items-center p-3 relative overflow-hidden relative max-h-[350px]`}>
            {notifications.length === 0 ? <div className='text-xs text-[var(--secondary-text-color)] font-[var(--font-weight-medium)]'>
                No Recent Activities
            </div> :
                <div className='w-full flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <div className='flex items-center justify-center w-[19px] h-[16px] rounded-xl text-[10px] bg-[var(--primary-color)] leading-[12px] text-white'>{notifications.length}</div>
                        <div className='text-xs font-semibold text-[var(--secondary-text-color)]'>Recent Activities</div>
                    </div>
                    <div className='text-xs font-medium text-[var(--primary-color)]'>Mark all as read</div>
                </div>}
            {(!notifOpen && notifications.length > 0) && <div className='w-full h-fit z-10 flex flex-col items-center justify-center mt-10 relative'>
                <div className="absolute top-0 z-30 w-full drop-shadow">
                    <ClosedCard notification={notifications[0]} />
                </div>
                {/* Middle Card */}
                <div className="absolute top-[20px] z-20 scale-[0.95] w-full drop-shadow">
                    <ClosedCard notification={notifications[0]} />
                </div>
                {/* Bottom Card */}
                <div className="absolute top-[40px] z-10 scale-[0.9] w-full drop-shadow" >
                    <ClosedCard notification={notifications[0]} />
                </div>
                <button onClick={() => setNotifOpen(true)}
                    className={`cursor-pointer border-none z-[999] h-[28px] w-[28px] flex items-center justify-center bg-white rounded-full shadow-md absolute top-[210px]`}>
                    <div className="">
                        <ChevronDown />
                    </div>
                </button>
            </div>}
            {(notifOpen && notifications.length > 0) &&
                <div className='flex flex-col w-full z-10 gap-2 mt-4 overflow-y-auto'>
                    {notifications.map((notif, key) => (
                        <OpenCard key={key} notification={notif} />
                    ))}
                </div>
            }
            {notifications.length === 0 &&
                <Image unoptimized className={`mt-5`} width={159} height={123} src={Activities_null_top} alt='null' />}
            {notifications.length === 0 ?
                <Image unoptimized className={`${styles.img} absolute bottom-[-120px] right-[-10px] min-w-[327px]`} src={ActivitiesNull} alt='null' height={150} /> :
                (notifications.length > 0 && !notifOpen ) ?
                <Image unoptimized className={`${styles.img} absolute bottom-[-120px] right-[-10px] min-w-[327px]`} src={ActivitiesOpen} alt='null' height={150} /> : <></>}

        </div>

    )
}

export default RecentActivity