import React from 'react'
// import  from './style.module.css'
import Vectore6 from "/public/newVector.svg";
import Vectore7 from "/public/lucide_timer.svg";
import Vectore8 from "/public/expired.svg";
import { Location } from "geist-icons";
import Image from 'next/image';

interface Props {
    tracker: { name: string, country: string, type: string, new: number, past: number, active: number }
}

const TrackerCard = ({ tracker }: Props) => {
    return (
        <div className="flex justify-between cursor-pointer w-[450px]">
            <div className="flex gap-2 flex-col justify-between w-[40%]">
                <div>
                    <div className="font-semibold text-xs break-words leading-none">
                        {tracker.name.length > 45 ? `${tracker.name.substring(0, 45)}...` : tracker.name}
                    </div>
                    <div className="flex items-center gap-1 w-[100%] mt-2">
                        <span><Location style={{ color: "var(--tertiary-text-color)" }} height="10px" width="10px" /></span>
                        <span className={`text-[var(--tertiary-text-color)] text-[10px]`}>{tracker.country}</span>
                    </div>
                </div>
                <div className="badge_info w-fit border border-[var(--info-text-color))]" style={{ fontSize: "var(--font-size-xs)" }}>{tracker.type}</div>
            </div>
            <div className="flex gap-2 text-xs">
                <div className={`flex w-1/3 flex-col gap-1 items-center justify-center h-[82px] w-[66px] border border-[var(--border-color)] rounded-sm bg-[var(--primary-foreground)]`}>
                    <div className={`flex items-center justify-center gap-1 border-b-[0.39px] pb-[2px] text-[var(--primary-color)] text-[10px]`}>
                        <Image src={Vectore6} alt="newVector" width={12} height={12} />
                        New
                    </div>
                    <div style={{ color: "#454459" }} className='text-xs font-[var(--font-weight-semibold)]'>
                        {tracker.new}
                    </div>
                    <div className='text-[10px]'>Events</div>
                </div>
                <div className={`flex w-1/3 flex-col gap-1 items-center justify-center h-[82px] w-[66px] border border-[var(--border-color)] rounded-sm bg-[var(--primary-foreground)]`}>
                    <div className={`flex items-center justify-center gap-1 border-b-[0.39px] pb-[2px] text-[var(--primary-color)] text-[10px]`}>
                        <Image src={Vectore7} alt="lucide_timer" width={12} height={12} />
                        Active
                    </div>
                    <div style={{ color: "#454459" }} className='text-xs font-[var(--font-weight-semibold)]'>
                        {tracker.active}
                    </div>
                    <div className='text-[10px]'>Events</div>
                </div>
                <div className={`flex w-1/3 flex-col gap-1 items-center justify-center h-[82px] w-[66px] border border-[var(--border-color)] rounded-sm bg-[var(--primary-foreground)]`}>
                    <div className={`flex items-center justify-center gap-1 border-b-[0.39px] pb-[2px] text-[var(--primary-color)] text-[10px]`}>
                        <Image src={Vectore8} alt="expired" width={12} height={12} />
                        Past
                    </div>
                    <div style={{ color: "#454459" }} className='text-xs font-[var(--font-weight-semibold)]'>
                        {tracker.past}
                    </div>
                    <div className='text-[10px]'>Events</div>
                </div>
            </div>
        </div>
    )
}

export default TrackerCard