import React from 'react'
import { ChevronDown } from 'geist-icons'

interface Props {
  name: string;
  theme: string | null
}

const Dropdown = ({ name, theme }: Props) => {
  return (
    <div className={`w-[172px] border p-[7.5px_12px] ${theme === "light" ? "bg-black/10" : "bg-[var(--primary-foreground)]"} rounded-sm text-black flex items-center justify-between`}>
      <span className='text-xs text-[var(--primary-text-color)]'>{name}</span>
      <ChevronDown width='12px' height='12px' color={theme === "dark" ? "white" :"black"}/>
    </div>
  )
}

export default Dropdown