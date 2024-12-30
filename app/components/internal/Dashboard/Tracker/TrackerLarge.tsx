import { StaticImageData } from 'next/image'
import React from 'react'
import TrackerTemplateCard from './TrackerTemplateCard'
import Carousel from './Carousel'
import styles from './style.module.css'
import TrackerImage from '/public/internal/dashboard/Tracker.png'
import ColoredTrackerIcon from "/public/trends_background.svg";
import Image from 'next/image'
import { ArrowRight } from "geist-icons"
import { Button } from '@/components/ui/button'
import TrackerCard from './TrackerCard'

interface Props {
    templates: {
        type: string,
        domain: string,
        img: StaticImageData,
        url: string,
        trackerName: string,
        content: string
    }[]
}

const TrackerLarge = ({ templates }: Props) => {

    const trackers = [
        { name: "Tracker 1", country: "India", type: "Custom", new: 100, past: 40, active: 20 },
        // {name :"Tracker 2" ,country : "India", type : "Custom", new : 100, past :40, active : 20},
        // {name :"Tracker 3" ,country : "India", type : "Custom", new : 100, past :40, active : 20},
        // {name :"Tracker 4" ,country : "India", type : "Custom", new : 100, past :40, active : 20},
    ]

    // let events = 1

    return (
        <div className={`${trackers.length === 0 && "bg-[var(--background-secondary-color)]"} border border-[var(--border-color)] h-[500px] w-[536px] flex flex-col items-center overflow-hidden relative rounded-xl p-3`}>
            <div className={`flex flex-col items-start ${trackers.length > 0 ? "gap-3" : "gap-8"} w-full`}>
                <div className='flex items-center gap-2'>
                    <div style={{ transform: 'rotate(15deg)', width: '12px', height: '12px' }}>
                        <Image src={ColoredTrackerIcon} alt="tracker" /></div>
                    <span className='text-xs text-[var(--primary-color)] font-[var(--font-weight-semibold)]'>Event Tracker</span>
                </div>
                <div className='text-xs text-[var(--bold-border-color)] w-[80%]'>
                    {trackers.length === 0 ? "Leverage the potential of smart event tracking by creating an event tracker or by using our pre-defined templates." :
                        trackers.length === 1 ? "Here’s your top active tracker" : "Here’s a quick access to your event trackers"}
                </div>
            </div>
            {trackers.length > 0 &&
                <div className='mt-5 w-full'>
                    {trackers.map((tracker, key) => (
                        <div key={key}>
                            <TrackerCard tracker={tracker} />
                            <div className='border border-[var(--border-color)] mt-3 mb-3'></div>
                        </div>
                    ))}
                </div>
            }
            {(trackers.length === 1 || trackers.length === 0) &&
                <div className={`w-full h-[250px] py-1 px-3 ${trackers.length === 1 ? "bg-[var(--background-secondary-color)] py-3 h-full rounded-xl" : ""}`}>
                    {trackers.length === 1 && <div className='text-xs text-[var(--bold-border-color)]'>Leverage the potential of smart event tracking by creating an event tracker or by using our pre-defined templates.</div>}
                    <Carousel simple={false} templates={templates} />
                </div>}
            {trackers.length === 0 && <Button className="z-10 mt-5 btn-default flex items-center">Create Tracker<ArrowRight color='white' width="12px" /></Button>}
            {trackers.length === 0 && <div className='absolute bottom-[-180px]'>
                <Image src={TrackerImage} alt='tracker' width={370} height={370} unoptimized />
            </div>}


        </div>
    )
}

export default TrackerLarge