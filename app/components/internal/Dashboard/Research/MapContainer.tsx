import React, { Suspense, useCallback, useState } from 'react'
import styles from './style.module.css'
import { MagnifyingGlass } from 'geist-icons';
import { Button } from '@/components/ui/button';
import { MoveRight } from 'lucide-react';
import { useFilterContext } from '@/context/filterContext';
import { useRouter } from 'next/navigation';

interface Props {
    theme: string | null
    latLang: { lat: number, long: number }
    location: string;
}

const MapContainer = ({ theme, latLang, location }: Props) => {
    const { localFilters } = useFilterContext();

    const locationParts = location ? location.split(",").map((part) => part.trim()) : [];
    const firstLocation = locationParts[0] || "Brooklyn"; // Get the first part
    const restLocation = locationParts.slice(1).join(", ") || "New York"; // Join the remaining parts
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
    const MapView = React.lazy(() => import('@/app/components/DetailPage/Mapview'));
    // const MapView = React.lazy(() => import("@/components/map"));
    return (
        <div className={`filter drop-shadow-lg bg-[var(--accent-color)] rounded-t-[12px] p-1`}>
            <div className="relative">
                <Suspense fallback={<div>Loading...</div>}>
                    <MapView
                        // source="search" searchParams="locationIds=24de91ad-3711-5584-b6b7-8abc21e6121f"
                        latitude={latLang.lat}
                        longitude={latLang.long}
                        zoom={6}
                        height={240}
                        source='dashboard'
                    />
                </Suspense>
                <div className="p-[13px] absolute flex items-center gap-2 w-full rounded-t-[9px] top-0 bg-white/0 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[4.2px] border border-white/21">
                    <div className='w-[22px] h-[22px] bg-[var(--primary-foreground)] rounded-sm flex items-center justify-center'>
                        <MagnifyingGlass color='#6750a4' width="13px" height='13px' />
                    </div>
                    <div className='flex flex-col'>
                        <div className="color-black font-[var(--font-weight-medium)] text-xs">{firstLocation}</div>
                        <div className="text-xs text-[var(--secondary-text-color)]">{restLocation}</div>
                    </div>
                </div>
                <div className='w-full flex justify-center absolute bottom-[50px]'>
                    <Button onClick={searchHandler} className='w-[80%]' size="sm">Explore Events <MoveRight width={12} /></Button>
                </div>

            </div>
        </div>
    )
}

export default MapContainer
// 28.694135, 77.148341