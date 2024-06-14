'use client'
import React, { useEffect, useState } from 'react'
import styles from './filterheader.style.module.css'
import Image from 'next/image'
import TickIcon from '/public/tick.svg'

interface DraftWidget {
    widgetType: string[];
    preview: string[];
}

interface Props {
    setWidgetSelected: React.Dispatch<React.SetStateAction<string>>;
    // setAccordianItemSelected: React.Dispatch<React.SetStateAction<string[]>>;
    setShowHighlihtedTemplates: React.Dispatch<React.SetStateAction<boolean>>;
    // setMultipleWidgetOn :  React.Dispatch<React.SetStateAction<boolean>>;
    // multipleWidgetOn :  boolean;
    // widgetsLength :  number;
    showHighlightedTemplates: boolean;
    draftWidgets: DraftWidget;

}


const FilterHeader = ({ setWidgetSelected, setShowHighlihtedTemplates, showHighlightedTemplates, draftWidgets }: Props) => {

    const [activeFilter, setActiveFilter] = useState("Page")
    const [accordionOpen, setAccordionOpen] = useState<boolean>(false);
    // const [selectedAccordionItems, setSelectedAccordionItems] = useState<string[]>(['No Highlighted Events', 'One Highlighted Event', 'Multiple Highlighted Events']);

    useEffect(() => {
        setWidgetSelected(activeFilter);
        if (activeFilter === 'Page') {
            setAccordionOpen(true);
        } else {
            setAccordionOpen(false);
        }
        // If we wont do this, page will not show anything when All is selected (If Page is nothing selected)
        // if(activeFilter === 'All'){
        //     setSelectedAccordionItems(['No Highlighted Events', 'One Highlighted Event', 'Multiple Highlighted Events'])
        // }
    }, [activeFilter, setWidgetSelected]);

    // const toggleAccordionItem = (item: string) => {
    //     setSelectedAccordionItems((prevSelected) =>
    //         prevSelected.includes(item)
    //             ? prevSelected.filter((i) => i !== item)
    //             : [...prevSelected, item]
    //     );
    // };
    // useEffect(() => {
    //     setAccordianItemSelected(selectedAccordionItems)
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [selectedAccordionItems])

    return (
        <div className={styles.body}>
            <div className={styles.filters}>
                <div>Select Widget : </div>
                <div className={`${styles.filter} ${activeFilter === "Page" ? styles.activeBtn : ""}`} onClick={() => setActiveFilter("Page")}>
                    Page
                    {draftWidgets.widgetType.includes("Page") && (
                        <Image src={TickIcon} alt='tick' className={styles.tickIcon} />
                    )}
                </div>
                <div className={`${styles.filter} ${activeFilter === "Section" ? styles.activeBtn : ""}`} onClick={() => setActiveFilter("Section")}>Section
                    {draftWidgets.widgetType.includes("Section") && (
                        <Image src={TickIcon} alt='tick' className={styles.tickIcon} />
                    )}
                </div>
                <div className={`${styles.filter} ${activeFilter === "Sticky" ? styles.activeBtn : ""}`} onClick={() => setActiveFilter("Sticky")}>Sticky
                    {draftWidgets.widgetType.includes("Sticky") && (
                        <Image src={TickIcon} alt='tick' className={styles.tickIcon} />
                    )}
                </div>
                <div className={`${styles.filter} ${activeFilter === "Popup" ? styles.activeBtn : ""}`} onClick={() => setActiveFilter("Popup")}>Popup
                    {draftWidgets.widgetType.includes("Popup") && (
                        <Image src={TickIcon} alt='tick' className={styles.tickIcon} />
                    )}
                </div>
            </div>
            {accordionOpen && (
                <div className={styles.accordion}>
                    {/* {['No Highlighted Events', 'One Highlighted Event', 'Multiple Highlighted Events'].map(
                        (item) => (
                            <div
                                key={item}
                                className={`${styles.accordionItem} ${selectedAccordionItems.includes(item) ? styles.accordionActive : ''
                                    }`}
                                onClick={() => toggleAccordionItem(item)}
                            >
                                {item}
                            </div>
                        )
                    )} */}
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