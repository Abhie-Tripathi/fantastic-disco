'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.style.module.css'
import TemplateCard from '@/app/components/TemplateViews/TemplateCard'
import StickyPreview from '@/app/components/TemplateViews/previews/sticky/StickyPreview'
import HeroBanner from '@/app/components/TemplateViews/previews/page/MultipleEvents/HeroBanner'
import GridView from '@/app/components/TemplateViews/previews/page/MultipleEvents/GridView'
import ListView from '@/app/components/TemplateViews/previews/page/MultipleEvents/ListView'
import ListAndGridView from '@/app/components/TemplateViews/previews/page/MultipleEvents/ListAndGridView'
import HeroBannerAndViews from '@/app/components/TemplateViews/previews/page/SinglePromotedAndEvents/HeroBannerAndViews'
import CaraouselAndViews from '@/app/components/TemplateViews/previews/page/MultipleHighlightedEvents/CaraouselAndViews'
import CaraouselTop from '@/app/components/TemplateViews/previews/section/CaraouselTop'
import ScrollView from '@/app/components/TemplateViews/previews/section/ScrollView'

const Page = () => {
    const [showAllOne, setShowAllOne] = useState(false);
    const [showAllTwo, setShowAllTwo] = useState(false);
    const [showAllThree, setShowAllThree] = useState(false);
    const [preview, setPreview] = useState("");

    const pageWidgetWithoutHighlighted = [
        { id: "sehb", name: "Single Event as Hero Banner" },
        { id: "megv", name: "Multiple Events as Grid View" },
        { id: "melv", name: "Multiple Events as List view" },
        { id: "melgv", name: "Multiple Events as Grid and List View" },
        { id: "id5", name: "Table View (Multiple Events)" }
    ];

    const pageWidgetWithOneHighlightedEvent = [
        { id: "phblv", name: "Promoted Event as Hero Banner and List of Events" },
        { id: "phbgv", name: "Promoted Event as Hero Banner and Grid of Events" },
        { id: "phblgv", name: "Promoted Event as Hero Banner and List and Grid of Events" },
        { id: "ptv", name: "Table View" },
        { id: "id10", name: "Table View (Multiple Events)" }
    ];

    const pageWidgetWithHighlightedEvents = [
        { id: "pcslv", name: "Promoted Events as carousel slider and Rest Events as List" },
        { id: "pcsgv", name: "Promoted Events as carousel slider and rest Events as Grid" },
        { id: "pcslgv", name: "Promoted Events as carousel slider and rest Events as Grid + List" },
        { id: "id14", name: "Promoted Events as Normal list (Flex Column) and Rest Events as List" },
        { id: "id15", name: "Promoted Events as Normal list (Flex Column) and Rest Events as Grid" },
        { id: "id16", name: "Promoted Events as Normal list (Flex Column) and Rest Events as List + Grid" }
    ];

    const sectionWidgetEvents = [
        {id : "tscv", name : "Top Section of page as Caraousel View"},
        {id : "tshs", name : "Top Section of page as Horizontal Scroll"},
        {id : "lsvs", name : "Left Section of page as Vertical Scroll"}
    ]

    useEffect(() => {
        window.scrollTo(0, 0); // To scroll up when ever page changes
        console.log("preview is", preview)
    }, [preview])

    return (
        <div className={`${styles.body} ${preview.length > 0 ? styles.bodyHeight : ""}`}>
            <div className={`${styles.templates} ${preview.length > 0 ? styles.previewOn : ""}`}>
                <div className={styles.pageWidgetTemplates}>
                    <div className={styles.widgetHeading}>Page Widget</div>
                    <div className={styles.pageTemplateTypeOne}>
                        <div className={styles.widgetSubheading}>Without Highlighted Events</div>
                        <div className={styles.templateContainer}>
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
                        <div className={styles.templateContainer}>
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
                        <div className={styles.templateContainer}>
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
                <div className={styles.sectionWidgetTemplates}>
                    <div className={styles.widgetHeading}>Section Widget</div>
                    <div className={styles.templateContainer}>
                            {sectionWidgetEvents.map((template, index) => (
                                <TemplateCard key={index} name={template.name} isHidden={false} setPreview={setPreview} id={template.id} />
                            ))}
                        </div>
                </div>
                <div className={styles.stickyWidgetTemplates}>
                    <div className={styles.widgetHeading}>Sticky Widget</div>
                    <div className={styles.templateContainer}>
                        <TemplateCard name="Sticky Top" isHidden={false} id="stickytop" setPreview={setPreview} />
                        <TemplateCard name="Sticky Footer" isHidden={false} id="stickydown" setPreview={setPreview} />
                    </div>
                </div>
            </div>
            {preview.length > 0 && <div className={styles.previewWindow}>
                <div className={styles.heading_btnContainer}>
                    <div className={styles.heading}>
                        {preview==="stickytop" ? "Sticky Top" :
                        preview === "stickydown" ? "Sticky Footer" :
                        preview==="sehb"? "Hero Banner":
                        preview==="megv"? "Grid View":
                        preview==="melv"? "List View":
                        preview==="melgv"? "List and Grid view":
                        preview==="phblv"? "Hero Banner and List view":
                        preview==="phbgv"? "Hero Banner and Grid view":
                        preview==="phblgv"? "Hero Banner and List Grid view":
                        preview==="pcslv"? "Caraousel and List view":
                        preview==="pcsgv"? "Caraousel and Grid view":
                        preview==="pcslgv"? "Caraousel and List Grid view":
                        preview==="tscv"? "Top Section Caraousel view":
                        preview==="tshs"? "Top Section Horizontal Scroll view":
                        preview==="lsvs"? "Left Section Veritcal Scroll view":""}
                    </div>
                    <div className={styles.closeBtn} onClick={() => setPreview("")}>x</div>
                </div>
                {preview === "stickytop" ? <StickyPreview type="top" /> :
                preview === "stickydown" ? <StickyPreview type="down" /> :
                preview === "sehb" ? <HeroBanner /> :
                preview === "megv" ? <GridView /> :
                preview === "melv" ? <ListView /> :
                preview === "melgv" ? <ListAndGridView /> :
                preview === "phblv" ? <HeroBannerAndViews type='list'/>:
                preview === "phbgv" ? <HeroBannerAndViews type='grid'/>:
                preview === "phblgv" ? <HeroBannerAndViews type='listandgrid'/>:
                preview === "pcslv" ? <CaraouselAndViews type='list'/>:
                preview === "pcsgv" ? <CaraouselAndViews type='grid'/>:
                preview === "pcslgv" ? <CaraouselAndViews type='listandgrid'/>:
                preview === "tscv" ? <CaraouselTop/>:
                preview === "tshs" ? <ScrollView type='top'/>:
                preview === "lsvs" ? <ScrollView type='left'/>:<></>}
            </div>}
        </div>
    )
}

export default Page