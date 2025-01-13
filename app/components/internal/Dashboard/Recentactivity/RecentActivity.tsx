import React, { useEffect, useState } from 'react'
import styles from './recentactivity.style.module.css'
import ActivitiesNull from '/public/internal/dashboard/ActivitiesNull.png'
import Activities_null_top from '/public/internal/dashboard/Activities_null_top.png'
import Activities_null_topdark from '/public/internal/dashboard/Activities_null_topdark.png'
import ActivitiesOpen from '/public/internal/dashboard/ActivitiesOpen.png'
import Image from 'next/image'
import ClosedCard from './ClosedCard'
import SpeakerProfile from '/public/speaker1.jpeg'
import { ChevronDown } from 'geist-icons'
import OpenCard from './OpenCard'
import { useTheme } from '@/context'

interface ProfileData {
    name: string;
    email: string;
    phoneNumber: string;
    profilePicture: string;
    department: string;
}
interface Props {
    profileData: ProfileData
    value: string; // this is to check the state of the dashboard, wether its empty or filled
}
const RecentActivity = ({ profileData, value }: Props) => {

    const {theme} = useTheme()
    console.log("profile data :", profileData)
    // const notifications = [
    //     { name: "Walter White", id: "@walter", heading: "Metioned you in conversation", mssg: "Please find the propsal", time: "9:00 AM", date: "Dec 1, 2024" },
    //     { name: "Walter White", id: "@walter", heading: "Metioned you in conversation", mssg: "Please find the propsal", time: "9:00 AM", date: "Dec 1, 2024" },
    //     { name: "Walter White", id: "@walter", heading: "Metioned you in conversation", mssg: "Please find the propsal", time: "9:00 AM", date: "Dec 1, 2024" },
    //     { name: "Walter White", id: "@walter", heading: "Metioned you in conversation", mssg: "Please find the propsal", time: "9:00 AM", date: "Dec 1, 2024" },
    //     { name: "Walter White", id: "@walter", heading: "Metioned you in conversation", mssg: "Please find the propsal", time: "9:00 AM", date: "Dec 1, 2024" },
    // ]
    // const [isEmpty, setIsEmpty] = useState<boolean>(true)

    const [notifOpen, setNotifOpen] = useState<boolean>(false)
    const [emptyFields, setEmptyFields] = useState<string[]>([]);

    useEffect(() => {
        // Find and store empty fields
        const fields = Object.keys(profileData).filter(
            (key) =>
                profileData[key as keyof ProfileData] === "" ||
                profileData[key as keyof ProfileData] === null ||
                profileData[key as keyof ProfileData] === undefined
        );
        setEmptyFields(fields);
    }, [profileData]); // Re-run when profileData changes



    return (
        <div className={`${styles.body} bg-[var(--background-secondary-color)] flex flex-col items-center p-3 relative overflow-hidden relative ${value === "filled" ? "min-h-[345px]" : "h-[40%]"} `}>
            {emptyFields.length === 0 ? <div className='text-xs text-[var(--secondary-text-color)] font-[var(--font-weight-medium)] z-10'>
                No Recent Activities
            </div> :
                <div className='w-full flex items-center justify-between z-10'>
                    <div className='flex items-center gap-2'>
                        {/* <div className='flex items-center justify-center w-[19px] h-[16px] rounded-xl text-[10px] bg-[var(--primary-color)] leading-[12px] text-white'>{notifications.length}</div> */}
                        <div className='text-xs font-semibold text-[var(--secondary-text-color)]'>Recent Activities</div>
                    </div>
                    {/* <div className='text-xs font-medium text-[var(--primary-color)]'>Mark all as read</div> */}
                </div>}
            {(!notifOpen && emptyFields.length > 0) && <div className={`w-full h-fit z-10 flex flex-col items-center justify-center ${value === "filled" ? "mt-10" : "mt-3"} relative`}>
                {emptyFields.length > 0 && <div className="absolute top-0 z-30 w-full drop-shadow">
                    <OpenCard notification={{ name: profileData.name, heading: emptyFields[0], mssg: emptyFields[0], profile: profileData.profilePicture }} />
                </div>}

                {emptyFields.length > 1 && <div className="absolute top-[20px] z-20 scale-[0.95] w-full drop-shadow">
                    <OpenCard notification={{ name: profileData.name, heading: emptyFields[1], mssg: emptyFields[1], profile: profileData.profilePicture }} />
                </div>}

                {emptyFields.length > 2 && <div className="absolute top-[40px] z-10 scale-[0.9] w-full drop-shadow" >
                    <OpenCard notification={{ name: profileData.name, heading: emptyFields[2], mssg: emptyFields[2], profile: profileData.profilePicture }} />
                </div>}
                <button onClick={() => setNotifOpen(true)}
                    className={`cursor-pointer border-none z-[999] h-[28px] w-[28px] flex items-center justify-center bg-white rounded-full shadow-md absolute ${value === "filled" ? "top-[210px]" : "top-[80px]"}`}>
                    <div className="">
                        <ChevronDown />
                    </div>
                </button>
            </div>}
            {(notifOpen && emptyFields.length > 0) &&
                <div className='flex flex-col w-full z-10 gap-2 mt-4 overflow-y-auto pr-1'>
                    {emptyFields.map((field, key) => (
                        <OpenCard key={key} notification={{ name: profileData.name, heading: field, mssg: field, profile: profileData.profilePicture }} />
                    ))}
                </div>
            }
            {(emptyFields.length === 0 && value === "filled") &&
                <Image unoptimized className={`mt-5`} width={159} height={123} src={theme === "light" ? Activities_null_top:Activities_null_topdark} alt='null' />}
            {emptyFields.length === 0 ?
                <Image unoptimized className={`${styles.img} absolute bottom-[-140px] right-[-10px] min-w-[327px]`} src={ActivitiesNull} alt='null' height={150} /> :
                (emptyFields.length > 0 && !notifOpen) ?
                    <Image unoptimized className={`${styles.img} absolute 
                    bottom-[-120px] ${value === "filled" ? "right-[-10px]" : "right-[50px] "}
                    ${value === "filled" ? "min-w-[327px]" : "min-w-[207px]"}
                   `} src={ActivitiesOpen} alt='null' height={80} /> : <></>}

        </div>

    )
}

export default RecentActivity