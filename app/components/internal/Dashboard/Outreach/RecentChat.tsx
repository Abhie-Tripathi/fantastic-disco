import React from 'react'
import { ClockDashed } from 'geist-icons'
import TextBox from './TextBox'
import { Button } from '@/components/ui/button'
import { MoveRight } from 'lucide-react'

const RecentChat = () => {
    return (
        <div className='bg-[var(--background-secondary-color)] rounded-[10px] p-3 w-full h-full relative'>
            <div className='flex items-center gap-2'>
                <ClockDashed color='#0062D1' height='12px' width='12px'/>
                <div>
                    <div className='text-xs text-[var(--secondary-text-color)] font-medium'>AI- Deep Learning Confere...</div>
                    <div className='text-[var(--info-text-color)] text-[10px]'>In progress</div>
                </div>
            </div>
            <div className='border-t-[1px] border-[var(--border-color)] mt-2'></div>
            <div className='mt-3 relative flex flex-col gap-3'>
                <div><TextBox user='they' text='cassdad'/></div>
                <div className='w-full flex justify-end'><TextBox user='us' text='cassdad'/></div>
                
                
                {/* <div></div> */}
            </div>
            <div className='absolute bottom-[10px] left-[22px]'><Button className="mt-4 w-[200px]" size="xs">View Response <MoveRight width={12} /></Button></div>
            
        </div>
    )
}

export default RecentChat