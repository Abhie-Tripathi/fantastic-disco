'use client'
import React, { useEffect } from 'react'
import styles from './page.style.module.css'
import { usePathname, useRouter } from 'next/navigation'

const Page = () => {
    const pathName = usePathname();
    const trackerParams = pathName.split("/");
    const eventId = trackerParams[4]
    const router = useRouter()
    useEffect(()=>{
        router.push(`/widget/events/manage/${eventId}/overview`)
    },[])
    return (
        <div className={styles.body}>
        </div>
    )
}

export default Page
