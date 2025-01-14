import React from 'react'
import SpeakerProfile from '/public/speaker1.jpeg'
import { Email } from 'geist-icons'
import Image from 'next/image'
import { useTheme } from '@/context'

interface Props {
    notification: { name: string, heading: string, mssg: string, profile : string }
}

const OpenCard = ({ notification }: Props) => {
    const {theme} = useTheme()
    return (
        <div className='flex gap-2 items-start w-full h-[70px] rounded-md bg-[var(--neutral-light-color)] p-3'>
            {notification.profile ? <Image src={notification.profile} width={29} height={29} alt='profile' className='rounded-[30px]' /> :
            <div className='w-[29px] h-[29px] flex items-center justify-center rounded-[30px] bg-primary text-white'>{notification.name.substring(0,1).toUpperCase()}</div>
            }

            <div className='flex flex-col w-full'>
                <div className='text-[10px] font-semibold'>{notification.name}</div>
                <div className='flex items-center justify-between w-full'>
                    <div className='text-[10px] text-[var(--secondary-text-color)]'>
                        {notification.heading === "department" ? "Department" : notification.heading === "phoneNumber" ? "Phone Number" : notification.heading === "profilePicture" ? "Profile Picture" : notification.heading === "name" ? "Name" : ""} is missing from your profile</div>
                    {/* <div><Email color={theme === "dark" ? "white" : "black"} width='12px' height='18px' /></div> */}
                </div>
                {/* <div className='text-[#657786] flex gap-1 items-center text-[10px]'>
                    <span>{notification.time}</span><span>-</span><span>{notification.date}</span>
                </div> */}
            </div>
        </div>
    )
}

export default OpenCard