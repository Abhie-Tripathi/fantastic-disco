'use client'
import React, { useState, useEffect, FormEvent } from 'react'
import styles from './stickywidget.style.module.css'
import SearchIcon from '/public/search.svg'
import Down from '/public/downArrow.svg'
import Image from 'next/image'
import useFetch from '@/hooks/useFetch'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface StickyWidgetProps {
    setWidgetId: React.Dispatch<React.SetStateAction<string>>;
}

const StickyWidget = (props: StickyWidgetProps) => {

    const [isEventDropdownOpen, setIsEventDropdownOpen] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>("");
    const [matchingEvents, setMatchingEvents] = useState<any[]>([]); // You might want to replace 'Event' with the actual type of events
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null); // You might want to replace 'Event' with the actual type of an event
    const [bgColor, setBgColor] = useState<string>('#000000');
    const [fgColor, setFColor] = useState<string>('#4ca9c8');
    const [height, setHeight] = useState<string>('50');
    const [fontSize, setFontSize] = useState<string>('16')
    const [stickyId, setStickyId] = useState<string>("")
    const { data } = useFetch('https://api.eventgeni.com/es/find?company=104');

    const handleColorChange = (event: any) => {
        setBgColor(event.target.value);
    };
    const handlefColorChange = (event: any) => {
        setFColor(event.target.value);
    };

    useEffect(() => {
        if (data) {
            const eventData = data.eventData || []; // Ensure eventData is available, default to an empty array if not present
            const matches = searchInput.trim() === '' ? [] : eventData.filter((event: any) => event._source.name.toLowerCase().includes(searchInput.toLowerCase()));
            setMatchingEvents(matches);
            setIsEventDropdownOpen(searchInput.trim() !== ''); // Set dropdown open only if searchInput is not empty
        }
    }, [searchInput, data]);

    const handleEventClick = (event: any) => {
        setIsEventDropdownOpen(false)
        setSelectedEvent(event);
    }
    useEffect(() => {
        setSearchInput(selectedEvent?._source.name || '');
    }, [selectedEvent]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const baseURL = process.env.NEXT_PUBLIC_EVENTGENI_URL;
        const endpoint = "widgets"; // Check if this is the correct endpoint
        const body = JSON.stringify({
            type: "sticky",
            event: selectedEvent._source.name,
            height: height,
            fontSize: fontSize,
            bgColor,
            fgColor,
            active: "true"
        });
        try {
            // Make the POST request
            const response = await fetch(`${baseURL}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body
            });
            if (!response.ok) {
                console.error('Failed to submit the form:', response.status, response.statusText);
                return;
            }
            const responseData = await response.json();
            const { id } = responseData;
            setStickyId(id);

            // const storedWidgets = JSON.parse(localStorage.getItem('widgets') || '[]');
            // storedWidgets.push({ id, name: "Sticky" });
            // const updatedWidgetsJSON = JSON.stringify(storedWidgets);
            // localStorage.setItem('widgets', updatedWidgetsJSON);
        } catch (error) {
            console.error('An error occurred while submitting the form:', error);
        }
    };
    useEffect(() => {
        props.setWidgetId(stickyId)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stickyId])
    return (
        <form className={styles.form} onSubmit={handleSubmit}>
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
                            <div key={event._id} className={styles.dropdownItem} onClick={() => handleEventClick(event)}>
                                {event._source.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className={styles.heightAndFont}>
                <div className={styles.heightContainer}>
                    <div className={styles.heading}>Height</div>
                    <div className={styles.heightInput}>
                        <input onChange={(e) => setHeight(e.target.value)} value={height} type='number' />
                        <div className={styles.dropdownIconValue}>
                            <div>px</div>
                            <Image src={Down} alt="dropdown"></Image>
                        </div>
                    </div>
                </div>
                <div className={styles.fontContainer}>
                    <div className={styles.heading}>Font Size</div>
                    <div className={styles.fontInput}>
                        <input onChange={(e) => setFontSize(e.target.value)} value={fontSize} type='number' />
                        <div className={styles.dropdownIconValue}>
                            <div>px</div>
                            <Image src={Down} alt="dropdown"></Image>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.colorContainer}>
                <div className={styles.heading}>Color</div>
                <div className={styles.colorOptions}>
                    <div >
                        Background Color
                        <div className={styles.colorInputWrapper}>
                            <input type="color" className={styles.colorInput} value={bgColor}
                                onChange={handleColorChange} />
                        </div>
                    </div>
                    <div>
                        Foreground Color
                        <div className={styles.colorInputWrapper}>
                            <input type="color" className={styles.colorInput} value={fgColor}
                                onChange={handlefColorChange} />
                        </div>
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