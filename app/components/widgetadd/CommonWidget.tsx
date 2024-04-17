'use client'
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import styles from './commonwidget.style.module.css'
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
import useFetch from "@/hooks/useFetch";
// import EventData from '../../../public/data/demoEvent.json'

interface CommonWidgetProps{
    widgetType : string;
    setId: React.Dispatch<React.SetStateAction<string>>;
}

const CommonWidget = ({widgetType, setId} : CommonWidgetProps) => {
    const [tagList, setTagList] = useState<string[]>([]);
    const isAdd: boolean = true;
    const [geoInput, setGeoInput] = useState<string>("");

    const [eventFormat, setEventFormat] = useState<string>("Online")
    const [isEventFormatDropdownOpen, setIsEventFormatDropdownOpen] = useState<boolean>(false);

    const [startDate, setStartDate] = useState<string>()
    const [endDate, setEndDate] = useState<string>()

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
    const [promotedEvents, setPromotedEvents] = useState<string[]>([]) // Will store id of promoted events

    const promotedEventsLimit = widgetType === 'Page' ? 3 : 1;

    const {data} = useFetch('https://api.eventgeni.com/es/find?company=104');
    
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

    useEffect(() => {
        if (data) {
            const eventData = data.eventData || []; // Ensure eventData is available, default to an empty array if not present
            const matches = promotedInput.trim() === '' ? [] : eventData.filter((event: any) => event._source.name.toLowerCase().includes(promotedInput.toLowerCase()));
            setMatchingPromotedEvents(matches);
            setIsPromotedDropdownOpen(promotedInput.trim() !== ''); // Set dropdown open only if searchInput is not empty
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [promotedInput]);
    

    const handlePromotedEventClick = (event: any) => {
        if (!promotedEventTags.includes(event._source.name)) {
            setPromotedEventTags([...promotedEventTags, event._source.name]);
            setPromotedEvents([...promotedEvents, event._id]);
        }
        setIsPromotedDropdownOpen(false);
    };
    

    const handleRemovePromotedEventsTag = (tagToRemove: string)=>{
        
        setPromotedEventTags(promotedEventTags.filter(tag => tag !== tagToRemove));
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Generate query string
        const queryString = generateQueryString();  
        const baseURL = process.env.NEXT_PUBLIC_EVENTGENI_URL;
        const bodyData = {
            promotedEventTags,
            startDate,
            endDate,
            eventTypeTags,
            categoryTags,
            eventFormat,
            active : true
        };
        // Prepare request body
        const formBody = {
            type:"page",
            query: queryString,
            companyId: "d586146b-7845-46f9-bea9-6db19995449a",
            body : JSON.stringify(bodyData)
        };
        try {
            const responseData = await postData(`${baseURL}/widgets`, formBody);
            console.log("Response data:", responseData);
            setId(responseData.id)
            
            const storedWidgets = JSON.parse(localStorage.getItem('widgets') || '[]');
            if(widgetType ==="Page"){
                storedWidgets.push({ id:responseData.id, name : "Page" });
            }else{
                storedWidgets.push({ id:responseData.id, name : "Section" });
            }
            const updatedWidgetsJSON = JSON.stringify(storedWidgets);
            localStorage.setItem('widgets', updatedWidgetsJSON);
        } catch (error) {
            console.error("Error:", error);
        }
    };
    const generateQueryString = () => {
        const formData: Record<string, string> = {};
        if (startDate) {
            formData.startDate = startDate
        }
        if (endDate) {
            formData.endDate = endDate
        }
        if (categoryTags.length > 0) {
            formData.categoryTags = categoryTags.join(',');
        }
        if (eventTypeTags.length > 0) {
            formData.eventTypeTags = eventTypeTags.join(',');
        }
        if (promotedEvents.length > 0) {
            formData.promotedEvents = promotedEvents.join(',');
        }
    
        const params = new URLSearchParams(formData);
        return params.toString();
    };
    const postData = async (url: string, body: any) => {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        return response.json();
    };    
    
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
                    <div className={styles.datePickerContainer}><DatePickerComp handleDate={handleStartDate} date="" /></div>

                </div>
                <div className={styles.endDate}>
                    <div className={styles.heading}>End Date</div>
                    <div className={styles.datePickerContainer}><DatePickerComp handleDate={handleEndDate} date="" /></div>
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
                {promotedEventTags.length < promotedEventsLimit && <div className={`${styles.promotedInput} ${styles.inputInnerContainer}`}>
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
                                {event._source.name}
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

export default CommonWidget