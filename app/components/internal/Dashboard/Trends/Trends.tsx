import React from 'react'
import { ArrowRight, BarChart } from 'geist-icons'
import BarChartComponent from './BarChartComponent';
import { useRouter } from 'next/navigation';
import Trendsimage from '/public/internal/dashboard/Trendsimage.png'
import Image from 'next/image';

interface Props {
    container: string; // to check container is small or big
}

const Trends = ({ container }: Props) => {

    const router = useRouter()

    const handleRouting = () => {
        router.push("/internal/trends")
    }
    return (
        <div className={`border border-[var(--border-color)] p-3 rounded-xl ${container === "small" ? "h-[240px]" : "h-[252px]"} flex flex-col items-start justify-between overflow-hidden w-full cursor-pointer`} onClick={handleRouting}>
            <div className='flex items-center gap-1 text-[var(--primary-color)] font-semibold'>
                <BarChart color='#6750a4' width='12px' height='12px' />
                <div className={`flex items-center gap-2 cursor-pointer`}>
                    <span className='text-xs text-[var(--primary-color)] font-[var(--font-weight-semibold)]'>Event Trends</span>
                    <div><ArrowRight color='#6750a4' width='12px' height='12px' /></div>
                </div>
            </div>
            <div className='text-xs text-[var(--bold-border-color)] mt-3'>Explore event trends to tailor your experience to what’s popular and relevant.</div>
            <Image src={Trendsimage} alt='trends'/>
            {/* <div className={`w-full h-full ${container === "small" ? "mt-10" : "mt-2"}`}><BarChartComponent /></div> */}

        </div>
    )
}

export default Trends