'use client'
import React from 'react'
import Script from 'next/script'
import styles from './page.style.module.css'

const Page = () => {
    return (
        <div className={styles.list}>
            <Script src="https://static.elfsight.com/platform/platform.js" data-use-service-core defer/>
            <div className="elfsight-app-06a0bed9-f52b-4e23-9862-8aea5c7b865b" data-elfsight-app-lazy></div>
            {/* <caraouselgrid-view/> */}
        </div>
    )
}

export default Page