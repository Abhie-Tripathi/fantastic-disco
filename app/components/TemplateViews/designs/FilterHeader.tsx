'use client'
import React, { useEffect, useState } from 'react'
import styles from './filterheader.style.module.css'
import Image from 'next/image'
import TickIcon from '/public/tick.svg'

interface DraftWidget {
    widgetType: string;
    preview: string;
}

interface Props {
    setWidgetSelected: React.Dispatch<React.SetStateAction<string>>;
    setShowHighlihtedTemplates: React.Dispatch<React.SetStateAction<boolean>>;
    showHighlightedTemplates: boolean;
    draftWidgets: DraftWidget[];
}


const FilterHeader = ({ setWidgetSelected, setShowHighlihtedTemplates, showHighlightedTemplates, draftWidgets }: Props) => {

    const [activeFilter, setActiveFilter] = useState("Page")
    const [accordionOpen, setAccordionOpen] = useState<boolean>(false);

    useEffect(() => {
        setWidgetSelected(activeFilter);
        if (activeFilter === 'Page') {
            setAccordionOpen(true);
        } else {
            setAccordionOpen(false);
        }
    }, [activeFilter, setWidgetSelected]);

    return (
        <div className={styles.body}>
            <div className={styles.filters}>
                <div>Select Widget : </div>
                <div className={`${styles.filter} ${activeFilter === "Page" ? styles.activeBtn : ""}`} onClick={() => setActiveFilter("Page")}>
                    Page
                    {draftWidgets.some(widget => widget.widgetType === "Page") && (
                        <Image src={TickIcon} alt='tick' className={styles.tickIcon} />
                    )}
                </div>
                <div className={`${styles.filter} ${activeFilter === "Section" ? styles.activeBtn : ""}`} onClick={() => setActiveFilter("Section")}>
                    Section
                    {draftWidgets.some(widget => widget.widgetType === "Section") && (
                        <Image src={TickIcon} alt='tick' className={styles.tickIcon} />
                    )}
                </div>
                <div className={`${styles.filter} ${activeFilter === "Sticky" ? styles.activeBtn : ""}`} onClick={() => setActiveFilter("Sticky")}>
                    Sticky
                    {draftWidgets.some(widget => widget.widgetType === "Sticky") && (
                        <Image src={TickIcon} alt='tick' className={styles.tickIcon} />
                    )}
                </div>
                <div className={`${styles.filter} ${activeFilter === "Popup" ? styles.activeBtn : ""}`} onClick={() => setActiveFilter("Popup")}>
                    Popup
                    {draftWidgets.some(widget => widget.widgetType === "Popup") && (
                        <Image src={TickIcon} alt='tick' className={styles.tickIcon} />
                    )}
                </div>
            </div>
            {accordionOpen && (
                <div className={styles.accordion}>
                    <div className={styles.highlightedCheckbox}>
                        <input type="checkbox" id='promoted' onChange={() => setShowHighlihtedTemplates(!showHighlightedTemplates)} />
                        <label htmlFor="promoted">Show Highlighted Event Templates</label>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FilterHeader