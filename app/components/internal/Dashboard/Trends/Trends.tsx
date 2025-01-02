import React from 'react'
import { BarChart } from 'geist-icons'
import BarChartComponent from './BarChartComponent';

interface Props {
    container: string; // to check container is small or big
}

const Trends = ({ container }: Props) => {
    return (
        <div className={`border border-[var(--border-color)] p-3 rounded-xl ${container === "small" ? "h-[250px] w-[261px]" : "h-[276px] w-[466px]"} flex flex-col items-start overflow-hidden`}>
            <div className='flex items-center gap-1 text-[var(--primary-color)] font-semibold'>
                <BarChart color='#6750a4' width='12px' height='12px'/>
                <span className='text-xs'>Outreach</span>
            </div>
            <div className='text-[10px] text-[var(--bold-border-color)] mt-3'>Explore event trends to tailor your experience to what’s popular and relevant.</div>
            <div className={`w-full h-full ${container === "small" ? "mt-10" : "mt-2"}`}><BarChartComponent/></div>
            
        </div>
    )
}

export default Trends