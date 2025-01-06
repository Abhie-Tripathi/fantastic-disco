import React, { useCallback } from 'react'
import styles from './style.module.css'
import BackgroundImage from '/public/internal/dashboard/Researchbg.png'
import BackgroundImageDark from '/public/internal/dashboard/Researchbgdark.png'
import { MagnifyingGlass } from "geist-icons";
import Handicon from '/public/hand.png'
import Image from 'next/image';
import { Sparkles } from 'lucide-react'
import Dropdown from './Dropdown';
import MapContainer from './MapContainer';
import LocationSelector from "@/components/search/location";
import { useFilterContext } from '@/context/filterContext';
import EventTypeSelector from '@/components/search/eventType';
import DateRangeSelector from '@/components/search/dateRange';
import SearchBar from "@/components/search/searchbar";

interface Props {
    theme: string | null
}

const Research = ({ theme }: Props) => {

    const dropdowns = [{ name: "Event Type" }, { name: "Location" }, { name: "Date" }]
    const { applyFilters, localFilters, clearLocalFilters, enabledFilters } = useFilterContext();
    return (
        <div className={`w-full h-auto gap-[61px] bg-cover bg-center border border-[var(--border-color)] rounded-xl flex items-end overflow-hidden`}
            style={{ backgroundImage: `${theme === "dark" ? `url(${BackgroundImageDark.src})` : `url(${BackgroundImage.src})`}` }}>
            <div className={`m-[20px_30px] gap-5 w-[60%] flex flex-col`}>
                <div className={`${styles.header} flex flex-col`}>
                    <div className="text-xl font-[var(--font-weight-semibold)] flex items-center gap-1">
                        <span>Welcome back</span>
                        <Image src={Handicon} alt='hand' width={20} height={20} />
                    </div>
                    <div className='text-sm text-[var(--secondary-text-color)]'>Maximize ROI from your event strategy with Whr.ai</div>
                </div>
                <div className={`w-full`}>
                    <SearchBar />
                </div>
                <div className={`${styles.filterContainer}`}>
                    <div className={`${styles.heading} flex items-center gap-0.5`}>
                        <Sparkles width={14} height={14} color='#6750a4' />
                        <span className='text-[var(--primary-color)] text-xs'>Suggested filters</span>
                    </div>
                    <div className={`${styles.filters} mt-2.5 gap-2 flex justify-between`}>
                        {/* {dropdowns.map((dropdown, key) => (
                            <Dropdown theme={theme} name={dropdown.name} key={key} />
                        ))} */}
                        <EventTypeSelector source="search" enabledTypeData={enabledFilters?.eventType} />
                        <LocationSelector source="search" />
                        <DateRangeSelector source="search" enabledDateRange={enabledFilters?.durations} />
                    </div>
                </div>
            </div>
            <div className="mr-[80px] w-[260px] mb-[-40px]">
                <MapContainer theme={theme} />
            </div>
        </div>
    )
}

export default Research