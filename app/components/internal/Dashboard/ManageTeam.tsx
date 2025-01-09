import React from 'react'
import { Button } from '@/components/ui/button'
import {LockClosed} from 'geist-icons'

const ManageTeam = () => {
    return (
        <div className="max-w-[320px] min-h-[147px] rounded-[12px] border border-[var(--border-color)] p-4">
            <div className="text-[var(--primary-color)] font-[var(--font-weight-semibold)] text-xs">
                Manage Team
            </div>
            <div className="text-[var(--bold-border-color)] text-xs">Share or Invite your team members to keep track of events</div>
            <div className="mt-[19px] w-full py-1 px-2 flex items-center justify-between bg-[var(--accent-color)] rounded-[8px]">
                <input type="text" placeholder="Email" disabled className="bg-transparent focus:outline-none w-[75%]" style={{ fontSize: 10 }}
                />
                <Button size="sm" variant="disabled"><LockClosed width='12px' height='12px' color='grey'/>Invite</Button>
            </div>
        </div>

    )
}

export default ManageTeam