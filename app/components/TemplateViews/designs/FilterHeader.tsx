'use client'
import React, { useEffect, useState } from 'react'
import styles from './filterheader.style.module.css'

interface Props {
    setWidgetSelected: React.Dispatch<React.SetStateAction<string>>;
    setAccordianItemSelected: React.Dispatch<React.SetStateAction<string[]>>;
    setMultipleWidgetOn :  React.Dispatch<React.SetStateAction<boolean>>;
    multipleWidgetOn :  boolean;
    widgetsLength :  number;
}


const FilterHeader = ({ setWidgetSelected, setAccordianItemSelected, setMultipleWidgetOn, multipleWidgetOn, widgetsLength }: Props) => {

    const [activeFilter, setActiveFilter] = useState("Page")
    const [accordionOpen, setAccordionOpen] = useState<boolean>(false);
    const [selectedAccordionItems, setSelectedAccordionItems] = useState<string[]>(['No Highlighted Events', 'One Highlighted Event', 'Multiple Highlighted Events']);

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

    const toggleAccordionItem = (item: string) => {
        setSelectedAccordionItems((prevSelected) =>
            prevSelected.includes(item)
                ? prevSelected.filter((i) => i !== item)
                : [...prevSelected, item]
        );
    };
    useEffect(() => {
        setAccordianItemSelected(selectedAccordionItems)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAccordionItems])

    return (
        <div className={styles.body}>
            <div className={styles.filters}>
                <div>Select Widget : </div>
                <div className={`${styles.filter} ${activeFilter === "Page" ? styles.activeBtn : ""}`} onClick={() => setActiveFilter("Page")}>Page</div>
                <div className={`${styles.filter} ${activeFilter === "Section" ? styles.activeBtn : ""}`} onClick={() => setActiveFilter("Section")}>Section</div>
                <div className={`${styles.filter} ${activeFilter === "Sticky" ? styles.activeBtn : ""}`} onClick={() => setActiveFilter("Sticky")}>Sticky</div>
                <div className={styles.multipleContainer}>
                    <input type="checkbox" id='multiple' className={styles.multipleInput} onChange={()=>setMultipleWidgetOn(!multipleWidgetOn)} />
                    <label htmlFor="multiple">Select Multiple Widgets</label>
                    <div className={styles.widgetCount}>{widgetsLength}</div>
                </div>
            </div>
            {accordionOpen && (
                <div className={styles.accordion}>
                    {['No Highlighted Events', 'One Highlighted Event', 'Multiple Highlighted Events'].map(
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
                    )}
                </div>
            )}
        </div>
    )
}

export default FilterHeader