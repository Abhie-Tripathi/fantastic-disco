import React, { useEffect, useState } from 'react'
import styles from './style.module.css'
import Image from 'next/image';
import PormoteModule from '/public/internal/dashboard/PormoteModule.png'
import { MoveRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NumberPill from '../Coordinate/NumberPill';

const Promote = () => {
    const values = [
        { name: "Widgets", value: 0 },
        { name: "Drafts", value: 1 },
        { name: "Events", value: 0 },
    ]
    const [isEmpty, setIsEmpty] = useState<boolean>(false)

    useEffect(() => {
        const hasNonZeroValue = values.some(item => item.value > 0);
        setIsEmpty(!hasNonZeroValue);
    }, [])

    return (
        <div className={`bg-[var(--background-secondary-color)] border border-[var(--border-color)] flex flex-col 
        ${isEmpty ? "items-center" : "items-start"} justify-start w-[233px] h-[273px] rounded-xl overflow-hidden`}>
            <div className={`flex flex-col ${isEmpty ? "items-center" : "items-start"} justify-center p-4`}>
                <div className="text-[var(--primary-color)] font-semibold text-sm">
                    Smart Promote
                </div>
                <div className="text-[var(--bold-border-color)] text-[10px] mt-2 text-center">
                    {isEmpty ? "Promote your events through multiple touchpoints, attracting a wider audience" : "Keep track of your widgets !"}
                </div>
                {isEmpty && <Button className="mt-3 btn-default flex items-center">Promote<MoveRight width={12} /></Button>}
            </div>
            {isEmpty && <Image
                // className={`min-w-[166px] min-h-[200]`}
                src={PormoteModule}
                alt="research"
                width={206}
                height={200}
                unoptimized
                style={{ marginTop: -60 }}
            />}
            {!isEmpty && <div className='flex flex-col gap-2 w-full px-4 py-2'>
                {values.map((value, key)=>(
                   <NumberPill heading={value.name} value={value.value} width='full'/>
                ))}
            </div>}
        </div>
    )
}

export default Promote