import React from 'react'
import GoTo from "@/public/goTo.svg"
import Image from 'next/image'

// Define the component props interface
interface CardWidgitConfigProps {
  heading: string;
  content:string;
  imgUrl?: string; // Optional prop with default value
}

const CardWidgitConfig: React.FC<CardWidgitConfigProps> = ({
  heading,
  imgUrl,
  content
}) => {
  return (
    <div className="relative flex flex-col gap-4 bg-white border rounded-[12px] p-4 w-[100%]" style={{border:"1px solid var(--border-color)"}}>
    
      <div className='flex justify-between gap-4' style={{color:"var(--primary-color)"}}>
        <div className='font-semibold'>{heading}</div>
        <Image src={GoTo} alt="goTo"/>
      </div>
   
      <div className='flex flex-col gap-4'>
        <div className='text-[var(--secondary-text-color)]'>{content}</div>
        {/* <ArrowUpRight width="16px" height='16px' color='var(--primary-color)'/> */}
      </div>
      <div style={{position:"absolute", right:"15%", top:"25%", opacity:"0.15"}}>
        <Image src={imgUrl} alt="one"/>
        </div>
    </div>
  )
}

export default CardWidgitConfig;
