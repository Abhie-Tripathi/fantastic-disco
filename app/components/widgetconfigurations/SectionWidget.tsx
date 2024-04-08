'use client'
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import styles from './sectionwidget.style.module.css'
import EventCategoryData from '../../../public/data/categoryTags.json'
import EventTypeData from '../../../public/data/eventTypeTags.json'
import EventFormatData from '../../../public/data/eventFormat.json'
import ModeData from '../../../public/data/mode.json'
import ArrowDownIcon from '/public/downArrow.svg'
import SearchIcon from '/public/search.svg'
import DatePickerComp from "../calendar/DatePickerComp";
import Tags from "./Tags";
import Image from "next/image";
import Tag from "./Tag";
import EventData from '../../../public/data/demoEvent.json'

const SectionWidget = () => {
    const [tagList, setTagList] = useState<string[]>([]);
    const isAdd: boolean = true;
    const [geoInput, setGeoInput] = useState<string>("");

    const [eventFormat, setEventFormat] = useState<string>("Online")
    const [isEventFormatDropdownOpen, setIsEventFormatDropdownOpen] = useState<boolean>(false);

    const [startDate, setStartDate] = useState<any>()
    const [endDate, setEndDate] = useState<any>()

    const [categoryTags, setCategoryTags] = useState<string[]>([]);
    const [categoryInput, setCategoryInput] = useState<string>("");
    const [matchingCategories, setMatchingCategories] = useState<string[]>([]);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);

    const [eventTypeTags, setEventTypeTags] = useState<string[]>([]);
    const [isEventTypeDropdownOpen, setIsEventTypeDropdownOpen] = useState<boolean>(false)

    const [modeTags, setModeTags] = useState<string[]>([]);
    const [isModeDropdownOpen, setIsModeDropdownOpen] = useState<boolean>(false);

    const [showPromotedInput, setShowPromotedInput] = useState<boolean>(false);
    const [isPromotedDropdownOpen, setIsPromotedDropdownOpen] = useState<boolean>(false);
    const [promotedInput, setPromotedInput] = useState<string>("");
    const [matchingPromotedEvents, setMatchingPromotedEvents] = useState<any[]>([]);
    const [promotedEventTags, setPromotedEventTags] = useState<string[]>([])

    useEffect(() => {
        if (categoryInput.trim() === '') {
            setMatchingCategories([]);
            setIsCategoryDropdownOpen(false);
        } else {
            const matches = EventCategoryData.filter(category => category.toLowerCase().includes(categoryInput.toLowerCase()));
            setMatchingCategories(matches);
            setIsCategoryDropdownOpen(true);
        }
    }, [categoryInput]);

    const handleEventFormatClick = (type: string) => {
        setEventFormat(type)
        setIsEventFormatDropdownOpen(!isEventFormatDropdownOpen)
    }

    const handleStartDate = (startDate: any) => {
        setStartDate(startDate)
    }
    const handleEndDate = (endDate: any) => {
        setEndDate(endDate)
    }

    const handleCategoryClick = (category: string) => {
        if (!categoryTags.includes(category)) {
            setCategoryTags([...categoryTags, category]);
        }
        setIsCategoryDropdownOpen(false);
    };

    const handleRemoveCategoryTag = (tagToRemove: string) => {
        setCategoryTags(categoryTags.filter(tag => tag !== tagToRemove));
    };

    const handleEventTypeClick = (type: string) => {
        if (!eventTypeTags.includes(type)) {
            setEventTypeTags([...eventTypeTags, type]);
        }
        setIsEventTypeDropdownOpen(false);
    };

    const handleRemoveEventTypeTag = (tagToRemove: string) => {
        setEventTypeTags(eventTypeTags.filter(tag => tag !== tagToRemove));
    };

    const handleModeClick = (mode: string) => {
        if (!modeTags.includes(mode)) {
            setModeTags([...modeTags, mode]);
        }
        setIsModeDropdownOpen(false);
    };

    const handleRemoveModeTag = (tagToRemove: string) => {
        setModeTags(modeTags.filter(tag => tag !== tagToRemove));
    };
    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        setShowPromotedInput(e.target.checked);
    };

    const filterEvents = (event: any) => {
        return event.tags.includes(promotedInput.toLowerCase());
    };
    useEffect(() => {
        const matches = EventData.filter(filterEvents);
        setMatchingPromotedEvents(matches);
        setIsPromotedDropdownOpen(true)
    }, [promotedInput])
    const handlePromotedEventClick = (event: any) => {
        setPromotedEventTags([...promotedEventTags, event.name])
        setIsPromotedDropdownOpen(false)
    }

    const handleRemovePromotedEventsTag = (tagToRemove: string)=>{
        setPromotedEventTags(promotedEventTags.filter(tag => tag !== tagToRemove));
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = {
            eventFormat,
            startDate: startDate, // Convert date to ISO string
            endDate: endDate, // Convert date to ISO string
            categoryTags: categoryTags.join(','),
            modeTags: modeTags.join(','), // Convert array to comma-separated string
            eventTypeTags: eventTypeTags.join(',') // Convert array to comma-separated string
        };
        const params = new URLSearchParams(formData);
        const queryString = params.toString();
        console.log(queryString);
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.eventFormatContainer}>
                <div className={styles.heading}>Event Format</div>
                <div className={styles.eventFormatInput}>
                    <input disabled value={eventFormat} />
                    <Image src={ArrowDownIcon} alt="dropdown" onClick={() => setIsEventFormatDropdownOpen(!isEventFormatDropdownOpen)} />
                </div>
                {isEventFormatDropdownOpen && (
                    <div className={styles.dropdown}>
                        {EventFormatData.map((event, index) => (
                            <div key={index} className={styles.dropdownItem} onClick={() => handleEventFormatClick(event)}>
                                {event}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className={styles.dateContainer}>
                <div className={styles.startDate}>
                    <div className={styles.heading}>Start Date</div>
                    <div className={styles.datePickerContainer}><DatePickerComp handleDate={handleStartDate} /></div>

                </div>
                <div className={styles.endDate}>
                    <div className={styles.heading}>End Date</div>
                    <div className={styles.datePickerContainer}><DatePickerComp handleDate={handleEndDate} /></div>
                </div>
            </div>
            <div className={`${styles.eventGeoContainer} ${styles.inputOuterContainer}`}>
                <div className={styles.heading}>Event Geography</div>
                <div className={`${styles.geoInput} ${styles.inputInnerContainer}`}>
                    <Image src={SearchIcon} alt='search' />
                    <input
                        type='text'
                        onChange={(e) => setGeoInput(e.target.value)}
                        value={geoInput}
                        placeholder="Geography"
                        required
                    />
                </div>
            </div>
            <div className={` ${styles.eventCategoryContainer} ${styles.inputOuterContainer}`}>
                <div className={styles.heading}>Event Category</div>
                <div className={`${styles.categoryInput} ${styles.inputInnerContainer}`}>
                    <Image src={SearchIcon} alt='search' />
                    <input
                        type='text'
                        onChange={(e) => setCategoryInput(e.target.value)}
                        value={categoryInput}
                        placeholder="For ex : Texttile"
                    />
                </div>
                {isCategoryDropdownOpen && (
                    <div className={styles.dropdown}>
                        {matchingCategories.map((event, index) => (
                            <div key={index} className={styles.dropdownItem} onClick={() => handleCategoryClick(event)}>
                                {event}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className={styles.tags}>{categoryTags.map((tag, index) => (
                <Tag key={index} name={tag} onRemove={() => handleRemoveCategoryTag(tag)} />
            ))}</div>

            <div className={` ${styles.eventTypeContainer} ${styles.inputOuterContainer}`}>
                <div className={styles.heading}>Event Type</div>
                <div className={`${styles.typeInput} ${styles.inputInnerContainer}`}>
                    <Image src={ArrowDownIcon} alt='dropdown' onClick={() => setIsEventTypeDropdownOpen(!isEventTypeDropdownOpen)} />
                    <input
                        type='text'
                        disabled
                        placeholder="For ex : Expo"
                        required
                    />
                </div>
                {isEventTypeDropdownOpen && (
                    <div className={styles.dropdown}>
                        {EventTypeData.map((type, index) => (
                            <div key={index} className={styles.dropdownItem} onClick={() => handleEventTypeClick(type)}>
                                {type}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className={styles.tags}>{eventTypeTags.map((tag, index) => (
                <Tag key={index} name={tag} onRemove={() => handleRemoveEventTypeTag(tag)} />
            ))}</div>

            <div className={` ${styles.eventModeContainer} ${styles.inputOuterContainer}`}>
                <div className={styles.heading}>Mode of Participation</div>
                <div className={`${styles.typeInput} ${styles.inputInnerContainer}`}>
                    <Image src={ArrowDownIcon} alt='dropdown' onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)} />
                    <input
                        type='text'
                        disabled
                        placeholder="For ex : Speaker"
                        required
                    />
                </div>
                {isModeDropdownOpen && (
                    <div className={styles.dropdown}>
                        {ModeData.map((mode, index) => (
                            <div key={index} className={styles.dropdownItem} onClick={() => handleModeClick(mode)}>
                                {mode}
                            </div>
                        ))}

                    </div>
                )}
            </div>
            <div className={styles.tags}>{modeTags.map((tag, index) => (
                <Tag key={index} name={tag} onRemove={() => handleRemoveModeTag(tag)} />
            ))}</div>

            <div className={`${styles.promotedEventsContainer} ${styles.inputOuterContainer}`}>
                <div className={styles.promotedHeading}>
                    <div className={styles.heading}>Do you want to show promoted events?</div>
                    <input type="checkbox" id="check" className={styles.checkboxInput} onChange={handleCheckboxChange} />
                    <label htmlFor="check" className={styles.checkBox}></label>
                </div>
                {promotedEventTags.length <= 2 && <div className={`${styles.promotedInput} ${styles.inputInnerContainer}`}>
                    <Image src={SearchIcon} alt='search' />
                    <input
                        type='text'
                        onChange={(e) => setPromotedInput(e.target.value)}
                        placeholder="Search Events"
                        value={promotedInput}
                        disabled={!showPromotedInput}
                    />
                </div>}
                {isPromotedDropdownOpen && (
                    <div className={styles.dropdown}>
                        {matchingPromotedEvents.map((event, index) => (
                            <div key={index} className={styles.dropdownItem} onClick={() => handlePromotedEventClick(event)}>
                                {event.name}
                            </div>
                        ))}
                    </div>
                )}
                <div className={styles.tags}>{promotedEventTags.map((tag, index) => (
                    <Tag key={index} name={tag} onRemove={() => handleRemovePromotedEventsTag(tag)} />
                ))}</div>
            </div>
            <div className={styles.tagsContainer}>
                <Tags tagList={tagList} setTagList={setTagList} isAdd={isAdd} />
            </div>
            <div className={styles.btns}>
                <button className={styles.submitBtn}>Submit</button>
                <button className={styles.cancelBtn} type="button">Cancel</button>
            </div>
        </form>
    )
}

export default SectionWidget