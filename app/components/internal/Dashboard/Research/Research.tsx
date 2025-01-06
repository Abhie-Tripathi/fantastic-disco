import React, { Suspense, useCallback, useEffect, useState } from 'react'
import styles from './style.module.css'
import BackgroundImage from '/public/internal/dashboard/Researchbg.png'
import BackgroundImageDark from '/public/internal/dashboard/Researchbgdark.png'
import { MagnifyingGlass } from "geist-icons";
import Handicon from '/public/hand.png'
import Image from 'next/image';
import { Sparkles } from 'lucide-react'
import Dropdown from './Dropdown';
// import MapContainer from './MapContainer';
import LocationSelector from "@/components/search/location";
import { useFilterContext } from '@/context/filterContext';
import EventTypeSelector from '@/components/search/eventType';
import DateRangeSelector from '@/components/search/dateRange';
import SearchBar from "@/components/search/searchbar";
import { useLocationService } from '@/services/locationService';

interface Props {
    theme: string | null
}

const Research = ({ theme }: Props) => {
    const MapContainer = React.lazy(() => import('./MapContainer'));

    // const dropdowns = [{ name: "Event Type" }, { name: "Location" }, { name: "Date" }]
    const { enabledFilters, getLocalFilterValue, localFilters } = useFilterContext();
    const { getLocationDetails } = useLocationService()
    const [latLang, setLatLang] = useState<{ lat: number, long: number }>({ lat: 28.694135, long: 77.148341 })

    const getLatLong = async (locationId: string) => {
        const data: any = await getLocationDetails(locationId)
        const value = { lat: data.formattedLocations[0].latitude, long: data.formattedLocations[0].longitude }
        setLatLang(value)
    }

    useEffect(() => {
        const locationId = getLocalFilterValue("locationIds");
        const firstLocationId = locationId 
        ? locationId.split(",")[0].trim() // Split by comma and get the first value
        : null; // Handle empty or null cases

        if(firstLocationId){
            getLatLong(firstLocationId)
        }
    }, [localFilters])

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
                        <EventTypeSelector source="search" />
                        <LocationSelector source="search" />
                        <DateRangeSelector source="search" />
                    </div>
                </div>
            </div>
            <div className="mr-[80px] w-[260px] mb-[-40px]">
                <Suspense fallback={<div>Loading...</div>}>
                    <MapContainer theme={theme} latLang={latLang} />
                </Suspense>
            </div>
        </div>
    )
}

export default Research