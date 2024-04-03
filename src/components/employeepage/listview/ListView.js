import React,{useState} from 'react'
import styles from './listview.style.module.css'
import YourEventCard from '../YourEventCard.js'
import TimelineItem from '../TimelineItem.js'
import DropDown from "../../refs/DropdownRef";
import DropDownIcon from '../../../icons/dropDown.svg'
import Filter from '../Filter.js'
import eventData from '../../../eventdata/demoEvent.json'

const ListView = () => {
    const [selectedRole, setSelectedRole] = useState("sponsoring")
    const [selectedRoles,setSelectedRoles]=useState(["sponsoring"]);
    const [teamSelection,setTeamSelection]=useState('Total Events')
    // Sponsoring/Exhibiting/Speaking/Attending
    const personalize=DropDown();
    const handleCalendar = (value) => {
        if(selectedRoles.indexOf(value)===-1) setSelectedRoles([...selectedRoles,value]);
        else setSelectedRoles(selectedRoles.filter(role => role !== value));
        setSelectedRole(value)
    }

    let prevDate = null;
    const convertToDateObject = (dateString) => {
        const [month, day, year] = dateString.split('/');
        return new Date(`${year}-${month}-${day}`);
    };

    // Sort eventData based on startDate
    const sortedEventData = eventData.slice().sort((a, b) => {
        const dateA = convertToDateObject(a.startDate);
        const dateB = convertToDateObject(b.startDate);
        return dateA - dateB; // Sort in ascending order (earliest date first)
    });
    const toggleDropdown=()=>{
        personalize.setIsOpen(!personalize.isOpen);
    }
    const selectedTeam=(val)=>{
        setTeamSelection(val);
        toggleDropdown();
    }
    console.log(selectedRoles)
    return (
        <div className={styles.container}>
            <div className={styles.calendarBtns}>
                <button onClick={() => handleCalendar("sponsoring")} className={`${styles.weekBtn} ${selectedRoles.includes("sponsoring") ? styles.activeCalendarBtn : ''}`}>Sponsoring</button>
                <button onClick={() => handleCalendar("exhibiting")} className={`${styles.monthBtn} ${selectedRoles.includes("exhibiting") ? styles.activeCalendarBtn : ''}`}>Exhibiting</button>
                <button onClick={() => handleCalendar("speaking")} className={`${styles.yearBtn} ${selectedRoles.includes('speaking') ? styles.activeCalendarBtn : ''}`}>Speaking</button>
                <button onClick={() => handleCalendar("attending")} className={`${styles.yearBtn} ${selectedRoles.includes('attending') ? styles.activeCalendarBtn : ''}`}>Attending</button>
                <div className={styles.userEvents}>
                <div style={{position:"relative"}} ref={personalize.dropdownRef}>
                <div className={styles.allEvents} onClick={toggleDropdown}>
                    <div>{teamSelection}</div>
                    <img src={DropDownIcon} style={{position:"absolute", right:"5px"}} alt="downArrow"/>
                </div>
                {personalize.isOpen&&
                 <div className={styles.dropDown}>
                 <div className={styles.singleSelect} onClick={()=>selectedTeam('Total Events')}>Total Events</div>
                 <div className={styles.singleSelect} onClick={()=>selectedTeam('Team Events')}>Team Events</div>
                 <div className={styles.singleSelect} onClick={()=>selectedTeam('My Events')}>My Events</div>
                    </div>
                }
               
                </div>
                </div>
            </div>
            <div className={styles.timelineContainer}>
                {sortedEventData.map((item, index) => {
                    // Check if current event's date is different from previous event's date
                    const showDate = item.startDate !== prevDate;
                    // Update previous date
                    prevDate = item.startDate;
                    return (
                        <div key={index} className={styles.timeline}>
                            <TimelineItem eventDate={showDate ? item.startDate : null} />
                            <YourEventCard
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
            {/* <div className={styles.filterContainer}>
                <Filter />
            </div> */}
        </div>
    )
}

export default ListView