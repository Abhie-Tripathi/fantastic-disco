import React from 'react'
import PricingImage from '/public/internal/dashboard/PricingImage.png'
import Image from 'next/image'

const Pricing = () => {
    return (
        <div className="min-w-[306px] h-fit rounded-[12px] border border-[var(--border-color)] p-4">
            <div className="text-[var(--primary-color)] font-[var(--font-weight-semibold)] text-xs">
                Subscription & Plans
            </div>
            <div className='border-t-[1px] border-[var(--border-color)] mt-2' ></div>
            <div className='mt-2 bg-[#F0F7FF] rounded-xl p-4 flex flex-col w-[285px] h-[205px] items-center justify-center'>
                <Image width={37} height={34} src={PricingImage} alt='img'/>
                <div className='text-[14px] font-medium text-[#0072F5] mt-3'>You're currently on our Free Plan. </div>
                <div className='text-xs text-[#0072F5] text-center mt-3'>Reach out to us to leverage the full potential of Event Intelligence and enjoy unlimited access.</div>
            </div>
        </div> 

    )
}

export default Pricing