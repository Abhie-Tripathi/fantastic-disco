'use client'
import React from 'react'
import Script from 'next/script'
import styles from './page.style.module.css'

const Page = () => {
    return (
        <div className={styles.list}>
            <Script src='https://widget-webcomp-nolit.vercel.app/dist/eventgeni.js'/>
            {/* <caraouselgrid-view/> */}
        </div>
    )
}

export default Page