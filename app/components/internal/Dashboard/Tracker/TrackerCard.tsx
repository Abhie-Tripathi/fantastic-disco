import React, { useState } from 'react'
// import  from './style.module.css'
import Vectore6 from "/public/newVector.svg";
import Vectore7 from "/public/lucide_timer.svg";
import Vectore8 from "/public/expired.svg";
import { Location } from "geist-icons";
import Image from 'next/image';

interface TrackerData {
    id: string;
    location: string[]
    name: string;
    newCount: number;
    expiredCount: number;
    activeCount: number;
    type: string;
}
interface Props {
    tracker: TrackerData,
    small: boolean; // if this variable is true will only show cards
}

const TrackerCard = ({ tracker, small }: Props) => {
    const [isHovered, setIsHovered] = useState(false);
    const formatType = (type: string) => {
        if (type === "CUSTOM") return "Custom"
        return type.split("_").slice(1).map((ele) => `${ele.charAt(0)}${ele.substring(1).toLowerCase()}`).join(' ')
    }

    function formatNumber(value : number) {
        if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}k`.replace('.0k', 'k'); // Avoid ".0k"
        }
        return value.toString();
    }

    return (
        <div className={`flex ${small && "flex-col"} justify-between w-full`}>
            {!small &&
                <div className="flex gap-2 flex-col justify-between w-[60%]">
                    <div>
                        <div className="font-semibold text-xs break-words leading-none">
                            {tracker.name.length > 45 ? `${tracker.name.substring(0, 45)}...` : tracker.name}
                        </div>
                        {tracker.location.length > 0 && <div className="flex items-center gap-1 w-[100%] mt-2">
                            <span><Location style={{ color: "var(--tertiary-text-color)" }} height="10px" width="10px" /></span>
                            <span className={`text-[var(--tertiary-text-color)] text-[10px] flex gap-2 items-center`}>
                                {tracker.location[0]}
                                {tracker.location.length > 1 && <div className="border w-[28px] h-[17px] flex justify-center items-center rounded-lg border-[var(--tertiary-text-color)]">
                                    +{tracker.location.length - 1}
                                </div>}
                            </span>
                        </div>}
                    </div>
                    <div className="badge_info w-fit border border-[var(--info-text-color))]" style={{ fontSize: "var(--font-size-xs)" }}>{formatType(tracker.type)}</div>
                </div>}
            {small &&
                <div className='bg-[var(--background-secondary-color)] rounded-sm flex p-2 justify-between items-center mb-3 relative'>
                    <div onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}>
                        <div className="font-semibold text-xs leading-none whitespace-nowrap">
                            {tracker.name.length > 10 ? `${tracker.name.substring(0, 10)}...` : tracker.name}
                        </div>
                        {isHovered && (
                            <div className="absolute z-10 top-[-20px] mt-1 bg-black text-white text-xs p-1 rounded shadow-lg">
                                {tracker.name}
                            </div>
                        )}
                    </div>

                    <div className="badge_info w-fit border border-[var(--info-text-color))]" style={{ fontSize: "var(--font-size-xs)" }}>{formatType(tracker.type)}</div>
                </div>}
            <div className={`flex ${small ? "justify-between" : "gap-2"} text-xs`}>
                <div className={`flex w-1/3 flex-col gap-1 items-center justify-center h-[82px] w-[66px] border border-[var(--border-color)] rounded-sm bg-[var(--primary-foreground)]`}>
                    <div className={`flex items-center justify-center gap-1 border-b-[0.39px] pb-[2px] text-[var(--primary-color)] text-[10px]`}>
                        <Image src={Vectore6} alt="newVector" width={12} height={12} />
                        New
                    </div>
                    <div className='text-[var(--primary-text-color)] text-xs font-[var(--font-weight-semibold)]'>
                        {formatNumber(tracker.newCount)}
                    </div>
                    <div className='text-[10px]'>Events</div>
                </div>
                <div className={`flex w-1/3 flex-col gap-1 items-center justify-center h-[82px] w-[66px] border border-[var(--border-color)] rounded-sm bg-[var(--primary-foreground)]`}>
                    <div className={`flex items-center justify-center gap-1 border-b-[0.39px] pb-[2px] text-[var(--primary-color)] text-[10px]`}>
                        <Image src={Vectore7} alt="lucide_timer" width={12} height={12} />
                        Active
                    </div>
                    <div className='text-[var(--primary-text-color)] text-xs font-[var(--font-weight-semibold)]'>
                        {formatNumber(tracker.activeCount)}
                    </div>
                    <div className='text-[10px]'>Events</div>
                </div>
                <div className={`flex w-1/3 flex-col gap-1 items-center justify-center h-[82px] w-[66px] border border-[var(--border-color)] rounded-sm bg-[var(--primary-foreground)]`}>
                    <div className={`flex items-center justify-center gap-1 border-b-[0.39px] pb-[2px] text-[var(--primary-color)] text-[10px]`}>
                        <Image src={Vectore8} alt="expired" width={12} height={12} />
                        Past
                    </div>
                    <div className='text-[var(--primary-text-color)] text-xs font-[var(--font-weight-semibold)]'>
                        {formatNumber(tracker.expiredCount)}
                    </div>
                    <div className='text-[10px]'>Events</div>
                </div>
            </div>
        </div>
    )
}

export default TrackerCard