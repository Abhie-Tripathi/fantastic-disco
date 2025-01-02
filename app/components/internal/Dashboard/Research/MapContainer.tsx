import React, { Suspense } from 'react'
import styles from './style.module.css'
import { MagnifyingGlass } from 'geist-icons';

interface Props {
    theme: string | null
}

const MapContainer = ({ theme }: Props) => {
    const Mapview = React.lazy(() => import('@/app/components/DetailPage/Mapview'));
    return (
        <div className={`filter drop-shadow-lg bg-[var(--accent-color)] rounded-t-[12px] p-1`}>
            <div className="relative">
                <Suspense fallback={<div>Loading...</div>}>
                    <Mapview latitude={28.694135}
                        longitude={77.148341}
                        zoom={6}
                        height={240} />
                </Suspense>
                <div className="p-[13px] absolute flex items-center gap-2 w-full rounded-t-[9px] top-0 bg-white/0 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[4.2px] border border-white/21">
                    <div className='w-[22px] h-[22px] bg-[var(--primary-foreground)] rounded-sm flex items-center justify-center'>
                        <MagnifyingGlass color='#6750a4' width="13px" height='13px' />
                    </div>
                    <div className='flex flex-col'>
                        <div className="color-black font-[var(--font-weight-medium)] text-xs">21 Hanford PI Norwalk, CT 06852</div>
                        <div className="text-xs text-[var(--secondary-text-color)]">New York, United States</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MapContainer
// 28.694135, 77.148341