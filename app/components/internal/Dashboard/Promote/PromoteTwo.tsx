import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import PormoteModule from '/public/internal/dashboard/PormoteModule.png'
import { MoveRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NumberPill from '../Coordinate/NumberPill';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'geist-icons';


interface Props {
    values: { name: string, value: number }[]
}

const PromoteTwo = ({ values }: Props) => {
    const [isEmpty, setIsEmpty] = useState<boolean>(false)

    useEffect(() => {
        const hasNonZeroValue = values.some(item => item.value > 0);
        setIsEmpty(!hasNonZeroValue);
    }, [values])

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
        <div className={`flex ${isEmpty ? "flex-row bg-[var(--background-secondary-color)]" : "flex-col"}  items-start justify-start h-[271px] overflow-hidden w-full`}>
            <div className={`flex flex-col ${isEmpty && "w-[50%]"} items-start justify-center p-4`}>
                <div className={`flex items-center gap-2 ${!isEmpty && "cursor-pointer"}`} onClick={() => handleRouting("heading")}>
                    <span className='text-xs text-[var(--primary-color)] font-[var(--font-weight-semibold)]'>Smart Promote</span>
                    {!isEmpty && <div><ArrowRight color='#6750a4' width='12px' height='12px' /></div>}
                </div>
                <div className={`text-[var(--bold-border-color)] ${isEmpty ? "text-xs" : "text-[10px]"} 
                ${isEmpty ? "mt-7" : "mt-2"} ${!isEmpty && "w-[80%]"}`}>
                    Promote your events through multiple touchpoints, attracting a wider audience
                </div>
                {isEmpty && <Button onClick={() => handleRouting("button")} className="mt-10 z-10 btn-default flex items-center">Promote<MoveRight width={12} /></Button>}
            </div>
            {isEmpty && <div className='h-full w-[50%] relative'>
                <Image
                    className='absolute bottom-[-40px]'
                    // className={`min-w-[166px] min-h-[200]`}
                    src={PormoteModule}
                    alt="research"
                    width={216}
                    height={200}
                    unoptimized
                    style={{ marginTop: -60 }}
                />
            </div>}

            {!isEmpty &&
                <div className='flex gap-16 items-end'>
                    <div className='flex flex-col gap-2 px-4 py-2 w-[201px]'>
                        {values.map((value, key) => (
                            <NumberPill bg={!isEmpty ? "none" : ""} key={key} heading={value.name} value={value.value} width='201px' />
                        ))}
                    </div>
                    <Image
                        className={`mr-7`}
                        src={PormoteModule}
                        alt="research"
                        width={156}
                        height={180}
                        unoptimized
                        style={{ marginTop: -60 }}
                    />
                </div>
            }
        </div>
    )
}

export default PromoteTwo