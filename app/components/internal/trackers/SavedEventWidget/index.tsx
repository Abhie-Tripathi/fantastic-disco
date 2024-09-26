import { ArrowUpRight } from 'geist-icons';
import React,{useState, useEffect} from 'react'

const SavedEventWidget: React.FC= ({})=>{
    return(
            <div className="flex flex-col gap-2 bg-white border rounded-[12px] p-2 w-[100%]" style={{border:"1px solid var(--border-color)"}}>
               <div className='flex items-center gap-2' style={{color:"var(--primary-color)"}}>
                <div className="flex items-center justify-center w-7 h-7 rounded-full font-medium text-sm" style={{backgroundColor:"var(--primary-light-color)"}}>39</div>
                <div>Saved Events</div>
               </div>
               <div className='flex p-2 flex-col border rounded gap-2' style={{border:"1px solid var(--border-color)"}}>
                <div className='flex justify-between items-center w-[100%]'>
                    <div className='text-[12px] font-semibold'>Milano PharmaTech & LabTech Expo</div>
                    <ArrowUpRight width="16px" height='16px' color='var(--primary-color)'/>
                </div>
                <div className="text-[12px]" style={{color:"var(--secondary-text-color)"}}>Milano, Lombardia</div>
               </div>
               <div className='flex p-2 flex-col border rounded gap-2' style={{border:"1px solid var(--border-color)"}}>
                <div className='flex justify-between items-center w-[100%]'>
                    <div className='text-[12px] font-semibold'>Milano PharmaTech & LabTech Expo</div>
                    <ArrowUpRight width="16px" height='16px' color='var(--primary-color)'/>
                </div>
                <div className="text-[12px]" style={{color:"var(--secondary-text-color)"}}>Milano, Lombardia</div>
               </div>
            </div>
    )
}
export default SavedEventWidget;