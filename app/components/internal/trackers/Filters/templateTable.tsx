import CheckboxInput from "@/app/components/UI/CheckBoxInput";
import styles from "./templatetable.style.module.css";
import { useState } from "react";
import { InformationFill, Trash } from "geist-icons";
import { formatEventDates } from "@/utils/dateFormat";
import { formattedDateRange } from "@/utils/date";
import { formatLocationParts } from "@/utils/locationFormat";
import { Event } from "@/types/events";
interface Props {
  eventSuggestion?: string[];
  setEventSuggestion?: (value: string[]) => void;
  customData: any[];
  handleCustomData: (data: any) => void;
  presetName?: string;
}

const TemplateTable = ({ customData, handleCustomData, presetName, setEventSuggestion, eventSuggestion }: Props) => { 
  
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
              {customData?.length > 0 && Object?.entries(customData[0]).map(([entryKey, value]) => (
                <th key={entryKey} className={styles.dataColoumn}>
                  {entryKey==="Search By Event Name"?"Event Name":entryKey as string}
                </th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {expandTable
              ? customData.map((item: any, index: number) => (
                  <tr key={index}>
                    <td>
                      {/* <div className={styles.square} onClick={() => deleteEntry(item, index)}>-</div> */}
                      <CheckboxInput
                        id={"abc"}
                        onChange={() => deleteEntry(item, index)}
                        checked={selectedIdArray.includes(index)}
                      />
                    </td>
                    {Object.entries(item).map(([entryKey, value]) => {
                  const stringValue = String(value);
                  const parts = stringValue.split('_');
                  
                  return (
                    <td key={entryKey} className={styles.dataColoumn}>
                      <div>
                        <div>
                          {parts[0]}
                          {parts.length > 1 &&
                          <span className='text-[var(--secondary-text-color)] pl-1' style={{fontSize:"12px"}}>{formattedDateRange(
                                                     parts[5],
                                                     parts[6],
                                                      false
                                                    )}</span>}
                        </div>
                        {parts.length > 1 && (
                          <div className='text-[var(--secondary-text-color)]'>
                            <span className='text-sm'>
                              {formatLocationParts({
                                name: parts?.[1]?.trim() ?? "",
                                cityName: parts?.[2]?.trim() ?? "",
                                countryName: parts?.[3]?.trim() ?? "",
                                locationType: (parts?.[4]?.trim().toUpperCase()) as "VENUE" | "CITY" | "STATE" | "COUNTRY"
                              } as Event["basic"]["eventLocation"], true)}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
                    <td className="w-[35px] cursor-pointer" onClick={() => deleteSingleEntry(index)}>
                    <Trash />
                    </td>
                  </tr>
                ))
              : customData.slice(0, 5).map((item: any, index: number) => (
                  <tr key={index}>
                    <td>
                      {/* <div className={styles.square} onClick={() => deleteEntry(item, index)}>-</div> */}
                      <CheckboxInput
                        id={"abc"}
                        onChange={() => deleteEntry(item, index)}
                        checked={selectedIdArray.includes(index)}
                      />
                    </td>
                    {Object.entries(item).map(([entryKey, value]) => {
                  const stringValue = String(value);
                  const parts = stringValue.split('_');
                  
                  return (
                    <td key={entryKey} className={styles.dataColoumn}>
                      <div>
                        <div>
                          {parts[0]}
                          {parts.length > 1 &&
                          <span className='text-[var(--secondary-text-color)] pl-1' style={{fontSize:"12px"}}>{formattedDateRange(
                                                     parts[5],
                                                     parts[6],
                                                      false
                                                    )}</span>}
                        </div>
                        {parts.length > 1 && (
                          <div className='text-[var(--secondary-text-color)]'>
                            <span className='text-sm'>
                              {formatLocationParts({
                                name: parts?.[1]?.trim() ?? "",
                                cityName: parts?.[2]?.trim() ?? "",
                                countryName: parts?.[3]?.trim() ?? "",
                                locationType: (parts?.[4]?.trim().toUpperCase()) as "VENUE" | "CITY" | "STATE" | "COUNTRY"
                              } as Event["basic"]["eventLocation"], true)}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
                    <td className="w-[35px] cursor-pointer" onClick={() => deleteSingleEntry(index)}>
                    <Trash />
                    </td>
                  </tr>
                ))}
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