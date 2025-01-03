import React, { useEffect, useState } from 'react'
import styles from './style.module.css'
import Image from 'next/image';
import PormoteModule from '/public/internal/dashboard/PormoteModule.png'
import PormoteModuleDark from '/public/internal/dashboard/PromoteModuleDark.png'
import { MoveRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NumberPill from '../Coordinate/NumberPill';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'geist-icons';


interface Props {
    values: { name: string, value: number }[]
    theme: string | null
}

const PromoteOne = ({ values, theme }: Props) => {

    const [isEmpty, setIsEmpty] = useState<boolean>(false)

    useEffect(() => {
        const hasNonZeroValue = values.some(item => item.value > 0);
        setIsEmpty(!hasNonZeroValue);
    }, [])

    const router = useRouter()

    const handleRouting = (type: string) => {
        if (type === 'button') {
            router.push("/widget/dashboard")
        } else {
            if (!isEmpty) {
                router.push("/widget/dashboard")
            }
        }
    }

    return (
        <div className={`flex flex-col ${isEmpty ? "items-center bg-[var(--background-secondary-color)]" : "items-start"} justify-start h-[271px] overflow-hidden w-full`}>
            <div className={`flex flex-col ${isEmpty ? "items-center" : "items-start"} justify-center p-4`}>
                <div className={`flex items-center gap-2 ${!isEmpty && "cursor-pointer"}`} onClick={() => handleRouting("heading")}>
                    <span className='text-xs text-[var(--primary-color)] font-[var(--font-weight-semibold)]'>Smart Promote</span>
                    {!isEmpty &&  <div><ArrowRight color='#6750a4' width='12px' height='12px' /></div>}
                </div>
                <div className="text-[var(--bold-border-color)] text-[10px] mt-2 text-center">
                    {isEmpty ? "Promote your events through multiple touchpoints, attracting a wider audience" : "Keep track of your widgets !"}
                </div>
                {isEmpty && <Button onClick={() => handleRouting("button")} className="mt-3 z-10 btn-default flex items-center">Promote<MoveRight width={12} /></Button>}
            </div>
            {isEmpty && <Image
                // className={`min-w-[166px] min-h-[200]`}
                src={theme === "dark" ? PormoteModuleDark : PormoteModule}
                alt="research"
                width={206}
                height={200}
                unoptimized
                style={{ marginTop: -60 }}
            />}
            {!isEmpty && <div className='flex flex-col gap-2 w-full px-4 py-2'>
                {values.map((value, key) => (
                    <NumberPill bg={!isEmpty ? "none" : ""} heading={value.name} value={value.value} width='full' />
                ))}
            </div>}
        </div>
    )
}

export default PromoteOne