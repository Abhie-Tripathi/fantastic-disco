import React from 'react'
import { Button } from '@/components/ui/button'

const ManageTeam = () => {
    return (
        <div className="min-w-[306px] max-h-[117px] rounded-[12px] border border-[var(--border-color)] p-4">
            <div className="text-[var(--primary-color)] font-[var(--font-weight-semibold)] text-xs">
                Manage Team
            </div>
            <div className="text-[var(--primary-text-color)]" style={{ fontSize: 10 }}>Share or Invite your team members to keep track of events</div>
            <div className="mt-[19px] w-full py-1 px-2 flex items-center justify-between bg-[var(--primary-light-color)] rounded-[8px]">
                <input type="text" placeholder="Email" className="bg-transparent focus:outline-none" style={{ fontSize: 10 }}
                />
                <Button size="sm">Invite</Button>
            </div>
        </div>

    )
}

export default ManageTeam