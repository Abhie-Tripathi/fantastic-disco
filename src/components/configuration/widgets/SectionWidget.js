import React, { useState, useEffect } from "react";
import SearchIcon from '../../../icons/search.svg'
import styles from './sectionwidget.style.module.css'
import ArrowDownIcon from '../../../icons/downArrow.svg'
import DatePickerComp from "../../DatePickerComp";
import Tags from '../Tags'
import EventCategoryData from '../../../eventdata/categoryTags.json'
import Tag from "../Tag";

const SectionWidget = () => {
    const [geoInput, setGeoInput] = useState("")
    const [tagList, setTagList] = useState([]);
    const isAdd = true;
    const [categoryTags, setCategoryTags] = useState([])
    const [categoryInput, setCategoryInput] = useState("")
    const [matchingCategories, setMatchingCategories] = useState([])
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)

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
        setCategoryTags([...categoryTags, category])
        setIsCategoryDropdownOpen(false);
    }

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
            <div className={styles.eventGeoContainer}>
                <div className={styles.heading}>Event Geography</div>
                <div className={styles.geoInput}>
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
            <div className={` ${styles.eventCategoryContainer}`}>
                <div className={styles.heading}>Event Category</div>
                <div className={styles.categoryInput}>
                    <img src={SearchIcon} alt='search' />
                    <input
                        type='text'
                        onChange={(e) => setCategoryInput(e.target.value)}
                        value={categoryInput}
                        placeholder="Category"
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
            <div className={styles.categoryTags}>{categoryTags.map(tag => (
                <Tag name={tag} />
            ))}</div>
            <Tags tagList={tagList} setTagList={setTagList} isAdd={isAdd} />
        </form>
    )
}

export default SectionWidget