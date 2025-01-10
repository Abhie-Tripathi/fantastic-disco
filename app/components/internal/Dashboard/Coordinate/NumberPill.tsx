import React from 'react'
interface Props {
  heading: string;
  value: number;
  width : string;
  bg : string;
}

const NumberPill = ({ heading, value, width, bg }: Props) => {
  return (
    <div style={{width : width}} className={`w-[${width}] h-[46px] ${bg !== "none" ? "bg-[var(--primary-foreground)] border" : "bg-[var(--background-secondary-color)]"} border-[var(--border-color)] flex items-center justify-between rounded-[6px] px-4`}>
      <div className="text-xs font-[var(--font-weight-medium)] text-[var(--secondary-text-color)] max-w-[80%] overflow-hidden text-ellipsis text-nowrap">
        {heading}
      </div>
      <div className={`rounded-[4px] ${value > 0 ? 'bg-[#0062D1]' : 'bg-[#a8a8a8]'} text-white w-[22px] h-[16px] flex items-center justify-center text-xs leading-[14px]`}>
        {String(value).padStart(2, '0')}
      </div>
    </div>
  )
}

export default NumberPill