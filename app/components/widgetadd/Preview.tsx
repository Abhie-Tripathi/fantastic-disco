'use client'
import React, {useState } from 'react'
import styles from './preview.style.module.css'
import Script from 'next/script'

interface PreviewProps {
    toggle: () => void;
    type: string;
    widgetId: string;
}

const Preview = ({ toggle, type, widgetId }: PreviewProps) => {
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
                        <sticky-widget sticky-id={widgetId} />
                        <iframe src="https://10times.com/" width={"100%"} height={"100%"}></iframe>
                    </div>
                    : type === "Page" ? <page-widget page-id={widgetId}/> : <section-widget section-id={widgetId} />}
            </div>
        </div>
    )
}

export default Preview