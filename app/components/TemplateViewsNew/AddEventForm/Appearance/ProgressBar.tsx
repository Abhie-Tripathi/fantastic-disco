import React, { useEffect, useState } from 'react'
import styles from './progressbar.style.module.css'

interface Props {
    eventTypeMain: string;
    eventNameMain: string;
    cityNameMain: string;
    participationTypeMain: string;
    descriptionMain: string;
    eventNameSub: string;
    cityNameSub: string;
    eventTypeSub: string;
    descriptionSub: string;
    virutalLinkMain: string;
    virtualLinkSub: string;
    countryNameMain: string;
    eventFlow: string;
    countryNameSub: string
}

const ProgressBar = ({ eventTypeMain, eventNameMain, cityNameMain, participationTypeMain, descriptionMain, eventNameSub, eventTypeSub, descriptionSub, cityNameSub, virutalLinkMain, virtualLinkSub, countryNameMain, eventFlow, countryNameSub }: Props) => {

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
        if(eventFlow === "main"){
            updateActiveBars('eventName', eventNameMain);
        }else{
            updateActiveBars('eventName', eventNameSub);
        }
    
        if(eventFlow === "main"){
            if (virutalLinkMain) {
                updateActiveBars('cityName', virutalLinkMain);
            } else if (cityNameMain || countryNameMain) {
                updateActiveBars('cityName', cityNameMain || countryNameMain);
            }
        }else{
            if (virtualLinkSub) {
                updateActiveBars('cityName', virtualLinkSub);
            } else if (cityNameSub || cityNameSub) {
                updateActiveBars('cityName', cityNameSub || cityNameSub);
            }
        }

        if(eventFlow === "main"){
            updateActiveBars('description', descriptionMain);
        }else{
            updateActiveBars('description', descriptionSub);
        }
        if(eventFlow === "main"){
            updateActiveBars('eventType', eventTypeMain);
        }else{
            updateActiveBars('eventType', eventTypeSub);
        }
        

        // Check for combined sub-fields to activate the 5th step
        if (eventNameSub && cityNameSub && eventTypeSub && descriptionSub) {
            updateActiveBars('subEvent', 'combinedSubFields');
        } else {
            updateActiveBars('subEvent', ''); // Remove if not all sub-fields are filled
        }

    }, [participationTypeMain, eventNameMain, cityNameMain, descriptionMain, eventNameSub, cityNameSub, eventTypeSub, descriptionSub, eventTypeMain, virutalLinkMain, countryNameMain, countryNameSub]);
    const totalSteps = eventFlow === "main" ? 6 : 4;
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
                <li className={eventTypeMain || eventTypeSub ? styles.activeItem : ""}>{(eventTypeMain || eventTypeSub) && <TickIcon />}<span>Event Type</span></li>
                
                {eventFlow === "main" && <li className={participationTypeMain ? styles.activeItem : ""}>{participationTypeMain && <TickIcon />}<span>Mode Of Participation</span></li>}

                <li className={eventNameMain || eventNameSub ? styles.activeItem : ""}>{(eventNameMain || eventNameSub) && <TickIcon />}<span>Event Name</span></li>

                <li className={(cityNameMain || virutalLinkMain || countryNameMain || cityNameSub || virtualLinkSub || countryNameSub) ? styles.activeItem : ""}>{(cityNameMain || virutalLinkMain || countryNameMain || cityNameSub || virtualLinkSub || countryNameSub) && <TickIcon />}<span>Location</span></li>

                <li className={descriptionMain || descriptionSub ? styles.activeItem : ""}>{(descriptionMain || descriptionSub) && <TickIcon />}<span>Description</span></li>

                {eventFlow === "main" && <li className={(eventNameSub && (cityNameSub || virtualLinkSub) && eventTypeSub && descriptionSub) ? styles.activeItem : ""}>
                    {(eventNameSub && (cityNameSub || virtualLinkSub) && eventTypeSub && descriptionSub) && <TickIcon />}<span>Side-Event</span>
                </li>}
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