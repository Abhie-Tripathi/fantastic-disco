import React, { useState } from "react";
import styles from "./locationdropdown.style.module.css";
import { AddEventFormState } from "@/types/Formstate";
import CitySelector from "./CitySelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  formState: AddEventFormState;
  handleChange: (field: keyof AddEventFormState, value: any) => void;
  theme?: string;
}

const LocationDropdown = ({ theme, formState, handleChange }: Props) => {
  const [activeTab, setActiveTab] = useState("venue");

  const handleVirtualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange("virtualLink", e.target.value);
    handleChange("isEventFormatEmpty", false);
    // setQuery(e.target.value);
    // setIsEventFormatEmpty(false)
  };
  return (
    <div
      className={`${styles.body} ${
        theme && theme === "dark" ? styles.darkBody : ""
      }`}
    >
      <div className={styles.locationTypes}>
        <label className={styles.checkboxContainer}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={
              formState.eventFormat === "In-person" ||
              formState.eventFormat === "OFFLINE"
            }
            onChange={() => handleChange("eventFormat", "In-person")}
          />
          <span className={styles.customCheckbox}></span>
          <span className={styles.checkboxLabel}>In-person</span>
        </label>
        <label className={styles.checkboxContainer}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={
              formState.eventFormat === "Virtual" ||
              formState.eventFormat === "ONLINE"
            }
            onChange={() => handleChange("eventFormat", "Virtual")}
          />
          <span className={styles.customCheckbox}></span>
          <span className={styles.checkboxLabel}>Virtual</span>
        </label>
        <label className={styles.checkboxContainer}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={formState.eventFormat === "Hybrid"}
            onChange={() => handleChange("eventFormat", "Hybrid")}
          />
          <span className={styles.customCheckbox}></span>
          <span className={styles.checkboxLabel}>Hybrid</span>
        </label>
      </div>
      {(formState.eventFormat === "In-person" ||
        formState.eventFormat === "Hybrid" ||
        formState.eventFormat === "OFFLINE") && (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full pt-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="venue">Search by Venue</TabsTrigger>
            <TabsTrigger value="city">Search by City</TabsTrigger>
          </TabsList>
          <TabsContent value="venue" className="py-1">
            <CitySelector
              formState={formState}
              handleChange={handleChange}
              locationType={"VENUE"}
            />
          </TabsContent>
          <TabsContent value="city" className="py-1">
            <CitySelector
              formState={formState}
              handleChange={handleChange}
              locationType={"CITY"}
            />
          </TabsContent>
        </Tabs>
      )}

      {(formState.eventFormat === "Virtual" ||
        formState.eventFormat === "Hybrid" ||
        formState.eventFormat === "ONLINE") && (
        <div className={styles.inputLinkContainer}>
          <input
            type="text"
            placeholder="Enter Virtual Link"
            onChange={(e) => handleVirtualInputChange(e)}
          />
          <div>
            <span className={styles.infoBtn}>i</span>
            <span className={styles.info}>
              If you have a virtual event link, you can enter or paste it above
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationDropdown;
