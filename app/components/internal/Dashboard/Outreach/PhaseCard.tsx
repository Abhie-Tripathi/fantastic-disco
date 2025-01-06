import React from 'react'

interface Props {
    heading: string;
    value: number;
    color: string;
}

const PhaseCard = ({ heading, value, color }: Props) => {
    return (
        <div className={`h-[46px] bg-[var(--background-secondary-color)] flex items-center justify-between rounded-[10px] px-2 w-full`}>
            <div className='flex items-center gap-2 max-w-[75%]'>
                <div className={`h-[35px] min-w-[4px] rounded-md`} style={{backgroundColor : color}}></div>
                <div className="text-xs font-[var(--font-weight-medium)] overflow-hidden max-w-[90%] text-ellipsis text-[var(--secondary-text-color)]">
                    {heading}
                </div>
            </div>

            <div className={`rounded-[4px] mr-2 ${value > 0 ? 'bg-[#0062D1]' : 'bg-[#a8a8a8]'} text-white w-[22px] h-[16px] flex items-center justify-center text-xs leading-[14px]`}>
                {String(value).padStart(2, '0')}
            </div>
        </div>
    )
}

export default PhaseCard