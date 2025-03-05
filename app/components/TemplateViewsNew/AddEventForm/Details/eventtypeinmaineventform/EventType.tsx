import { useEffect, useState } from "react";
import styles from "./eventtype.style.module.css";
import eventTypeSVG from "/public/eventTypeSVG.svg";
import Image from "next/image";
const EventTypeSelector = ({
  mainEventType,
  handleChange,
  prefilledEvent,
  formTheme
}: any) => {
  const [selectedEventType, setSelectedEventType] = useState("");

  useEffect(() => {
    if (prefilledEvent) {
      setSelectedEventType(prefilledEvent.event_type);
      handleChange("event_type", prefilledEvent.event_type); // Call handleChange to ensure the value is set
    }
  }, []);

  const handleOptionChange = (event: any) => {
    const value = event.target.value;
    setSelectedEventType(value);
    handleChange("event_type", value);
    handleChange("isEventTypeEmpty", false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.icon_container}>
        <Image src={eventTypeSVG} alt="event type" className={styles.icon} />
        <label className={`${styles.label} ${formTheme === "light" ? "text-[var(--tertiary-text-color)]" : "text-[#e0e0de]"}`}>Choose Your Event Type</label>
      </div>
      <div className={styles.optionsContainer}>
        {["Tradeshow", "Conference", "Workshop"].map((type) => (
          <label key={type} className={`${styles.optionLabel} ${formTheme === "light" ? "text-[var(--tertiary-text-color)]" : "text-[#e0e0de]"}`}>
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
