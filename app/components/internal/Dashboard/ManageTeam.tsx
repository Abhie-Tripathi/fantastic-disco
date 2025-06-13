import React from 'react'
import { Button } from '@/components/ui/button'
import {LockClosed} from 'geist-icons'
import { useRouter } from 'next/navigation'

const ManageTeam = () => {

    const router = useRouter()
    const handleRouting = ()=>{
        router.push("/internal/settings/product")
    }   
    return (
        <div className="min-h-[272px] xl:min-h-[147px] rounded-[12px] border border-[var(--border-color)] p-4 flex flex-col gap-3 w-full">
            <div className="text-[var(--primary-color)] font-[var(--font-weight-semibold)] text-xs">
                Configure actions & Outreach pipeline
            </div>
            <div className="text-[var(--bold-border-color)] text-xs">Personalise your workflow by renaming actions and outreach pipeline.</div>
            <Button onClick={handleRouting} size="sm" className='w-fit'>Configure</Button>
            {/* <div className="mt-[19px] w-full py-1 px-2 flex items-center justify-between bg-[var(--accent-color)] rounded-[8px]">
                <input type="text" placeholder="Email" disabled className="bg-transparent focus:outline-none w-[75%]" style={{ fontSize: 10 }}
                />
                <Button size="sm" variant="disabled"><LockClosed width='12px' height='12px' color='grey'/>Invite</Button>
            </div> */}
        </div>

    )
}

export default ManageTeam