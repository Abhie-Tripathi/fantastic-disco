import React from 'react'
import styles from './allevents.style.module.css'

interface AllEventsType {
    name: string;
    location: string;
    startDate: string;
    endDate: string;
}

interface Props {
    allEvents: AllEventsType[]
}

const AllEvents = ({ allEvents }: Props) => {

    return (
        <div className={styles.body}>
            <div className={styles.headerContainer}>
                <div>All Events <span>{allEvents.length}</span></div>
                <button>Add Event</button>
            </div>
            <div className={styles.line}></div>
            <div className={styles.allEventsHeading}>
                {/* <div className={styles.inputContainer}>
                    <input type="checkbox" />
                </div> */}
            </div>
            <div className={styles.line}></div>
            <div className={styles.allEventsContainer}>
                {allEvents.map((event, key) => (
                    <div className={styles.eventContainer} key={key}>
                        {/* <div className={styles.inputContainer}>
                            <input type="checkbox" />
                        </div> */}
                        <div className={styles.event}>
                            <div><div className={styles.eventName}>{event.name}</div>
                                <div className={styles.eventLocationContainer}>
                                    <LocationIcon />
                                    <div>{event.location}</div>
                                </div>
                                <div className={styles.eventDateContainer}>
                                    <DateIcon />
                                    <div>{event.startDate} - {event.endDate}</div>
                                </div>
                            </div>
                            <div className={styles.addButtonContainer}>
                                <div className={styles.heading}>
                                    Add to Widget
                                </div>
                                <input
                                    type="checkbox"
                                    id={key.toString()}
                                    className={styles.checkboxInput}
                                // onChange={handleCheckboxChange}
                                />
                                <label htmlFor={key.toString()} className={styles.checkBox}></label>
                            </div>
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
        <svg xmlns="http://www.w3.org/2000/svg" height="10" viewBox="0 -960 960 960" width="10"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" fill="black" /></svg>
    )
}
function LocationIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="10" viewBox="0 -960 960 960" width="10"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" fill="black" /></svg>
    )
}