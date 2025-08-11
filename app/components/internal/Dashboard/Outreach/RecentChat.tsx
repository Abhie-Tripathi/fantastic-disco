import React from 'react'
import { ClockDashed } from 'geist-icons'
import TextBox from './TextBox'
import { Button } from '@/components/ui/button'
import { MoveRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface OutreachLastChat {
    eventName: string;
    status: string;
    comment: string;
    eventId: string;
    enquiryId: string;
    enquiryStatus : string;
}
interface Props {
    outreachChat: OutreachLastChat | undefined
}

const RecentChat = ({ outreachChat }: Props) => {

    const router = useRouter()
    const handleRouting = ()=>{
        router.push(`/internal/outreach?modalOpen=true&enquiryId=${outreachChat?.enquiryId}&eventId=${outreachChat?.eventId}&status=${outreachChat?.enquiryStatus}`)
    }
    return (
        <div className='bg-[var(--background-secondary-color)] rounded-[10px] p-3 w-full h-full relative border border-[var(--border-color)]'>
            <div className='flex items-center w-full gap-2 h-[15%]'>
                <ClockDashed color='#0062D1' height='12px' width='12px' />
                <div className='w-[85%] h-full'>
                    <div className='text-xs max-h-[50%] w-full overflow-hidden text-ellipsis text-[var(--secondary-text-color)] font-medium'>{outreachChat?.eventName}</div>
                    <div className='text-[var(--info-text-color)] text-[10px]'>{outreachChat?.status}</div>
                </div>
            </div>
            <div className='border-t-[1px] border-[var(--border-color)] mt-2'></div>
            <div className='mt-3 relative flex flex-col gap-3'>
                <div><TextBox user='they' text={outreachChat?.comment} /></div>
                {/* <div className='w-full flex justify-end'><TextBox user='us' text='cassdad' /></div> */}


                {/* <div></div> */}
            </div>
            <div className='absolute w-full bottom-[10px] left-0 px-3'><Button onClick={handleRouting} className="mt-4 w-full" size="xs">View Message <MoveRight width={12} /></Button></div>

        </div>
    )
}

export default RecentChat