import React from 'react'
import styles from './style.module.css'
import Image from 'next/image';
import PormoteModule from '/public/internal/dashboard/PormoteModule.png'
import { MoveRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props{
    state : string;
}

const Promote = () => {
    return (
        <div className="bg-[var(--background-secondary-color)] border border-[var(--border-color)] flex flex-col items-center justify-start w-[233px] h-[273px] rounded-xl overflow-hidden">
            <div className={`flex flex-col items-center justify-center p-4`}>
                <div className="text-[var(--primary-color)] font-semibold text-sm">
                    Smart Promote
                </div>
                <div className="text-[var(--bold-border-color)] text-[10px] mt-2 text-center">
                    Promote your events through multiple touchpoints, attracting a wider audience
                </div>
                <Button className="mt-3 btn-default flex items-center">Promote<MoveRight width={12} /></Button>
            </div>
            <Image
                // className={`min-w-[166px] min-h-[200]`}
                src={PormoteModule}
                alt="research"
                width={206}
                height={200}
                unoptimized
                style={{ marginTop: -60 }}
            />
        </div>
    )
}

export default Promote