import { useEffect, useState } from "react";
import styles from "./location/location.style.module.css";
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
    <div className="flex gap-3 md:justify-between md:flex-row flex-col justify-start">
      <div className="text-[var(--tertiary-text-color)] text-sm font-medium">
        Choose Your Event Type
      </div>
      <div className="flex max-[400px]:flex-col gap-3">
        {["Tradeshow", "Conference", "Workshop"].map((type) => (
          <label key={type} className={`flex items-center gap-2 text-[var(--tertiary-text-color)] text-sm font-medium ${selectedEventType === type ? "text-primary" : ""}`}>
            <input
              type="radio"
              name="eventType"
              value={type}
              checked={selectedEventType === type}
              onChange={handleOptionChange}
              className={`mr-1 cursor-pointer ${selectedEventType === type ? "accent-primary" : ""}`}
            />
            {type}
          </label>
        ))}
      </div>
    </div>
  );
};

export default EventTypeSelector;
