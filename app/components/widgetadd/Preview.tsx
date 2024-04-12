'use client'
import React, { useEffect, useState } from 'react'
import styles from './preview.style.module.css'
import Script from 'next/script'

interface PreviewProps {
    toggle: () => void;
    type: string;
    stickyId: string;
    pageQuery : string;
}

const Preview = ({ toggle, type, stickyId, pageQuery }: PreviewProps) => {
    const [toggleState, setToggleState] = useState<string>("Side Preview")

    const handleToggleState = () => {
        if (toggleState === "Side Preview") {
            setToggleState("Full Preview")
        } else setToggleState("Side Preview")
        toggle()
    }
    return (
        <div className={styles.container}>
            <Script src='https://widget-webcomp-nolit.vercel.app/dist/eventgeni.js' />
            <div className={styles.toggleHeading} onClick={handleToggleState}>{toggleState}</div>
            <div className={`${toggleState === "Side Preview" ? styles.sidescreen : styles.fullscreen}`}>
                {type === "Sticky" ?
                    <div className={styles.stickywidget}>
                        <sticky-widget sticky-id={stickyId} />
                        <iframe src="https://10times.com/" width={"100%"} height={"100%"}></iframe>
                    </div>
                    : type === "Page" ? <page-widget page-query={pageQuery}/> : <section-widget />}
            </div>
        </div>
    )
}

export default Preview