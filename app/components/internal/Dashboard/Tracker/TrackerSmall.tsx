import React from 'react'
import ColoredTrackerIcon from "/public/trends_background.svg";
import Image, { StaticImageData } from 'next/image'
import Carousel from './Carousel'
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'geist-icons';
import TrackerCard from './TrackerCard';
import { useRouter } from 'next/navigation';

interface Props {
    templates: {
        type: string,
        domain: string,
        img: StaticImageData,
        url: string,
        trackerName: string,
        content: string
    }[],
    trackers : TrackerData[]
}

interface TrackerData {
    id : string;
    location : string[]
    name : string;
    newCount : number;
    expiredCount : number; 
    activeCount : number;
    type :string;
  }
const TrackerSmall = ({ templates,trackers }: Props) => {
    // const trackers = [
    //     { name: "Tracker 1", country: "India", type: "Custom", new: 100, past: 40, active: 20 },
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
        <div className={`flex ${trackers.length > 0 ? "flex-col" : "justify-between"} w-full h-[240px] items-start border border-[var(--border-color)] rounded-xl p-4`}>
            <div className={`flex flex-col ${trackers.length === 0 ? "gap-7" : "gap-2"} w-[35%]`}>
                <div className='flex items-center gap-2'>
                    <div style={{ transform: 'rotate(15deg)', width: '12px', height: '12px' }}>
                        <Image src={ColoredTrackerIcon} alt="tracker" /></div>
                    <div className={`flex items-center gap-2 ${trackers.length > 0 && "cursor-pointer"}`} onClick={() => handleRouting("heading")}>
                        <span className='text-xs text-[var(--primary-color)] font-[var(--font-weight-semibold)]'>Event Tracker</span>
                        {trackers.length > 0 && <div><ArrowRight color='#6750a4' width='12px' height='12px' /></div>}
                    </div>
                </div>
                <div className='text-xs text-[var(--bold-border-color)]'>
                    {trackers.length === 0 ? "Leverage the potential of smart event tracking by creating an event tracker or by using our pre-defined templates." : "Here’s your top active tracker"}
                </div>
                {trackers.length === 0 && <Button onClick={() => handleRouting("button")} className="w-[130px] z-10 mt-5 btn-default flex items-center" size="xs">Create Tracker<ArrowRight color='white' width="12px" /></Button>}
            </div>
            {trackers.length > 0 &&
                <div className='mt-7 w-full bg-[var(--background-secondary-color)] rounded-xl p-5'>
                    {/* {trackers.map((tracker, key) => ( */}
                    <TrackerCard small={false} tracker={trackers[0]} />
                    {/* ))} */}
                </div>
            }
            {trackers.length === 0 && <div className='h-[225px] w-[65%]'>
                <Carousel simple={true} templates={templates} />
            </div>}
        </div>
    )
}

export default TrackerSmall