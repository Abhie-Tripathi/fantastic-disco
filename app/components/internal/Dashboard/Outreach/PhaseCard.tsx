import React, { useState } from 'react'

interface Props {
    heading: string;
    value: number;
    color: string;
}

const PhaseCard = ({ heading, value, color }: Props) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div className={`h-[46px] bg-[var(--background-secondary-color)] flex items-center justify-between rounded-[10px] px-2 w-full`}>
            <div className='flex items-center gap-2 max-w-[70%]'>
                {/* <div className={`h-[35px] min-w-[4px] rounded-md`} style={{ backgroundColor: color }}></div>
                <div className="text-xs font-[var(--font-weight-medium)] overflow-hidden max-w-[80%] text-ellipsis text-[var(--secondary-text-color)] whitespace-nowrap" >
                    {heading}
                </div> */}
                <div
                    className="flex items-center gap-2 w-full relative"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className={`h-[35px] min-w-[4px] rounded-md`} style={{ backgroundColor: color }}></div>
                    <div
                        className="text-xs font-[var(--font-weight-medium)] overflow-hidden max-w-[80%] text-ellipsis text-[var(--secondary-text-color)] whitespace-nowrap"
                    >
                        {heading}
                    </div>
                    {isHovered && (
                        <div className="absolute z-20 top-[-30px] mt-1 bg-black text-white text-xs p-1 rounded shadow-lg">
                            {heading}
                        </div>
                    )}
                </div>
            </div>
            <div className={`rounded-[4px] mr-2 ${value > 0 ? 'bg-[#0062D1]' : 'bg-[#a8a8a8]'} text-white min-w-[22px] h-[16px] flex items-center justify-center text-xs leading-[14px]`}>
                {String(value).padStart(2, '0')}
            </div>
        </div>
    )
}

export default PhaseCard