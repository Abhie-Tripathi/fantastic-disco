import React from 'react'
import GoTo from "@/public/goTo.svg"
import Image from 'next/image'
import Link from 'next/link'

// Define the component props interface
interface CardWidgitNoteProps {
  heading: string;
  updatedDate:string;
  content:string;
  imgUrl?: string; // Optional prop with default value
  redirectUrl?:string;
}

const CardWidgitNote: React.FC<CardWidgitNoteProps> = ({
  heading,
  updatedDate, 
  imgUrl,
  content,
  redirectUrl
}) => {
  console.log(redirectUrl);
  
  return (
    <Link href={`${redirectUrl}`} className="relative flex flex-col gap-4 bg-white border rounded-[12px] p-4 w-[100%]" style={{border:"1px solid var(--border-color)"}}>
    <div >
    
      <div className='flex justify-between gap-4' style={{color:"var(--primary-color)"}}>
        <div className='font-semibold'>{heading}</div>
        <Image src={GoTo} alt="goTo"/>
      </div>
   
      <div className='flex flex-col gap-4'>
        <div className='font-semibold text-[var(--secondary-text-color)]'>{content}</div>
        <div className="text-[10px] text-[var(--tertiary-text-color)]">Last updated : {updatedDate}</div>
        {/* <ArrowUpRight width="16px" height='16px' color='var(--primary-color)'/> */}
      </div>
      <div style={{position:"absolute", right:"15%", top:"25%", opacity:"0.15"}}>
        <Image src={imgUrl} alt="one"/>
        </div>
    </div>
    </Link>
  )
}

export default CardWidgitNote;
