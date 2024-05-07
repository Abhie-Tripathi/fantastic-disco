import React, { useState } from 'react'
import styles from './listView.module.css'
import YourEventCard from './YourEventCard'
import TimelineItem from './TimelineItem'
import DropDown from './DropdownRef'
import eventData from '../../../../public/data/demoEvent.json'
import { useTheme } from '@/context'

const ListView = () => {
    const [selectedRole, setSelectedRole] = useState("sponsoring")
    const [selectedRoles, setSelectedRoles] = useState<string[]>(["Sponsoring", "Exhibiting", "Speaking", "Attending"]);
    const [teamSelection, setTeamSelection] = useState('All Events')
    // Sponsoring/Exhibiting/Speaking/Attending
    const personalize = DropDown();
    const {theme} = useTheme();


    let prevDate: any = null;
    const convertToDateObject = (dateString: string) => {
        const [month, day, year] = dateString.split('/');
        return new Date(`${year}-${month}-${day}`);
    };

    // Sort eventData based on startDate
    interface EventData {
        id: number;
        startDate: string;
        // Define other properties here
    }
    const sortedEventData = eventData.slice().sort((a: EventData, b: EventData) => {
        const dateA = convertToDateObject(a.startDate);
        const dateB = convertToDateObject(b.startDate);
        return dateA.getTime() - dateB.getTime(); // Sort in ascending order (earliest date first)
    });
    const handleFilter = (value: string) => {
        if (selectedRoles?.indexOf(value) === -1) {
            setSelectedRoles([...selectedRoles, value]);
        }
        else setSelectedRoles(selectedRoles?.filter(role => role !== value));
        setSelectedRole(value)

    }
    const selectedTeam = (val: string) => {
        setTeamSelection(val);
    }
    var filteredEventData = sortedEventData.filter((item) => {
        return selectedRoles.some((role) => item.ctas.includes(role));
    });
    if (selectedRoles.includes("Attending")) filteredEventData = sortedEventData

    return (
        <div className={styles.container}>
            <div className={`${styles.buttons} ${theme === 'light' ? styles.buttons_light : ""}`}>
                <div className={styles.filterBtns}>
                    <button onClick={() => handleFilter("Sponsoring")} className={`${selectedRoles.includes("Sponsoring") ? styles.activeFilterBtn : ''}`}>Sponsoring</button>
                    <button onClick={() => handleFilter("Exhibiting")} className={`${selectedRoles.includes("Exhibiting") ? styles.activeFilterBtn : ''}`}>Exhibiting</button>
                    <button onClick={() => handleFilter("Speaking")} className={` ${selectedRoles.includes('Speaking') ? styles.activeFilterBtn : ''}`}>Speaking</button>
                    <button onClick={() => handleFilter("Attending")} className={` ${selectedRoles.includes('Attending') ? styles.activeFilterBtn : ''}`}>Attending</button>
                </div>
                <div className={styles.eventsBtns}>
                    <button onClick={() => selectedTeam('All Events')} className={teamSelection === "All Events" ? styles.activeTeamBtn : ""}>All Events</button>
                    <button onClick={() => selectedTeam('Team Events')} className={teamSelection === "Team Events" ? styles.activeTeamBtn : ""}>Team Events</button>
                    <button onClick={() => selectedTeam('My Events')} className={teamSelection === "My Events" ? styles.activeTeamBtn : ""}>My Events</button>
                </div>
            </div>

            {selectedRoles.length === 0 && <div className={styles.notSelected}>Please select the filters</div>}
            <div className={styles.timelineContainer}>
                {filteredEventData.map((item, index) => {
                    // Check if current event's date is different from previous event's date
                    const showDate = item.startDate !== prevDate;
                    // Update previous date
                    prevDate = item.startDate;
                    return (
                        <div key={index} className={styles.timeline}>
                            <TimelineItem eventDate={showDate ? item.startDate : null} />
                            <YourEventCard
                                eventId={item.id}
                                eventName={item.name}
                                eventCtas={item.ctas}
                                eventLocation={item.location}
                                eventImage={item.imageUrl}
                                eventDate={item.startDate}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default ListView