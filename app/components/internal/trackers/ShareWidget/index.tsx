import { ArrowUpRight } from 'geist-icons';
import React,{useState, useEffect} from 'react'

const ShareWidget: React.FC= ({})=>{
    return(
            <div className="flex flex-col gap-2 bg-white border rounded-[12px] p-2 w-[100%]" style={{border:"1px solid var(--border-color)"}}>
               <div className='flex items-center gap-2' style={{color:"var(--primary-color)"}}>
                <div>Manage Access</div>
               </div>
               <div className='flex flex-col text-sm'>
               Share or Invite your team members to keep track of events 
               </div>
               <div className='flex p-2 border rounded gap-2 justify-between h-[40px]' style={{border:"1px solid var(--border-color)"}}>
               <input
              className="outline-none w-full"
              placeholder="Email"
              // value={searchValue}
              // onChange={(e) => setSearchValue(e.target.value)}
            />
             <button className="w-[50px] flex text-white font-bold py-2 px-4 rounded text-sm items-center justify-center"
        style={{ background: "var(--primary-color)" }}>
            <span>Invite</span>
          </button>
               </div>
            </div>
    )
}
export default ShareWidget;