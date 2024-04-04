'use client'
import React, { useState, useEffect } from 'react'
import styles from './stickywidget.style.module.css'
import EventData from '../../../public/data/demoEvent.json'
import SearchIcon from '/public/search.svg'
import Down from '/public/downArrow.svg'
import Image from 'next/image'

const StickyWidget = () => {

    const [isEventDropdownOpen, setIsEventDropdownOpen] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>("");
    const [matchingEvents, setMatchingEvents] = useState<any[]>([]); // You might want to replace 'Event' with the actual type of events
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null); // You might want to replace 'Event' with the actual type of an event
    const [bgcolor, setBgColor] = useState<string>('#000000');
    const [fcolor, setFColor] = useState<string>('#4ca9c8');

    const handleColorChange = (event: any) => {
        setBgColor(event.target.value);
    };
    const handlefColorChange = (event: any) => {
        setFColor(event.target.value);
    };
    // Will filter the events according to the search event input
    const filterEvents = (event: any) => {
        return event.tags.includes(searchInput.toLowerCase());
    };
    useEffect(() => {
        const matches = EventData.filter(filterEvents);
        setMatchingEvents(matches);
        setIsEventDropdownOpen(true)
    }, [searchInput])
    const handleEventClick = (event: any) => {
        setIsEventDropdownOpen(false)
        setSelectedEvent(event);
    }

    return (
        <form className={styles.form}>
            <div className={styles.eventNameContainer}>
                <div className={styles.heading}>Event Name</div>
                <div className={styles.eventNameInput}>
                    <Image src={SearchIcon} alt='search' />
                    <input
                        type='text'
                        onChange={(e) => setSearchInput(e.target.value)}
                        value={searchInput}
                        placeholder="Add Event"
                        required
                    />
                </div>
                {isEventDropdownOpen && (
                    <div className={styles.dropdown}>
                        {matchingEvents.map(event => (
                            <div key={event.id} className={styles.dropdownItem} onClick={() => handleEventClick(event)}>
                                {event.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className={styles.heightContainer}>
                <div className={styles.heading}>Height</div>
                <div className={styles.heightInput}>
                    <input />
                    <div className={styles.dropdownIconValue}>
                        <div>px</div>
                        <Image src={Down} alt="dropdown"></Image>
                    </div>
                </div>
            </div>
            <div className={styles.fontContainer}>
                <div className={styles.heading}>Font Size</div>
                <div className={styles.fontInput}>
                    <input />
                    <div className={styles.dropdownIconValue}>
                        <div>px</div>
                        <Image src={Down} alt="dropdown"></Image>
                    </div>
                </div>
            </div>
            <div className={styles.colorContainer}>
                <div className={styles.heading}>Color</div>
                <div className={styles.colorOptions}>
                    <div>
                        Background Color
                        <input type="color" className={styles.colorInput} value={bgcolor}
                            onChange={handleColorChange} />
                    </div>
                    <div>
                        Foreground Color
                        <input type="color" className={styles.colorInput} value={fcolor}
                            onChange={handlefColorChange} />
                    </div>
                </div>
            </div>
            <div className={styles.btns}>
                <button className={styles.submitBtn}>Submit</button>
                <button className={styles.cancelBtn} type="button">Cancel</button>
            </div>
        </form>
    )
}

export default StickyWidget