import React, { useEffect, useState, useRef } from 'react'
import styles from './allevents.style.module.css'
import GlobalSearch from './GlobalSearch';
import { baseUrl } from '@/constants';
import { myFetch } from '@/utils/myFetch';
import { AllEventsType } from '@/types/alleventtype';
import { GolbalEventType } from '@/types/globaleventtype';
import EmptyImage from '/public/widgetimages/emptyimages/addedeventempty.svg'
import Image from 'next/image';

interface Props {
    fetchedAllEvents: AllEventsType[]
    fetchEvents: (page: number, type? : string) => Promise<void>;
    fetchAddedEvents: () => Promise<void>;
    handleAddEventModal: (value: void) => void
    handlePrefillNormalEvent: (event: AllEventsType, type: string) => void
    handlePrefillGlobalEvent: (event: GolbalEventType, type: string) => void
    widgetId: string;
    handleNormalEventModal: (value: void) => void;
    allEventsCount: number;
}

const AllEvents = ({ handleAddEventModal, fetchedAllEvents, fetchEvents, fetchAddedEvents, handlePrefillNormalEvent, widgetId, handleNormalEventModal, handlePrefillGlobalEvent, allEventsCount }: Props) => {

    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true); // To heck if there are more events
    const scrollableDivRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollableDiv = scrollableDivRef.current;
            if (scrollableDiv) {
                const { scrollTop, clientHeight, scrollHeight } = scrollableDiv;
                // Check if the user has scrolled near the bottom of the div
                if (scrollTop + clientHeight >= scrollHeight - 50 && !isLoading && hasMore) {
                    setPage(prevPage => prevPage + 1);
                }
            }
        };
        const scrollableDiv: any = scrollableDivRef.current;

        if (scrollableDiv) {
            scrollableDiv.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (scrollableDiv) {
                scrollableDiv.removeEventListener("scroll", handleScroll);
            }
        };
    }, [isLoading, hasMore]);

    useEffect(() => {
        if(allEventsCount !== fetchedAllEvents.length){
            if (page > 0) {
                const fetchMoreEvents = async () => {
                    setIsLoading(true);
                    const prevLength = fetchedAllEvents.length;
                    await fetchEvents(page*8);
                    const newLength = fetchedAllEvents.length;
                    setIsLoading(false);
    
                    // If no more events are fetched, stop further fetching
                    if (newLength === prevLength) {
                        setHasMore(false);
                    }
                };
                fetchMoreEvents();
            }
        }
 
    }, [page]);

    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: '2-digit', month: 'short' };
        return new Date(date).toLocaleDateString('en-US', options);
    };
    const handleDelete = async (eventId: string) => {
        const customizeData = new FormData();
        customizeData.append("id", eventId)
        customizeData.append('published', "false");
        const { data, error } = await myFetch(
            `${baseUrl}/event`,
            {
                method: 'PATCH',
                body: customizeData,
            }
        );
        if (data) {
            fetchEvents(0,"update")
            fetchAddedEvents()
        }
        if (error) {
            console.log(error);
        }

    }
    const handlePrefillingNormalEvent = (event: AllEventsType, type: string, checked: boolean) => {
        // we need to make a check here that if the event is already added to the widget, we dont want to open the detail page form again by clicking on the checkbox
        if (!checked) {
            handlePrefillNormalEvent(event, type)
        }
    }
    return (
        <div className={styles.body} ref={scrollableDivRef}>
            <div className={styles.headerContainer}>
                <div>All Events</div>
                <div className={styles.addBtnContainer}>
                    <button onClick={() => handleNormalEventModal()}><Addevent/> Add event</button>
                    <button onClick={() => handleAddEventModal()}>
                        <AddeventToWidget/>Add Event to widget
                    </button>
                </div>
            </div>
            <GlobalSearch widgetId={widgetId} handlePrefillGlobalEvent={handlePrefillGlobalEvent} />
            <div className={styles.line}></div>
            {fetchedAllEvents.length > 0 ? <div className={styles.allEventsContainer}>
                {fetchedAllEvents.map((event, key) => (
                    <div className={styles.event} key={key}>
                        <div className={styles.eventDetailsContainer}>
                            <div className={styles.eventName}>{event.name}</div>
                            <div className={styles.eventLocationContainer}>
                                <LocationIcon />
                                <div>{event.cityName}</div>
                            </div>
                            <div className={styles.eventDateContainer}>
                                <DateIcon />
                                <div>{formatDate(event.startDate)} - {formatDate(event.endDate)}</div>
                            </div>
                        </div>
                        <div className={styles.btnContainer}>
                            <div className={styles.addButtonContainer}>
                                <div className={styles.heading}>
                                    {event.isLinkedToWidget ? "Added to Widget" : "Add to widget"}
                                </div>
                                <input
                                    type="checkbox"
                                    id={key.toString()}
                                    className={styles.checkboxInput}
                                    checked={event.isLinkedToWidget}
                                    onChange={() => handlePrefillingNormalEvent(event, "add", event.isLinkedToWidget)}
                                />
                                <label htmlFor={key.toString()} className={styles.checkBox}></label>
                            </div>
                            <div className={styles.delete_editBtn}>
                                {/* <button onClick={() => handlePrefillNormalEvent(event ,"edit")}><Image src={EditIcon} alt='edit' /></button> */}
                                <div onClick={() => handlePrefillNormalEvent(event, "edit")}><EditIcon /><span>Edit</span></div>
                                <button onClick={() => handleDelete(event.eventId)}><DeleteIcon /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div> : <div className={styles.emptyScreen}>
                <Image src={EmptyImage} alt='empty' />
                <div>Search or Add your Events</div>
                <span>Start by searching for existing events to add to your widgets</span>
                <span>or feel free to create your own event from scratch</span>
            </div>}
        </div>
    )
}

export default AllEvents

function DateIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="10" viewBox="0 -960 960 960" width="10"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" fill="#696B83" /></svg>
    )
}
function LocationIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="10" viewBox="0 -960 960 960" width="10"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" fill="#696B83" /></svg>
    )
}
function DeleteIcon() {
    return (
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.5 3H9.5C9.5 2.60218 9.34196 2.22064 9.06066 1.93934C8.77936 1.65804 8.39782 1.5 8 1.5C7.60218 1.5 7.22064 1.65804 6.93934 1.93934C6.65804 2.22064 6.5 2.60218 6.5 3ZM5.5 3C5.5 2.33696 5.76339 1.70107 6.23223 1.23223C6.70107 0.763392 7.33696 0.5 8 0.5C8.66304 0.5 9.29893 0.763392 9.76777 1.23223C10.2366 1.70107 10.5 2.33696 10.5 3H15.5C15.6326 3 15.7598 3.05268 15.8536 3.14645C15.9473 3.24021 16 3.36739 16 3.5C16 3.63261 15.9473 3.75979 15.8536 3.85355C15.7598 3.94732 15.6326 4 15.5 4H14.446L13.252 14.344C13.1676 15.0752 12.8173 15.7498 12.2679 16.2396C11.7184 16.7293 11.008 16.9999 10.272 17H5.728C4.99195 16.9999 4.28161 16.7293 3.73214 16.2396C3.18266 15.7498 2.8324 15.0752 2.748 14.344L1.554 4H0.5C0.367392 4 0.240215 3.94732 0.146447 3.85355C0.0526785 3.75979 0 3.63261 0 3.5C0 3.36739 0.0526785 3.24021 0.146447 3.14645C0.240215 3.05268 0.367392 3 0.5 3H5.5ZM3.741 14.23C3.79743 14.7174 4.03105 15.167 4.39742 15.4934C4.76379 15.8198 5.23735 16.0001 5.728 16H10.272C10.7627 16.0001 11.2362 15.8198 11.6026 15.4934C11.969 15.167 12.2026 14.7174 12.259 14.23L13.439 4H2.561L3.741 14.23ZM6.5 6.5C6.63261 6.5 6.75979 6.55268 6.85355 6.64645C6.94732 6.74021 7 6.86739 7 7V13C7 13.1326 6.94732 13.2598 6.85355 13.3536C6.75979 13.4473 6.63261 13.5 6.5 13.5C6.36739 13.5 6.24021 13.4473 6.14645 13.3536C6.05268 13.2598 6 13.1326 6 13V7C6 6.86739 6.05268 6.74021 6.14645 6.64645C6.24021 6.55268 6.36739 6.5 6.5 6.5ZM10 7C10 6.86739 9.94732 6.74021 9.85355 6.64645C9.75979 6.55268 9.63261 6.5 9.5 6.5C9.36739 6.5 9.24021 6.55268 9.14645 6.64645C9.05268 6.74021 9 6.86739 9 7V13C9 13.1326 9.05268 13.2598 9.14645 13.3536C9.24021 13.4473 9.36739 13.5 9.5 13.5C9.63261 13.5 9.75979 13.4473 9.85355 13.3536C9.94732 13.2598 10 13.1326 10 13V7Z" fill="#DA2F35" />
        </svg>
    )
}
function EditIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.4997 3.00007L12.9997 5.50007M8.83301 14.6667H15.4997M2.16634 11.3334L1.33301 14.6667L4.66634 13.8334L14.3213 4.17841C14.6338 3.86586 14.8093 3.44201 14.8093 3.00007C14.8093 2.55813 14.6338 2.13429 14.3213 1.82174L14.178 1.67841C13.8655 1.36596 13.4416 1.19043 12.9997 1.19043C12.5577 1.19043 12.1339 1.36596 11.8213 1.67841L2.16634 11.3334Z" stroke="#6750A4" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}


function AddeventToWidget() {
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0H9V9H0V0ZM2 2V7H7V2H2ZM11 0H20V9H11V0ZM13 2V7H18V2H13ZM0 11H9V20H0V11ZM2 13V18H7V13H2ZM14.5 11.5H16.5V14.5H19.5V16.5H16.5V19.5H14.5V16.5H11.5V14.5H14.5V11.5Z"
          fill="white"
        />
      </svg>
    );
  }
  
  function Addevent() {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 21 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 0H0V2.25H18V0ZM18 4.5H0V6.75H18V4.5ZM0 9H9V11.25H0V9ZM9 13.5H0V15.75H9V13.5ZM16.875 12.375H20.25V14.625H16.875V18H14.625V14.625H11.25V12.375H14.625V9H16.875V12.375Z"
          fill="white"
        />
      </svg>
    );
  }
  