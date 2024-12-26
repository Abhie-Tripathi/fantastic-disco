import React from 'react'
import { ChevronDown } from 'geist-icons'

interface Props {
  name: string;
}

const Dropdown = ({ name }: Props) => {
  return (
    <div className={`w-[172px] border p-[7.5px_12px] bg-black/10 rounded-sm text-black flex items-center justify-between`}>
      <span className='text-xs'>{name}</span>
      <ChevronDown width='12px' height='12px'/>
    </div>
  )
}

export default Dropdown