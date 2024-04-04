'use client'
import React, { useState, useEffect } from "react";
import styles from './sectionwidget.style.module.css'
import EventCategoryData from '../../../public/data/categoryTags.json'
import EventTypeData from '../../../public/data/eventTypeTags.json'
import ModeData from '../../../public/data/mode.json'
import ArrowDownIcon from '/public/downArrow.svg'
import SearchIcon from '/public/search.svg'
import DatePickerComp from "../calendar/DatePickerComp";
import Tags from "./Tags";
import Image from "next/image";
import Tag from "./Tag";

const SectionWidget = () => {
    const [tagList, setTagList] = useState<string[]>([]);
    const isAdd: boolean = true;
    const [geoInput, setGeoInput] = useState<string>("");

    const [categoryTags, setCategoryTags] = useState<string[]>([]);
    const [categoryInput, setCategoryInput] = useState<string>("");
    const [matchingCategories, setMatchingCategories] = useState<string[]>([]);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);

    const [eventTags, setEventTags] = useState<string[]>([]);
    const [isEventDropdownOpen, setIsEventDropdownOpen] = useState<boolean>(false)

    const [modeTags, setModeTags] = useState<string[]>([]);
    const [isModeDropdownOpen, setIsModeDropdownOpen] = useState<boolean>(false);

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
        if (!eventTags.includes(type)) {
            setEventTags([...eventTags, type]);
        }
        setIsEventDropdownOpen(false);
    };

    const handleRemoveEventTypeTag = (tagToRemove: string) => {
        setEventTags(eventTags.filter(tag => tag !== tagToRemove));
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
    return (
        <div>
            <form className={styles.form}>
                <div className={styles.eventFormatContainer}>
                    <div className={styles.heading}>Event Format</div>
                    <div className={styles.eventFormatInput}>
                        <input disabled placeholder="Online" />
                        <Image src={ArrowDownIcon} alt="dropdown" />
                    </div>
                </div>
                <div className={styles.dateContainer}>
                    <div className={styles.startDate}>
                        <div className={styles.heading}>Start Date</div>
                        <div className={styles.datePickerContainer}><DatePickerComp /></div>

                    </div>
                    <div className={styles.endDate}>
                        <div className={styles.heading}>End Date</div>
                        <div className={styles.datePickerContainer}><DatePickerComp /></div>
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
                            required
                        />
                    </div>
                    {isCategoryDropdownOpen && (
                        <div className={styles.dropdown}>
                            {matchingCategories.map((event,index) => (
                                <div key={index} className={styles.dropdownItem} onClick={() => handleCategoryClick(event)}>
                                    {event}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className={styles.tags}>{categoryTags.map((tag,index) => (
                    <Tag key={index} name={tag} onRemove={() => handleRemoveCategoryTag(tag)} />
                ))}</div>

                <div className={` ${styles.eventTypeContainer} ${styles.inputOuterContainer}`}>
                    <div className={styles.heading}>Event Type</div>
                    <div className={`${styles.typeInput} ${styles.inputInnerContainer}`}>
                        <Image src={ArrowDownIcon} alt='dropdown' onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)} />
                        <input
                            type='text'
                            disabled
                            placeholder="For ex : Expo"
                            required
                        />
                    </div>
                    {isEventDropdownOpen && (
                        <div className={styles.dropdown}>
                            {EventTypeData.map((type,index) => (
                                <div key={index} className={styles.dropdownItem} onClick={() => handleEventTypeClick(type)}>
                                    {type}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className={styles.tags}>{eventTags.map((tag,index) => (
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
                <div className={styles.tags}>{modeTags.map((tag,index) => (
                    <Tag key={index} name={tag} onRemove={() => handleRemoveModeTag(tag)} />
                ))}</div>

                <div className={`${styles.promotedEventsContainer} ${styles.inputOuterContainer}`}>
                    <div className={styles.promotedHeading}>
                        <div className={styles.heading}>Do you want to show promoted events?</div>
                        <input type="checkbox" id="check" className={styles.checkboxInput} />
                        <label htmlFor="check" className={styles.checkBox}></label>
                    </div>
                    <div className={`${styles.promotedInput} ${styles.inputInnerContainer}`}>
                        <Image src={SearchIcon} alt='search' />
                        <input
                            type='text'
                            placeholder="Search Events"
                            required
                        />
                    </div>
                </div>
                <div className={styles.tagsContainer}>
                    <Tags tagList={tagList} setTagList={setTagList} isAdd={isAdd} />
                </div>
                <div className={styles.btns}>
                    <button className={styles.submitBtn}>Submit</button>
                    <button className={styles.cancelBtn} type="button">Cancel</button>
                </div>
            </form>
        </div>

    )
}

export default SectionWidget