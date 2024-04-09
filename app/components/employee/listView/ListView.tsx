import React,{useState} from 'react'
import styles from './listView.module.css'
import YourEventCard from './YourEventCard'
import TimelineItem from './TimelineItem'
import DropDown from './DropdownRef'
import DropDownIcon from '/public/dropDown.svg'
import Image from 'next/image'
import eventData from '../../../../public/data/demoEvent.json'

const ListView = () => {
    const [selectedRole, setSelectedRole] = useState("sponsoring")
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [teamSelection,setTeamSelection]=useState('Total Events')
    // Sponsoring/Exhibiting/Speaking/Attending
    const personalize=DropDown();
    

    let prevDate :any = null;
    const convertToDateObject = (dateString:string) => {
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
      const handleCalendar = (value:string) => {
        if(selectedRoles?.indexOf(value)===-1) {
            setSelectedRoles([...selectedRoles,value]);
        }
        else setSelectedRoles(selectedRoles?.filter(role => role !== value));
        setSelectedRole(value)

    }
    const toggleDropdown=()=>{
        personalize.setIsOpen(!personalize.isOpen);
    }
    const selectedTeam=(val:string)=>{
        setTeamSelection(val);
        toggleDropdown();
    }
    var filteredEventData = sortedEventData.filter((item) => {
        return selectedRoles.some((role) => item.ctas.includes(role));
      });
   if(filteredEventData.length===0 || selectedRole==="Attending") filteredEventData=sortedEventData;
    console.log(filteredEventData);
    
    console.log(selectedRoles)
    return (
        <div className={styles.container}>
            <div className={styles.calendarBtns}>
                <button onClick={() => handleCalendar("Sponsoring")} className={`${styles.weekBtn} ${selectedRoles.includes("Sponsoring") ? styles.activeCalendarBtn : ''}`}>Sponsoring</button>
                <button onClick={() => handleCalendar("Exhibiting")} className={`${styles.monthBtn} ${selectedRoles.includes("Exhibiting") ? styles.activeCalendarBtn : ''}`}>Exhibiting</button>
                <button onClick={() => handleCalendar("Speaking")} className={`${styles.yearBtn} ${selectedRoles.includes('Speaking') ? styles.activeCalendarBtn : ''}`}>Speaking</button>
                <button onClick={() => handleCalendar("Attending")} className={`${styles.yearBtn} ${selectedRoles.includes('Attending') ? styles.activeCalendarBtn : ''}`}>Attending</button>
                <div className={styles.userEvents}>
                <div style={{position:"relative"}} ref={personalize.dropdownRef}>
                <div className={styles.allEvents} onClick={toggleDropdown}>
                    <div>{teamSelection}</div>
                    <Image src={DropDownIcon} style={{position:"absolute", right:"5px"}} alt="downArrow"/>
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
            {/* <div className={styles.filterContainer}>
                <Filter />
            </div> */}
        </div>
    )
}

export default ListView