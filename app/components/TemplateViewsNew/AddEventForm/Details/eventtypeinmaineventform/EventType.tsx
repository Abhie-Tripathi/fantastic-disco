import { useState } from "react";
import styles from "./eventtype.style.module.css";
import eventTypeSVG from "/public/eventTypeSVG.svg";
import Image from "next/image";
const EventTypeSelector = ({mainEventType,handleChange}:any) => {
  const [selectedEventType, setSelectedEventType] = useState("");

  const handleOptionChange = (event: any) => {
    const value = event.target.value;
    setSelectedEventType(value);
    handleChange('event_type', value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.icon_container}>
        <Image src={eventTypeSVG} alt="event type" className={styles.icon} />
        <label className={styles.label}>Choose Your Event Type</label>
      </div>
      <div className={styles.optionsContainer}>
        {["Tradeshow", "Conference", "Workshop"].map((type) => (
          <label key={type} className={styles.optionLabel}>
            <input
              type="radio"
              name="eventType"
              value={type}
              checked={selectedEventType === type}
              onChange={handleOptionChange}
              className={styles.radio}
            />
            {type}
          </label>
        ))}
      </div>
    </div>
  );
};

export default EventTypeSelector;
