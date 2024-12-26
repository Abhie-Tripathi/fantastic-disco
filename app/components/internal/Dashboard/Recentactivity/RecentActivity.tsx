import React from 'react'
import styles from './recentactivity.style.module.css'
import ActivitiesNull from '/public/internal/dashboard/ActivitiesNull.png'
import Activities_null_top from '/public/internal/dashboard/Activities_null_top.png'
import Image from 'next/image'

const RecentActivity = () => {
    return (
        <div className={`${styles.body} flex flex-col items-center p-3.5 relative overflow-hidden`}>
            <div className='text-xs text-[var(--secondary-text-color)] font-[var(--font-weight-medium)]'>
                No Recent Activities
            </div>
            <Image unoptimized className={`mt-5`} width={159} height={123} src={Activities_null_top} alt='null'/>
            <Image unoptimized className={`${styles.img} min-w-[327px]`} src={ActivitiesNull} alt='null' height={150} />
        </div>

    )
}

export default RecentActivity