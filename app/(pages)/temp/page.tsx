'use client'
import React, { useEffect } from 'react'
import styles from './page.style.module.css'
import { Notes } from "@/app/components/eventDetail/Notes";

const Page = () => {
    return (
        <div className={styles.body}>
            <div className={styles.notes}>
                <Notes
                    eventId="first"
                    eventGroupId="firstabc"
                    stage="INTERNAL"
                />
            </div>
        </div>
    )
}

export default Page