import React from 'react'
import SpeakerProfile from '/public/speaker1.jpeg'
import {Email} from 'geist-icons'
import Image from 'next/image'
import { useTheme } from '@/context'

interface Props {
  notification: { name: string, id: string, heading: string, mssg: string, time: string, date: string }
}

const ClosedCard = ({ notification }: Props) => {

  const {theme} = useTheme() 

  return (
    <div className='w-full h-[154px] border border-[var(--border-color)] rounded-md bg-[var(--primary-foreground)] p-3'>
      <div className='flex justify-between w-full items-center'>
        <div className='flex items-center gap-1'>
          <Image src={SpeakerProfile} width={29} height={29} alt='profile' className='rounded-[30px]'/>
          <div className='flex flex-col gap-1'>
            <div className='text-[10px] font-semibold'>{notification.name}</div>
            <div className='text-[10px] text-[(--background-secondary-color-active)]'>{notification.id}</div>
          </div>
        </div>
        <div><Email color={theme === "dark" ? "white" : "black"} width='12px' height='18px' /></div>
      </div>
      <div className='flex flex-col gap-1 mt-2'>
        <div className='text-xs font-semibold text-[var(--secondary-text-color)]'>{notification.heading}</div>
        <div className='text-[10px] text-[var(--secondary-text-color)]' >{notification.mssg}</div>
        <div className='text-[#657786] flex gap-1 items-center text-[10px]'>
          <span>{notification.time}</span><span>-</span><span>{notification.date}</span>
        </div>
      </div>
      <div className='border-t-[1px] border-[var(--border-color)] mt-1'></div>
      <div className='flex items-center text-[10px] gap-2 mt-2'>
        <div><span className='font-semibold'>1 </span><span className='text-[#657786]'>Reply</span></div>
        <div><span className='font-semibold'>10 </span><span className='text-[#657786]'>Likes</span></div> 
      </div>
    </div>
  )
}

export default ClosedCard