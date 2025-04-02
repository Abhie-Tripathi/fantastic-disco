import React, { Suspense, useCallback, useEffect, useState } from 'react'
// import styles from './style.module.css'
import BackgroundImage from '/public/internal/dashboard/Researchbg.png'
import BackgroundImageDark from '/public/internal/dashboard/Researchbgdark.png'
import { MagnifyingGlass } from "geist-icons";
import Handicon from '/public/hand.png'
import Image from 'next/image';
import { MoveRight, Sparkles } from 'lucide-react'
import Dropdown from './Dropdown';
// import MapContainer from './MapContainer';
import LocationSelector from "@/components/search/location";
import { useFilterContext } from '@/context/filterContext';
import EventTypeSelector from '@/components/search/eventType';
import DateRangeSelector from '@/components/search/dateRange';
import SearchBar from "@/components/search/searchbar";
import { useLocationService } from '@/services/locationService';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { isEventeli } from '@/config';

interface Props {
    theme: string | null
}

const Research = ({ theme }: Props) => {
    const MapContainer = React.lazy(() => import('./MapContainer'));

    // const dropdowns = [{ name: "Event Type" }, { name: "Location" }, { name: "Date" }]
    const { getLocalFilterValue, localFilters } = useFilterContext();
    const { getLocationDetails } = useLocationService()
    const [latLang, setLatLang] = useState<{ lat: number, long: number }>({ lat: 40.691293, long: -73.986610 })
    const [locationName, setLocationName] = useState<string>("")

    const getLatLong = async (locationId: string) => {
        const data: any = await getLocationDetails(locationId)
        const value = { lat: data.formattedLocations[0].latitude, long: data.formattedLocations[0].longitude }
        setLatLang(value)
        setLocationName(data.formattedLocations[0].displayName)
    }

    useEffect(() => {
        const locationId = getLocalFilterValue("locationIds");
        const viewBound = getLocalFilterValue("viewBound");

        if (locationId) {
            const firstLocationId = locationId
            ? locationId.split(",")[0].trim() // Split by comma and get the first value
            : null; // Handle empty or null cases

            if (firstLocationId) {
                getLatLong(firstLocationId)
            }
        } else if (isEventeli && viewBound) {
            const view_bound = JSON.parse(viewBound);
            const value = { lat: view_bound?.coordinates?.latitude, long: view_bound?.coordinates?.longitude }
            setLatLang(value);
        }
        
    }, [localFilters])
    const router = useRouter()

    const searchHandler = () => {
        const params = new URLSearchParams();
        Object.entries(localFilters).forEach(([key, value]) => {
            if (value && key !== "skip") {
                params.set(key, value);
            }
        });
        console.log('params', params);
        router.push(`/internal/search/events?${params.toString()}`, { scroll: false });
    };

    return (
        <div className={`w-full h-auto bg-cover bg-center border border-[var(--border-color)] rounded-xl flex items-end overflow-hidden gap-[40px]`}
            style={{ backgroundImage: `${theme === "dark" ? `url(${BackgroundImageDark.src})` : `url(${BackgroundImage.src})`}` }}>
            <div className={`m-5 gap-5 w-[60%] max-[1100px]:w-full flex flex-col`}>
                <div className={`flex flex-col`}>
                    <div className="text-xl font-[var(--font-weight-semibold)] flex items-center gap-1">
                        <span>Welcome back</span>
                        <Image src={Handicon} alt='hand' width={20} height={20} />
                    </div>
                    <div className='text-sm text-[var(--secondary-text-color)]'>Maximize ROI from your event strategy with Whr.ai</div>
                </div>
                <div className={`w-full relative`}>
                    <SearchBar />
                    <div className='hidden top-[10px] right-[10px] absolute max-[1100px]:block max-[468px]:hidden'>
                        <Button onClick={searchHandler} className='flex items-center gap-1' size="sm">Explore Events <MoveRight width={12} /></Button>
                    </div>
                    <div className='hidden top-[10px] right-[10px] absolute max-[468px]:block'>
                        <Button onClick={searchHandler} className='' size="sm"><MoveRight width={12} /></Button>
                    </div>

                </div>
                <div>
                    <div className={`flex items-center gap-0.5`}>
                        <Sparkles width={14} height={14} color='#6750a4' />
                        <span className='text-[var(--primary-color)] text-xs'>Suggested filters</span>
                    </div>
                    <div className="mt-2.5 grid lg:grid-cols-3 grid-cols-3 gap-3 max-[780px]:hidden">
                        <EventTypeSelector variant="popover"/>
                        <LocationSelector/>
                        <DateRangeSelector/>
                    </div>
                    <div className="mt-2.5 flex-col gap-2 hidden max-[780px]:flex">
                        <div className='flex gap-2 max-[577px]:flex-col'>
                            <EventTypeSelector variant="popover"/>
                            <LocationSelector/>
                        </div>
                        <div className='w-[50%] max-[577px]:w-full'><DateRangeSelector source="search" /></div>
                    </div>

                </div>
            </div>
            <div className="w-[260px] mb-[-40px] max-[1100px]:hidden">
                <Suspense fallback={<div>Loading...</div>}>
                    <MapContainer searchHandler={searchHandler} location={locationName} theme={theme} latLang={latLang} />
                </Suspense>
            </div>
        </div>
    )
}

export default Research