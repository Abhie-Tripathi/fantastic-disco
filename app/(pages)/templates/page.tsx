'use client'
import React, { useState } from 'react'
import styles from './page.style.module.css'
import TemplateCard from '@/app/components/TemplateViews/TemplateCard'

const page = () => {
    const [showAllOne, setShowAllOne] = useState(false);
    const [showAllTwo, setShowAllTwo] = useState(false);
    const [showAllThree, setShowAllThree] = useState(false);

    const pageWidgetWithoutHighlighted = ["Single Event as Hero Banner",
        "Multiple Events as Grid View",
        "Multiple Events as List view",
        "Multiple Events as Grid and List View",
        "Table View (Multiple Events)"
    ]
    const pageWidgetWithOneHighlightedEvent = ["Promoted Event as Hero Banner and List of Events",
        "Promoted Event as Hero Banner and Grid of Events",
        "Promoted Event as Hero Banner and List and Grid of Events",
        "Table View",
        "Table View (Multiple Events)"
    ]
    const pageWidgetWithHighlightedEvents = ["Promoted Events as carousel slider and Rest Events as List",
    "Promoted Events as carousel slider and rest Events as Grid",
    "Promoted Events as carousel slider and rest Events as Grid + List",
    "Promoted Events as Normal list (Flex Column) and Rest Events as List",
    "Promoted Events as Normal list (Flex Column) and Rest Events as Grid",
    "Promoted Events as Normal list (Flex Column) and Rest Events as List + Grid "
]


    return (
        <div className={styles.body}>
            <div className={styles.pageWidgetTemplates}>
                <div className={styles.widgetHeading}>Page Widget</div>
                <div className={styles.widgetSubheading}>Without Highlighted Events</div>
                <div className={styles.templateCotntainer}>
                    {pageWidgetWithoutHighlighted.slice(0, showAllOne ? undefined : 4).map((template, index) => (
                        <TemplateCard key={index} name={template} isHidden={!showAllOne && index >= 4} />
                    ))}
                </div>
                {pageWidgetWithoutHighlighted.length > 4 && !showAllOne && (
                    <button onClick={() => setShowAllOne(true)} className={styles.viewAllBtn}>View All</button>
                )}
                <div className={styles.widgetSubheading}>With One Higlighted Event</div>
                <div className={styles.templateCotntainer}>
                    {pageWidgetWithOneHighlightedEvent.slice(0, showAllTwo ? undefined : 4).map((template, index) => (
                        <TemplateCard key={index} name={template} isHidden={!showAllTwo && index >= 4} />
                    ))}
                </div>
                {pageWidgetWithOneHighlightedEvent.length > 4 && !showAllTwo && (
                    <button onClick={() => setShowAllTwo(true)} className={styles.viewAllBtn}>View All</button>
                )}
                <div className={styles.widgetSubheading}>With Multiple Higlighted Events</div>
                <div className={styles.templateCotntainer}>
                    {pageWidgetWithHighlightedEvents.slice(0, showAllThree ? undefined : 4).map((template, index) => (
                        <TemplateCard key={index} name={template} isHidden={!showAllThree && index >= 4} />
                    ))}
                </div>
                {pageWidgetWithHighlightedEvents.length > 4 && !showAllThree && (
                    <button onClick={() => setShowAllThree(true)} className={styles.viewAllBtn}>View All</button>
                )}
            </div>
            <div className={styles.stickyWidgetTemplates}>
                <div className={styles.widgetHeading}>Sticky Widget</div>
                <div className={styles.templateCotntainer}>
                    <TemplateCard name="Sticky Top" isHidden={false} />
                    <TemplateCard name="Sticky Footer" isHidden={false}/>
                </div>
            </div>
        </div>
    )
}

export default page