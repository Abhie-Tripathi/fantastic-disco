import React from 'react'
import HighMatch from '@/public/highMatch.svg'
import MediumMatch from '@/public/mediumMatch.svg'
import LowMatch from '@/public/lowMatch.svg'
import Image from 'next/image'
const AnalyticWidget = () => {
  return (
    <div className="flex flex-row gap-2 w-[100%] justify-between">
    <div className="flex flex-col w-[32%] bg-[var(--primary-foreground)] p-3 rounded-[12px] gap-3">
        <div className='flex items-center justify-center w-7 h-7 rounded-full bg-[var(--background-secondary-color)]'><Image src={HighMatch} alt="highMatch"/></div>
        <div className='flex font-bold items-baseline gap-[2px]'>139 <span className='text-[10px] font-normal'>Events</span></div>
        <div className='p-[4px] text-[10px] text-[var(--success-text-color)] bg-[var(--success-background-color)] text-center rounded-[4px]'>
            High Match
        </div>
    </div>
    <div className="flex flex-col w-[32%] bg-[var(--primary-foreground)] p-3 rounded-[12px] gap-3">
    <div className='flex items-center justify-center w-7 h-7 rounded-full bg-[var(--background-secondary-color)]'><Image src={MediumMatch} alt="mediumMatch"/></div>
        <div className='flex font-bold items-baseline gap-[2px]'>145 <span className='text-[10px] font-normal'>Events</span></div>
        <div className='p-[4px] text-[10px] text-[var(--warning-text-color)] bg-[var(--warning-background-color)] text-center rounded-[4px]'>
            High Match
        </div>
    </div>
    <div className="flex flex-col w-[32%] bg-[var(--primary-foreground)] p-3 rounded-[12px] gap-3">
    <div className='flex items-center justify-center w-7 h-7 rounded-full bg-[var(--background-secondary-color)]'><Image src={LowMatch} alt="lowMatch"/></div>
        <div className='flex font-bold items-baseline gap-[2px]'>19 <span className='text-[10px] font-normal'>Events</span></div>
        <div className='p-[4px] text-[10px] text-[var(--danger-text-color)] bg-[var(--danger-background-color)] text-center rounded-[4px]'>
            Low Match
        </div>
    </div>
    </div>
  )
}

export default AnalyticWidget
