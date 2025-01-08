import React from 'react'
// import styles from './style.module.css'
import BinocularsIcon from '/public/Binoculars.svg'
import Image from 'next/image'  
import { ArrowRight } from "geist-icons";
import {LockClosed} from 'geist-icons'

const Tour = () => {
    return (
        <div className={`bg-[rgba(0,0,0,0.047)] border rounded-md p-3 flex items-center justify-between w-[100%] border-[var(--input-border-color)]`}>
            <div className="flex items-center gap-2.5">
                <div className="w-[34px] h-[34px] bg-[var(--border-color)] rounded-sm flex items-center justify-center">
                    <Image src={BinocularsIcon} alt='see' />
                </div>
                <div className="text-white text-sm">Discover features that can power your business !</div>
            </div>
            <button className="flex items-center bg-[var(--border-color)] border border-[var(--input-border-color)] gap-1 rounded-sm text-xs leading-[var(--line-height-small)] px-3 py-1.5 text-[var(--primary-color)] cursor-not-allowed" ><LockClosed width='12px' height='12px' color='grey'/>Take a Product tour<ArrowRight width='12px' height='12px' color='#6750a4' /></button>
        </div>
    )
}

export default Tour