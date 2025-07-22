import CheckboxInput from "@/app/components/UI/CheckBoxInput";
import styles from "./templatetable.style.module.css";
import { use, useEffect, useState } from "react";
import { InformationFill, Trash } from "geist-icons";
import { formatEventDates } from "@/utils/dateFormat";
import { formattedDateRange } from "@/utils/date";
import { formatLocationParts } from "@/utils/locationFormat";
import { Event } from "@/types/events";
import React from "react";
interface Props {
  eventSuggestion?: string[];
  setEventSuggestion?: (value: string[]) => void;
  customData: any[];
  handleCustomData: (data: any) => void;
  presetName?: string;
  type?: string;
}

const TemplateTable = ({ customData, handleCustomData, presetName, setEventSuggestion, eventSuggestion, type,isNew, setIsNew }: Props) => { 
  const [des, setDes] = useState([]);
  const [dep, setDep] = useState([]);
  const [sen, setSen] = useState<string[]>([]);
  const [expandTable, setExpandTable] = useState<boolean>(false);
  const [selectedIdArray, setSelectedIdArray] = useState<number[]>([]);

  const deleteEntry = (entryKey: string, itemIndex: number) => {
    
    if (!selectedIdArray.includes(itemIndex)) {
      setSelectedIdArray((prevNumbers) => [...prevNumbers, itemIndex]);
    } else {
      setSelectedIdArray((prevNumbers) =>
        prevNumbers.filter((number) => number !== itemIndex)
      );
    }
  };
const [allEntries, setAllEntries] = useState<string[][]>([]); // Now a 2D array
const [currentEntries, setCurrentEntries] = useState<string[]>([]); // Temporary storage

useEffect(() => {
  if (type !== "T_AUDIENCE_DEPT_PROFILE" || !customData?.length) return;
  
  const firstItem = customData[0];
  const newEntries: string[] = [];

  // Process Designation
  if (firstItem?.Designation?.length > 0) {
    newEntries.push(`${firstItem.Designation}_Designation`);
    setDes(prev => [...prev, firstItem.Designation]);
  }

  // Process Department
  if (firstItem?.Department?.length > 0) {
    newEntries.push(`${firstItem.Department}_Department`);
    setDep(prev => [...prev, firstItem.Department]);
  }

  // Process Seniority
  if (firstItem?.Seniority?.length > 0) {
    newEntries.push(`${firstItem.Seniority}_Seniority`);
    setSen(prev => [...prev, firstItem.Seniority]);
  }

  setCurrentEntries(newEntries);
}, [customData, type]);

useEffect(() => {
  if (isNew && currentEntries.length > 0) {
    setAllEntries(prev => [...prev, currentEntries]);
    setCurrentEntries([]); // Reset for next batch
  }
}, [isNew, currentEntries]);
console.log("des",des);

   const removeCustomData = () => {
    const filteredData = customData.filter(
      (item, index) => !selectedIdArray.includes(index)
    );
    if(eventSuggestion && setEventSuggestion){
    const filteredEventSuggestion = eventSuggestion.filter((item: any, i: number) => !selectedIdArray.includes(eventSuggestion.length-i-1));
    setEventSuggestion(filteredEventSuggestion);
    }
    handleCustomData(filteredData);
    setSelectedIdArray([]);
  };

  const selectAllData = () => {
    if (selectedIdArray.length == customData.length) setSelectedIdArray([]);
    else setSelectedIdArray(customData.map((_, index) => index));
  };
  const deleteSingleEntry = (index: number) => {
    const filteredData = customData.filter((_, i) => i !== index);
    if(eventSuggestion && setEventSuggestion)
    setEventSuggestion(eventSuggestion.filter((item: any, i: number) => i !== eventSuggestion.length-index-1));
    handleCustomData(filteredData);
    setSelectedIdArray([]);
  };
  console.log("selectedIdArray", eventSuggestion);
  
  return (
    <div className="flex flex-col gap-[var(--spacing-xs)] relative">
      
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <div className="flex items-center gap-1 text-sm text-[var(--secondary-text-color)] font-medium" >
        <div className="flex items-center text-[#0062D1] font-[var(--font-weight-regular)] leading-[var(--line-height-small)]" style={{fontSize:"var(--font-size-small)"}}>
          <InformationFill style={{marginBottom: "3px"}} color="var(--info-text-color)" height="12px" />
          {" "} You can edit or remove unwanted entries from here.
          </div>
          {/* {presetName &&
            <span title={presetName} className="mr-3 p-1 px-2 bg-[var(--primary-light-color)] font-medium text-xs rounded-md text-[var(--primary-color)]" >Preset Selected</span>
          } */}
          <span className="hidden md:block">
          Total {customData.length} records
          </span>
        </div>
        {selectedIdArray.length > 0 && (
          <div className="cursor-pointer text-xs text-[var(--danger-text-color)] font-medium" onClick={removeCustomData}>
            Remove Selected
          </div>
        )}
      </div>
      {/* {selectedIdArray.length > 0 && (
        <div className={styles.remove_all_custom} onClick={removeCustomData}>
          Remove Selected
        </div>
      )} */}
      <div className="max-h-[300px] overflow-y-auto">
        <table className={`${styles.allCustomData} w-[100%] bg-[var(--primary-foreground)]`}>
          
          <thead>
            <tr>
              <th>
                <CheckboxInput
                  id={"abc"}
                  onChange={selectAllData}
                  checked={selectedIdArray.length === customData.length}
                />
              </th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
                  <tr>
                    <td>
                      {/* <div className={styles.square} onClick={() => deleteEntry(item, index)}>-</div> */}
                      {/* <CheckboxInput
                        id={"abc"}
                        onChange={() => deleteEntry(item, index)}
                        checked={selectedIdArray.includes(index)}
                      /> */}
                    </td>
                    <td>
  {allEntries.map((entryGroup, groupIndex) => (
    <div key={`group-${groupIndex}`}>
      {entryGroup.map((item, itemIndex) => (
        <div
          key={`item-${groupIndex}-${itemIndex}`}
          className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mr-1 mb-1 cursor-default"
        >
          {item?.split("_")[0]}
        </div>
      ))}
    </div>
  ))}
</td>
                    <td className="w-[35px] cursor-pointer" >
                    <Trash />
                    </td>
                  </tr>
               
          </tbody>
        </table>
      </div>
      {customData.length > 5 && (
        <div
          className="text-sm text-[var(--secondary-text-color)] font-medium cursor-pointer flex gap-1"
          onClick={() => setExpandTable((prev) => !prev)}
        >
          {expandTable ? "Show Less" : "Show All"}
          <span className="block md:hidden">({customData.length})</span>
        </div>
      )}
    </div>
  );
};

export default TemplateTable;