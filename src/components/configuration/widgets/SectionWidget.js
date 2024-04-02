import React, { useState, useEffect } from "react";
import SearchIcon from '../../../icons/search.svg'
import styles from './sectionwidget.style.module.css'
import ArrowDownIcon from '../../../icons/downArrow.svg'
import DatePickerComp from "../../DatePickerComp";
import Tags from '../Tags'
import EventCategoryData from '../../../eventdata/categoryTags.json'
import EventTypeData from '../../../eventdata/eventTypeTags.json'
import ModeData from '../../../eventdata/mode.json'
import Tag from "../Tag";

const SectionWidget = () => {
    const [geoInput, setGeoInput] = useState("")
    const [tagList, setTagList] = useState([]);
    const isAdd = true;

    const [categoryTags, setCategoryTags] = useState([])
    const [categoryInput, setCategoryInput] = useState("")
    const [matchingCategories, setMatchingCategories] = useState([])
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)

    const [eventTags, setEventTags] = useState([])
    const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false)

    const [modeTags, setModeTags] = useState([])
    const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false)


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
    const handleCategoryClick = (category) => {
        if (!categoryTags.includes(category)) {
            setCategoryTags([...categoryTags, category]);
        }
        setIsCategoryDropdownOpen(false);
    };
    const handleRemoveCategoryTag = (tagToRemove) => {
        setCategoryTags(categoryTags.filter(tag => tag !== tagToRemove));
    };

    const handleEventTypeClick = (type) => {
        if (!eventTags.includes(type)) {
            setEventTags([...eventTags, type]);
        }
        setIsEventDropdownOpen(false);
    };

    const handleRemoveEventTypeTag = (tagToRemove) => {
        setEventTags(eventTags.filter(tag => tag !== tagToRemove));
    };

    const handleModeClick = (mode) => {
        if (!modeTags.includes(mode)) {
            setModeTags([...modeTags, mode]);
        }
        setIsModeDropdownOpen(false);
    };

    const handleRemoveModeTag = (tagToRemove) => {
        setModeTags(modeTags.filter(tag => tag !== tagToRemove));
    };

    return (
        <form className={styles.form}>
            <div className={styles.eventFormatContainer}>
                <div className={styles.heading}>Event Format</div>
                <div className={styles.eventFormatInput}>
                    <input disabled placeholder="Online" />
                    <img src={ArrowDownIcon} alt="dropdown" />
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
                    <img src={SearchIcon} alt='search' />
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
                    <img src={SearchIcon} alt='search' />
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
                        {matchingCategories.map(event => (
                            <div key={event.id} className={styles.dropdownItem} onClick={() => handleCategoryClick(event)}>
                                {event}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className={styles.tags}>{categoryTags.map(tag => (
                <Tag name={tag} onRemove={() => handleRemoveCategoryTag(tag)} />
            ))}</div>

            <div className={` ${styles.eventTypeContainer} ${styles.inputOuterContainer}`}>
                <div className={styles.heading}>Event Type</div>
                <div className={`${styles.typeInput} ${styles.inputInnerContainer}`}>
                    <img src={ArrowDownIcon} alt='dropdown' onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)} />
                    <input
                        type='text'
                        disabled
                        placeholder="For ex : Expo"
                        required
                    />
                </div>
                {isEventDropdownOpen && (
                    <div className={styles.dropdown}>
                        {EventTypeData.map(type => (
                            <div key={type.id} className={styles.dropdownItem} onClick={() => handleEventTypeClick(type)}>
                                {type}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className={styles.tags}>{eventTags.map(tag => (
                <Tag name={tag} onRemove={() => handleRemoveEventTypeTag(tag)} />
            ))}</div>

            <div className={` ${styles.eventModeContainer} ${styles.inputOuterContainer}`}>
                <div className={styles.heading}>Mode of Participation</div>
                <div className={`${styles.typeInput} ${styles.inputInnerContainer}`}>
                    <img src={ArrowDownIcon} alt='dropdown' onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)} />
                    <input
                        type='text'
                        disabled
                        placeholder="For ex : Speaker"
                        required
                    />
                </div>
                {isModeDropdownOpen && (
                    <div className={styles.dropdown}>
                        {ModeData.map(mode => (
                            <div key={mode.id} className={styles.dropdownItem} onClick={() => handleModeClick(mode)}>
                                {mode}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className={styles.tags}>{modeTags.map(tag => (
                <Tag name={tag} onRemove={() => handleRemoveModeTag(tag)} />
            ))}</div>

            <div className={`${styles.promotedEventsContainer} ${styles.inputOuterContainer}`}>
                <div className={styles.promotedHeading}>
                    <div className={styles.heading}>Do you want to show promoted events?</div>
                    <input type="checkbox" id="check" className={styles.checkboxInput} />
                    <label htmlFor="check" className={styles.checkBox}></label>
                </div>
                <div className={`${styles.promotedInput} ${styles.inputInnerContainer}`}>
                    <img src={SearchIcon} alt='search' />
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
    )
}
export default SectionWidget