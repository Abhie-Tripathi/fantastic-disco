import React, { useState, useEffect } from "react";
import Down from '../../../icons/downArrow.svg'
import SearchIcon from '../../../icons/search.svg'
import Styles from './stickywidget.style.module.css'
import EventData from '../../../eventdata/demoEvent.json'


const StickyWidget = ({ demoEvent, buyerTags, setBuyerTags }) => {
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [matchingEvents, setMatchingEvents] = useState([]); // All events that macthes ther search
  const [selectedEvent, setSelectedEvent] = useState(null); // Event that we are selecting and sending to form
  const [bgcolor, setBgColor] = useState('#000000');
  const [fcolor, setFColor] = useState('#4ca9c8');
  const handleColorChange = (event) => {
    setBgColor(event.target.value);
  };
  const handlefColorChange = (event) => {
    setFColor(event.target.value);
  };
  // Will filter the events according to the search event input
  const filterEvents = (event) => {
    return event.tags.includes(searchInput.toLowerCase());
  };
  useEffect(() => {
    const matches = EventData.filter(filterEvents);
    setMatchingEvents(matches);
    setIsEventDropdownOpen(true)
  }, [searchInput])
  const handleEventClick = (event) => {
    setIsEventDropdownOpen(false)
    setSelectedEvent(event);
  }

  return (
    <form className={Styles.form}>
      <div className={Styles.eventNameContainer}>
        <div className={Styles.heading}>Event Name</div>
        <div className={Styles.eventNameInput}>
          <img src={SearchIcon} alt='search' />
          <input
            type='text'
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
            placeholder="Add Event"
            required
          />
        </div>
        {isEventDropdownOpen && (
          <div className={Styles.dropdown}>
            {matchingEvents.map(event => (
              <div key={event.id} className={Styles.dropdownItem} onClick={() => handleEventClick(event)}>
                {event.name}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={Styles.heightContainer}>
        <div className={Styles.heading}>Height</div>
        <div className={Styles.heightInput}>
          <input />
          <div className={Styles.dropdownIconValue}>
            <div>px</div>
            <img src={Down} alt="dropdown"></img>
          </div>
        </div>
      </div>
      <div className={Styles.fontContainer}>
        <div className={Styles.heading}>Font Size</div>
        <div className={Styles.fontInput}>
          <input />
          <div className={Styles.dropdownIconValue}>
            <div>px</div>
            <img src={Down} alt="dropdown"></img>
          </div>
        </div>
      </div>
      <div className={Styles.colorContainer}>
        <div className={Styles.heading}>Color</div>
        <div  className={Styles.colorOptions}>
          <div>
            Background Color
            <input type="color" className={Styles.colorInput} value={bgcolor}
              onChange={handleColorChange} />
          </div>
          <div>
            Foreground Color
            <input type="color" className={Styles.colorInput} value={fcolor}
              onChange={handlefColorChange} />
          </div>
        </div>
      </div>
      <div className={Styles.btns}>
        <button className={Styles.submitBtn}>Submit</button>
        <button className={Styles.cancelBtn} type="button">Cancel</button>
      </div>
    </form>
  )
}

export default StickyWidget
