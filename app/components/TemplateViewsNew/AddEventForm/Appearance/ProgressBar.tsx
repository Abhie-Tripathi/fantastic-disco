import React, { useEffect, useState } from 'react'
import styles from './progressbar.style.module.css'

interface Props {
    eventNameMain: string;
    cityNameMain: string;
    participationTypeMain: string;
    descriptionMain: string;
    eventNameSub: string;
    cityNameSub: string;
    participationTypeSub: string;
    descriptionSub: string;
}

const ProgressBar = ({ eventNameMain, cityNameMain, participationTypeMain, descriptionMain,eventNameSub, participationTypeSub, descriptionSub, cityNameSub }: Props) => {

    const [activeBars, setActiveBars] = useState<string[]>([])

    useEffect(() => {
        // Helper function to add or remove a field in the activeBars array
        const updateActiveBars = (fieldName: string, fieldValue: string) => {
            setActiveBars((prevBars) => {
                const isFieldActive = prevBars.includes(fieldName);

                // If the field has a value and it's not already in activeBars, add it
                if (fieldValue && !isFieldActive) {
                    return [...prevBars, fieldName];
                }

                // If the field is empty and it's in activeBars, remove it
                if (!fieldValue && isFieldActive) {
                    return prevBars.filter((bar) => bar !== fieldName);
                }

                // Return the previous state if no changes are needed
                return prevBars;
            });
        };

        // Update the activeBars based on the changes in each field
        updateActiveBars('participationType', participationTypeMain);
        updateActiveBars('eventName', eventNameMain);
        updateActiveBars('cityName', cityNameMain);
        updateActiveBars('description', descriptionMain);
        // Check for combined sub-fields to activate the 5th step
        if (eventNameSub && cityNameSub && participationTypeSub && descriptionSub) {
            updateActiveBars('subEvent', 'combinedSubFields');
        } else {
            updateActiveBars('subEvent', ''); // Remove if not all sub-fields are filled
        }

    }, [participationTypeMain, eventNameMain, cityNameMain, descriptionMain, eventNameSub, cityNameSub, participationTypeSub, descriptionSub]);
    const totalSteps = 5;
    return (
        <div className={styles.body}>
            <div className={styles.header}>PROGRESS</div>
            <div className={styles.progressContainer}>
                <div className={styles.statusHeading}>{activeBars.length} of {totalSteps} steps completed</div>
                <div className={styles.progressBars}>
                    {Array.from({ length: totalSteps }, (_, index) => (
                        <div
                            key={index}
                            className={index < activeBars.length ? styles.activeBar : styles.inactiveBar}
                        ></div>
                    ))}
                </div>
            </div>
            <div className={styles.listContainer}>
                <li className={participationTypeMain ? styles.activeItem : ""}>{participationTypeMain && <TickIcon />}<span>Mode Of Participation</span></li>
                <li className={eventNameMain ? styles.activeItem : ""}>{eventNameMain && <TickIcon />}<span>Event Name</span></li>
                <li className={cityNameMain ? styles.activeItem : ""}>{cityNameMain && <TickIcon />}<span>Location</span></li>
                <li className={descriptionMain ? styles.activeItem : ""}>{descriptionMain && <TickIcon />}<span>Description</span></li>
                <li className={(eventNameSub && cityNameSub && participationTypeSub && descriptionSub) ? styles.activeItem : ""}>
                    {(eventNameSub && cityNameSub && participationTypeSub && descriptionSub) && <TickIcon />}<span>Sub-Event</span>
                </li>
            </div>
        </div>
    )
}
export default ProgressBar

function TickIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 -960 960 960" width="12"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" fill="#0072F5" /></svg>
    )
}