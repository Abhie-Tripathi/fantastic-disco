import React from 'react'
import ColoredTrackerIcon from "/public/trends_background.svg";
import Image, { StaticImageData } from 'next/image'
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'geist-icons';
import TrackerCard from './TrackerCard';
import TrackerImage from '/public/internal/dashboard/Tracker.png'
import { useRouter } from 'next/navigation';

interface TrackerData {
    id : string;
    location : string[]
    name : string;
    newCount : number;
    expiredCount : number; 
    activeCount : number;
    type :string;
  }
  interface Props{
    trackers : TrackerData[]
  }
const TrackerSmaller = ({trackers} : Props) => {
    // const trackers = [
    //     // { name: "Tracker 1", country: "India", type: "Custom", new:  100, past: 40, active: 20 },
    //     { name: "Tracker 2", country: "India", type: "Custom", new: 100, past: 40, active: 20 },
    //     // {name :"Tracker 3" ,country : "India", type : "Custom", new : 100, past :40, active : 20},
    //     // {name :"Tracker 4" ,country : "India", type : "Custom", new : 100, past :40, active : 20},
    // ]
    const router = useRouter()

    const handleRouting = (type: string) => {
        if (type === "button") {
            router.push("/internal/trackers")
        }
        else {
            if (trackers.length > 0) {
                router.push("/internal/trackers")
            }
        }
    }
    return (
        <div className={`w-full h-[240px] items-start border border-[var(--border-color)] rounded-xl p-4 relative overflow-hidden`}>
            <div className={`flex flex-col ${trackers.length === 0 ? "gap-4" : "gap-2"} w-[100%]`}>
                <div className='flex items-center gap-2'>
                    <div style={{ transform: 'rotate(15deg)', width: '12px', height: '12px' }}>
                        <Image src={ColoredTrackerIcon} alt="tracker" /></div>
                    <div className={`flex items-center gap-2 ${trackers.length > 0 && "cursor-pointer"}`} onClick={() => handleRouting("heading")}>
                        <span className='text-xs text-[var(--primary-color)] font-[var(--font-weight-semibold)]'>Event Tracker</span>
                        {trackers.length > 0 && <div><ArrowRight color='#6750a4' width='12px' height='12px' /></div>}
                    </div>
                </div>
                <div className='text-xs text-[var(--bold-border-color)] leading-[18px]'>
                    {trackers.length === 0 ? "Leverage the potential of smart event tracking by creating an event tracker or by using our pre-defined templates." : "Here’s your top active tracker"}
                </div>
                {trackers.length === 0 && <Button onClick={() => handleRouting("button")} className="w-[130px] z-10 mt-4 btn-default flex items-center" size="sm">Create Tracker<ArrowRight color='white' width="12px" /></Button>}
            </div>
            {trackers.length > 0 &&
                <div className='mt-7 w-full'>
                    {/* {trackers.map((tracker, key) => ( */}
                        <TrackerCard small={true} tracker={trackers[0]}/>
                    {/* ))} */}
                </div>
            }
            {trackers.length === 0 && <div className='absolute bottom-[-110px] left-[15%]'>
                <Image src={TrackerImage} alt='tracker' width={210} height={210} unoptimized />
            </div>}
        </div>
    )
}

export default TrackerSmaller