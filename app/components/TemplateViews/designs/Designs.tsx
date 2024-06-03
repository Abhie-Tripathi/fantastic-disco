'use client'
import React, { useEffect, useState } from 'react'
import styles from './design.style.module.css'
import TemplateCard from './TemplateCard'
import FilterHeader from './FilterHeader'
import ExpandIcon from '/public/expandAll.svg'
import Image from 'next/image'

interface Props{
    setPreview: (id: string) => void;
}

const Designs = (props : Props) => {
    const [showAllOne, setShowAllOne] = useState(false);
    const [showAllTwo, setShowAllTwo] = useState(false);
    const [showAllThree, setShowAllThree] = useState(false);
    // const [preview, setPreview] = useState("");
    const [widgetSelected, setWidgetSelected] = useState<string>("All")
    const [accordianItemSelected, setAccordianItemSelected] = useState<string[]>(['No Highlighted Events', 'One Highlighted Event', 'Multiple Highlighted Events'])
    const [editModal, setEditModal] = useState<boolean>(false)
    const [selectedWidgets, setSelectedWidget] = useState<string[]>([])
    const [multipleWidgetOn, setMultipleWidgetOn] = useState<boolean>(false)

    const pageWidgetWithoutHighlighted = [
        { id: "sehb", name: "Single Event as Hero Banner" },
        { id: "megv", name: "Multiple Events as Grid View" },
        { id: "melv", name: "Multiple Events as List view" },
        // { id: "melgv", name: "Multiple Events as Grid and List View" },
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
        { id: "tscv", name: "Top Section of page as Caraousel View" },
        { id: "tshs", name: "Top Section of page as Horizontal Scroll" },
        { id: "lsvs", name: "Left Section of page as Vertical Scroll" }
    ]

    return (
        <div className={`${styles.body}`}>
            <div className={styles.filterContainer}><FilterHeader setWidgetSelected={setWidgetSelected} setAccordianItemSelected={setAccordianItemSelected} /></div>
            <div className={`${styles.templates}`}>
                {(widgetSelected === "Page") && <div className={styles.pageWidgetTemplates}>
                    <div className={styles.widgetHeading}>Page Widget</div>
                    {accordianItemSelected.includes("No Highlighted Events") && <div className={styles.pageTemplateTypeOne}>
                        <div className={styles.widgetSubheading}>No Highlighted Events</div>
                        <div className={styles.templateContainer}>
                            {pageWidgetWithoutHighlighted.slice(0, showAllOne ? undefined : 3).map((template, index) => (
                                <TemplateCard key={index} name={template.name} isHidden={!showAllOne && index >= 3} id={template.id} setPreview={props.setPreview} setEditModal={setEditModal} />
                            ))}
                        </div>
                        {pageWidgetWithoutHighlighted.length > 3 && (
                            <button onClick={() => setShowAllOne(!showAllOne)} className={styles.viewAllBtn}>
                                <Image src={ExpandIcon} alt='expand'/>
                            </button>
                        )}
                    </div>}
                    {accordianItemSelected.includes("One Highlighted Event") && <div className={styles.pageTemplateTypeTwo}>
                        <div className={styles.widgetSubheading}>One Higlighted Event</div>
                        <div className={styles.templateContainer}>
                            {pageWidgetWithOneHighlightedEvent.slice(0, showAllTwo ? undefined : 3).map((template, index) => (
                                <TemplateCard key={index} name={template.name} isHidden={!showAllTwo && index >= 3} id={template.id} setPreview={props.setPreview} setEditModal={setEditModal}/>
                            ))}
                        </div>
                        {pageWidgetWithOneHighlightedEvent.length > 3 && (
                            <button onClick={() => setShowAllTwo(!showAllTwo)} className={styles.viewAllBtn}>
                                <Image src={ExpandIcon} alt='expand' />
                            </button>
                        )}
                    </div>}
                    {accordianItemSelected.includes("Multiple Highlighted Events") && <div className={styles.pageTemplateTypeThree}>
                        <div className={styles.widgetSubheading}>Multiple Higlighted Events</div>
                        <div className={styles.templateContainer}>
                            {pageWidgetWithHighlightedEvents.slice(0, showAllThree ? undefined : 3).map((template, index) => (
                                <TemplateCard key={index} name={template.name} isHidden={!showAllThree && index >= 3} setPreview={props.setPreview} id={template.id} setEditModal={setEditModal} />
                            ))}
                        </div>
                        {pageWidgetWithHighlightedEvents.length > 3 && (
                            <button onClick={() => setShowAllThree(!showAllThree)} className={styles.viewAllBtn}>
                                <Image src={ExpandIcon} alt='expand' />
                            </button>
                        )}
                    </div>}
                </div>}
                {(widgetSelected === "Section") && <div className={styles.sectionWidgetTemplates}>
                    <div className={styles.widgetHeading}>Section Widget</div>
                    <div className={styles.templateContainer}>
                        {sectionWidgetEvents.map((template, index) => (
                            <TemplateCard key={index} name={template.name} isHidden={false} setPreview={props.setPreview} id={template.id} setEditModal={setEditModal}/>
                        ))}
                    </div>
                </div>}
                {(widgetSelected === "Sticky") && <div className={styles.stickyWidgetTemplates}>
                    <div className={styles.widgetHeading}>Sticky Widget</div>
                    <div className={styles.stickyInfo}><span className={styles.infoIcon}>i</span>Best Suitable if you have one event</div>
                    <div className={styles.templateContainer}>
                        <TemplateCard name="Sticky Top" isHidden={false} id="stickytop" setPreview={props.setPreview} setEditModal={setEditModal} />
                        <TemplateCard name="Sticky Footer" isHidden={false} id="stickydown" setPreview={props.setPreview} setEditModal={setEditModal} />
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default Designs