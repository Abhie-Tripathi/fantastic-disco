'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.style.module.css'
import TemplateCard from '@/app/components/TemplateViews/TemplateCard'
import StickyPreview from '@/app/components/TemplateViews/previews/StickyPreview'

const Page = () => {
    const [showAllOne, setShowAllOne] = useState(false);
    const [showAllTwo, setShowAllTwo] = useState(false);
    const [showAllThree, setShowAllThree] = useState(false);
    const [preview, setPreview] = useState("");

    const pageWidgetWithoutHighlighted = [
        { id: "id1", name: "Single Event as Hero Banner" },
        { id: "id2", name: "Multiple Events as Grid View" },
        { id: "id3", name: "Multiple Events as List view" },
        { id: "id4", name: "Multiple Events as Grid and List View" },
        { id: "id5", name: "Table View (Multiple Events)" }
    ];

    const pageWidgetWithOneHighlightedEvent = [
        { id: "id6", name: "Promoted Event as Hero Banner and List of Events" },
        { id: "id7", name: "Promoted Event as Hero Banner and Grid of Events" },
        { id: "id8", name: "Promoted Event as Hero Banner and List and Grid of Events" },
        { id: "id9", name: "Table View" },
        { id: "id10", name: "Table View (Multiple Events)" }
    ];

    const pageWidgetWithHighlightedEvents = [
        { id: "id11", name: "Promoted Events as carousel slider and Rest Events as List" },
        { id: "id12", name: "Promoted Events as carousel slider and rest Events as Grid" },
        { id: "id13", name: "Promoted Events as carousel slider and rest Events as Grid + List" },
        { id: "id14", name: "Promoted Events as Normal list (Flex Column) and Rest Events as List" },
        { id: "id15", name: "Promoted Events as Normal list (Flex Column) and Rest Events as Grid" },
        { id: "id16", name: "Promoted Events as Normal list (Flex Column) and Rest Events as List + Grid" }
    ];

    useEffect(()=>{
        window.scrollTo(0, 0); // To scroll up when ever page changes
    },[preview])

    return (
        <div className={`${styles.body} ${preview.length > 0 ? styles.bodyHeight : ""}`}>
            <div className={`${styles.templates} ${preview.length > 0 ? styles.previewOn : ""}`}>
                <div className={styles.pageWidgetTemplates}>
                    <div className={styles.widgetHeading}>Page Widget</div>
                    <div className={styles.pageTemplateTypeOne}>
                        <div className={styles.widgetSubheading}>Without Highlighted Events</div>
                        <div className={styles.templateCotntainer}>
                            {pageWidgetWithoutHighlighted.slice(0, showAllOne ? undefined : 4).map((template, index) => (
                                <TemplateCard key={index} name={template.name} isHidden={!showAllOne && index >= 4} id={template.id}
                                    setPreview={setPreview} />
                            ))}
                        </div>
                        {pageWidgetWithoutHighlighted.length > 4 && (
                            <button onClick={() => setShowAllOne(!showAllOne)} className={styles.viewAllBtn}>
                                {showAllOne ? 'Hide' : 'View All'}
                            </button>
                        )}
                    </div>
                    <div className={styles.pageTemplateTypeTwo}>
                        <div className={styles.widgetSubheading}>With One Higlighted Event</div>
                        <div className={styles.templateCotntainer}>
                            {pageWidgetWithOneHighlightedEvent.slice(0, showAllTwo ? undefined : 4).map((template, index) => (
                                <TemplateCard key={index} name={template.name} isHidden={!showAllTwo && index >= 4} id={template.id} setPreview={setPreview} />
                            ))}
                        </div>
                        {pageWidgetWithOneHighlightedEvent.length > 4 && (
                            <button onClick={() => setShowAllTwo(!showAllTwo)} className={styles.viewAllBtn}>
                                {showAllTwo ? 'Hide' : 'View All'}
                            </button>
                        )}
                    </div>
                    <div className={styles.pageTemplateTypeThree}>
                        <div className={styles.widgetSubheading}>With Multiple Higlighted Events</div>
                        <div className={styles.templateCotntainer}>
                            {pageWidgetWithHighlightedEvents.slice(0, showAllThree ? undefined : 4).map((template, index) => (
                                <TemplateCard key={index} name={template.name} isHidden={!showAllThree && index >= 4} setPreview={setPreview} id={template.id} />
                            ))}
                        </div>
                        {pageWidgetWithHighlightedEvents.length > 4 && (
                            <button onClick={() => setShowAllThree(!showAllThree)} className={styles.viewAllBtn}>
                                {showAllThree ? 'Hide' : 'View All'}
                            </button>
                        )}
                    </div>
                </div>
                <div className={styles.stickyWidgetTemplates}>
                    <div className={styles.widgetHeading}>Sticky Widget</div>
                    <div className={styles.templateCotntainer}>
                        <TemplateCard name="Sticky Top" isHidden={false} id="stickytop" setPreview={setPreview} />
                        <TemplateCard name="Sticky Footer" isHidden={false} id="stickydown" setPreview={setPreview} />
                    </div>
                </div>
            </div>
            {preview.length > 0 && <div className={styles.previewWindow}>
                {preview === "stickytop" ? <StickyPreview type="top" setPreview={setPreview} /> :
                    preview === "stickydown" ? <StickyPreview type="down" setPreview={setPreview}/> : <></>}
            </div>}
        </div>
    )
}

export default Page