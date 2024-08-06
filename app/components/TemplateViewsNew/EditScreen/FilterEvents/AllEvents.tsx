import React from 'react'
import styles from './allevents.style.module.css'
import GlobalSearch from './GlobalSearch';
import { baseUrl } from '@/constants';
import { myFetch } from '@/utils/myFetch';

interface AllEventsType {
    eventId : string;
    name: string;
    location: string;
    startDate: string;
    endDate: string;
    isLinkedToWidget : boolean;
}

interface Props {
    fetchedAllEvents : AllEventsType[]
    fetchEvents : () => Promise<void>; 
    fetchAddedEvents : ()=>Promise<void>;
    handleAddEventModal : (value: void) => void
}

const AllEvents = ({handleAddEventModal,fetchedAllEvents,fetchEvents,fetchAddedEvents }: Props) => {

    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: '2-digit', month: 'short' };
        return new Date(date).toLocaleDateString('en-US', options);
    };
    const handleDelete = async(eventId : string)=>{
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
        if(data){
            fetchEvents()
            fetchAddedEvents()
        }
        if(error){
            console.log(error);
        }
 
    }

    return (
        <div className={styles.body}>
            <div className={styles.headerContainer}>
                <div>All Events <span>{fetchedAllEvents.length}</span></div>
                <button onClick={() => handleAddEventModal()}>Add Event</button>
            </div>
            <GlobalSearch />
            <div className={styles.line}></div>
            <div className={styles.allEventsContainer}>
                {fetchedAllEvents.map((event, key) => (
                    <div className={styles.event} key={key}>
                        <div className={styles.eventDetailsContainer}>
                            <div className={styles.eventName}>{event.name}</div>
                            <div className={styles.eventLocationContainer}>
                                <LocationIcon />
                                <div>{event.location}</div>
                            </div>
                            <div className={styles.eventDateContainer}>
                                <DateIcon />
                                <div>{formatDate(event.startDate)} - {formatDate(event.endDate)}</div>
                            </div>
                        </div>
                        <div className={styles.btnContainer}>
                            <div className={styles.addButtonContainer}>
                                <div className={styles.heading}>
                                    Add to Widget
                                </div>
                                <input
                                    type="checkbox"
                                    id={key.toString()}
                                    className={styles.checkboxInput}
                                    checked={event.isLinkedToWidget}
                                />
                                <label htmlFor={key.toString()} className={styles.checkBox}></label>
                            </div>
                            <button onClick={()=>handleDelete(event.eventId)}><DeleteIcon /></button>
                        </div>
                    </div>
                ))}
            </div>
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