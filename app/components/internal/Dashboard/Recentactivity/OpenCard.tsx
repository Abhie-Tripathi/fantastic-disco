import React from 'react'
import SpeakerProfile from '/public/speaker1.jpeg'
import { Email } from 'geist-icons'
import Image from 'next/image'

interface Props {
    notification: { name: string, id: string, heading: string, mssg: string, time: string, date: string }
}

const OpenCard = ({ notification }: Props) => {
    return (
        <div className='flex gap-2 items-start w-full h-[70px] rounded-md bg-[var(--neutral-light-color)] p-3'>
            <Image src={SpeakerProfile} width={29} height={29} alt='profile' className='rounded-[30px]' />
            <div className='flex flex-col w-full'>
                <div className='text-[10px] font-semibold'>{notification.name}</div>
                <div className='flex items-center justify-between w-full'>
                    <div className='text-[10px] text-[var(--secondary-text-color)]'>{notification.heading}</div>
                    <div><Email width='12px' height='18px' /></div>
                </div>
                <div className='text-[#657786] flex gap-1 items-center text-[10px]'>
                    <span>{notification.time}</span><span>-</span><span>{notification.date}</span>
                </div>
            </div>
        </div>
    )
}

export default OpenCard