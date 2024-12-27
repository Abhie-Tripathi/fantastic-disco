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
    return (
        <div className='h-[500px] flex flex-col items-center overflow-hidden relative'>
            <div className='flex flex-col items-start gap-8 p-3'>
                <div className='flex items-center gap-2'>
                    <div style={{ transform: 'rotate(15deg)', width: '12px', height: '12px' }}>
                        <Image src={ColoredTrackerIcon} alt="tracker" /></div>
                    <span className='text-xs text-[var(--primary-color)] font-[var(--font-weight-semibold)]'>Event Tracker</span>
                </div>
                <div className='text-xs text-[var(--secondary-text-color)] w-[80%]'>Leverage the potential of smart event tracking by creating an event tracker or by using our pre-defined templates.</div>
            </div>
            <div className='w-full h-[250px] py-1 px-3'>
                <Carousel templates={templates} />
            </div>
            <Button className="z-10 mt-5 btn-default flex items-center">Create Tracker<ArrowRight color='white' width="12px" /></Button>
            <div className='absolute bottom-[-180px]'>
                <Image src={TrackerImage} alt='tracker' width={370} height={370} unoptimized />
            </div>


        </div>
    )
}

export default TrackerLarge