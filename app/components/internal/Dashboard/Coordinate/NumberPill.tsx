import React from 'react'
import styles from './style.module.css'

interface Props {
  heading: string;
  value: number;
}

const NumberPill = ({ heading, value }: Props) => {
  return (
    <div className="w-[125px] h-[46px] bg-[var(--primary-foreground)] border border-[var(--border-color)] flex items-center justify-center gap-4 rounded-[6px]">
      <div className="text-xs font-[var(--font-weight-medium)] text-[var(--secondary-text-color)]">
        {heading}
      </div>
      <div className={`rounded-[4px] ${value > 0 ? 'bg-[#0062D1]' : 'bg-[#a8a8a8]'} text-white w-[22px] h-[16px] flex items-center justify-center text-xs leading-[14px]`}>
        {String(value).padStart(2, '0')}
      </div>
    </div>
  )
}

export default NumberPill