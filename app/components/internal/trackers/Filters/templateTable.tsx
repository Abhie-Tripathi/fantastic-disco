import CheckboxInput from "@/app/components/UI/CheckBoxInput";
import styles from "./templatetable.style.module.css";
import { use, useEffect, useRef, useState } from "react";
import { InformationFill, Trash } from "geist-icons";
import { formatEventDates } from "@/utils/dateFormat";
import { formattedDateRange } from "@/utils/date";
import { formatLocationParts } from "@/utils/locationFormat";
import { Event } from "@/types/events";
import React from "react";
import { Table, X } from "lucide-react";
import { set } from "date-fns";
import { group } from "console";
interface UpdatedProfileData{
  designationIds?: string[];
  departmentIds?: string[];
  seniorityIds?: string[];
}
interface Props {
  eventSuggestion?: string[];
  setEventSuggestion?: (value: string[]) => void;
  customData: any[];
  handleCustomData: (data: any) => void;
  presetName?: string;
  type?: string;
  isNew?: boolean;
  setIsNew?: (value: boolean) => void;
  profileIds?: UpdatedProfileData[] | undefined;
  setProfileIds?: React.Dispatch<React.SetStateAction<UpdatedProfileData[]>>;
  allEntries?: string[][];
  setAllEntries?: React.Dispatch<React.SetStateAction<string[][]>>;

}
interface TableViewProps {
  selectAllData: () => void;
  selectedIdArray: number[];
  customData: any[];
  allEntries: string[][];
  deleteEntry: (entryKey: string, itemIndex: number) => void;
  handleRemove: (id: number, groupIndex: number, itemIndex: number) => void;
  deleteSingleEntry: (index: number) => void;
}
const TemplateTable = ({ customData, handleCustomData, presetName, setEventSuggestion, eventSuggestion, type,isNew, setIsNew, profileIds, setProfileIds, allEntries, setAllEntries }: Props) => { 
  
  const [des, setDes]= useState<string[]>([]);
  const [dep, setDep] = useState<string[]>([]);
  const [sen, setSen] = useState<string[]>([]);
  const [expandTable, setExpandTable] = useState<boolean>(false);
  const [selectedIdArray, setSelectedIdArray] = useState<number[]>([]);
  const prevIsNewRef = useRef<boolean | undefined>(false);
    useEffect(() => {
    if (isNew && !prevIsNewRef.current) {
      setCurrentEntries([]);
    }
    prevIsNewRef.current = isNew;
  }, [isNew]);
  const deleteEntry = (entryKey: string, itemIndex: number) => {
    
    if (!selectedIdArray.includes(itemIndex)) {
      setSelectedIdArray((prevNumbers) => [...prevNumbers, itemIndex]);
    } else {
      setSelectedIdArray((prevNumbers) =>
        prevNumbers.filter((number) => number !== itemIndex)
      );
    }
  };
//  const [allEntries, setAllEntries] = useState<string[][]>([[]]);
const [currentEntries, setCurrentEntries] = useState<string[]>([]);
useEffect(() => {
  if (type !== "T_AUDIENCE_DEPT_PROFILE" || !customData?.length) return;
  
  const firstItem = customData[0];
  const newEntries: string[] = [];
  
  // Process fields only if they have values
  if (firstItem?.Designation?.trim()) {
    newEntries.push(`${firstItem.Designation}_Designation`);
    setDes((prev:string[]) => [...prev, firstItem.Designation]);
  }
  if (firstItem?.Department?.trim()) {
    newEntries.push(`${firstItem.Department}_Department`);
    setDep((prev:string[]) => [...prev, firstItem.Department]);
  }
  if (firstItem?.Seniority?.trim()) {
    newEntries.push(`${firstItem.Seniority}_Seniority`);
    setSen(prev => [...prev, firstItem.Seniority]);
  }
  
  setCurrentEntries(newEntries);
  if (newEntries.length === 0) return;

}, [customData, type]);

useEffect(() => {
   setAllEntries?.(prev => {
    if (isNew) {
      const newState = [...prev, []];
      
      setCurrentEntries([]);
      return newState;
    } else {
      // When isNew is false, add to the last array
      if (prev.length === 0) return [currentEntries]; // Handle empty case
      
      const lastArray = prev[prev.length - 1];
      const updatedLastArray = [...lastArray, ...currentEntries];
      
      return [
        ...prev.slice(0, -1), // All arrays except last
        updatedLastArray       // Updated last array
      ];
    }
  });
  setIsNew?.(false);

}, [isNew, currentEntries]);

   const removeCustomData = () => {
    const updatedEntries = allEntries?.filter((_, index) => !selectedIdArray.includes(index));
    const updatedProfileIds = profileIds?.filter((_, index) => !selectedIdArray.includes(index));
    setProfileIds?.(updatedProfileIds || []);
    setAllEntries?.(updatedEntries || []);
    // const filteredData = customData.filter(
    //   (item, index) => !selectedIdArray.includes(index)
    // );
    // if(eventSuggestion && setEventSuggestion){
    // const filteredEventSuggestion = eventSuggestion.filter((item: any, i: number) => !selectedIdArray.includes(eventSuggestion.length-i-1));
    // setEventSuggestion(filteredEventSuggestion);
    // }
    // handleCustomData(filteredData);
    // setSelectedIdArray([]);
  };

  const selectAllData = () => {
    if (selectedIdArray.length == customData.length) setSelectedIdArray([]);
    else setSelectedIdArray(customData.map((_, index) => index));
  };
  const deleteSingleEntry = (index: number) => {
    
    if(type==="T_AUDIENCE_DEPT_PROFILE"){
    setAllEntries?.(prev => prev.filter((_, id) => id !== index))
    const updatedProfileIds = profileIds?.filter((_, id) => id !== index);
    setProfileIds?.(updatedProfileIds || []);
    }else{
      const filteredData = customData.filter((_, i) => i !== index);
    if(eventSuggestion && setEventSuggestion)
    setEventSuggestion(eventSuggestion.filter((item: any, i: number) => i !== eventSuggestion.length-index-1));
    handleCustomData(filteredData);
    setSelectedIdArray([]);
    }
  };
  const handleRemove =(id:number, groupIndex:number, itemIndex:number)=>{
    
       setAllEntries?.(prev => {
    const updatedEntries = prev.map(group => [...group]);
    updatedEntries[groupIndex].splice(itemIndex, 1);
    if (updatedEntries[groupIndex].length === 0) {
      updatedEntries.splice(groupIndex, 1);
    }
    
    return updatedEntries;
  });
    const updatedDesignationIds = profileIds?.[groupIndex]?.designationIds?.filter((item: string) => parseInt(item) !== id);
    const updatedDepartmentIds  = profileIds?.[groupIndex]?.departmentIds?.filter((item: string) => parseInt(item) !== id);
    const updatedSeniorityIds = profileIds?.[groupIndex]?.seniorityIds?.filter((item: string) => parseInt(item) !== id);
    const updatedProfile ={
      "designationIds": updatedDesignationIds,
      "departmentIds": updatedDepartmentIds,
      "seniorityIds": updatedSeniorityIds
    }
    
   if (setProfileIds) {
 setProfileIds((prev = []) => {
  const newProfileIds = [...prev];
  if (newProfileIds[groupIndex] !== undefined) {
    newProfileIds[groupIndex] = updatedProfile ;
  }
  return newProfileIds;
});
}
  }
  
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
          Total {type==="T_AUDIENCE_DEPT_PROFILE"?(allEntries?.[allEntries?.length-1]?.length===0?allEntries?.length-1:allEntries?.length):customData.length} records
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
        {type === "T_AUDIENCE_DEPT_PROFILE" ?
        <TableView selectAllData={selectAllData} selectedIdArray={selectedIdArray} customData={customData} allEntries={expandTable?(allEntries || []):(allEntries?.slice(0,5) || [])} deleteEntry={deleteEntry} handleRemove={handleRemove} deleteSingleEntry={deleteSingleEntry}/>:
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
        </table>}
      </div>
      {(type === "T_AUDIENCE_DEPT_PROFILE" && allEntries?.[allEntries?.length-1].length===0?allEntries?.length-1>5:(allEntries?.length || 0)>5) && (
        <div className="text-sm text-[var(--secondary-text-color)] font-medium cursor-pointer flex gap-1" onClick={() => setExpandTable((prev) => !prev)}>
          {expandTable ? "Show Less" : "Show All"}
          <span className="block md:hidden">({allEntries?.length})</span>
        </div>
      )}
      {(customData.length > 5 && type!=="T_AUDIENCE_DEPT_PROFILE") && (
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

const  TableView=({selectAllData, selectedIdArray, customData, allEntries, deleteEntry, handleRemove, deleteSingleEntry}:TableViewProps)=>{
  return (
    <table className={`${styles.allCustomData} w-[100%] bg-[var(--primary-foreground)]`}>
          
          <thead>
            <tr>
              <th>
                <CheckboxInput
                  id={"abc"}
                  onChange={selectAllData}
                  checked={selectedIdArray.length === (customData.length || allEntries?.length)}
                />
              </th>
              <th>Profile/Seniority/Department</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEntries?.map((entryGroup:string[], groupIndex:number) => (
              // entryGroup.length>0 &&
                  <tr key={groupIndex}>
                    <td>
                      {/* <div className={styles.square} onClick={() => deleteEntry(entryGroup, groupIndex)}>-</div>  */}
                      <CheckboxInput
                        id={"abc"}
                        onChange={() => deleteEntry(entryGroup[groupIndex], groupIndex)}
                        checked={selectedIdArray.includes(groupIndex)}
                      />
                    </td>
                    <td key={`group-${groupIndex}`}>
  {/* {allEntries.map((entryGroup, groupIndex) => ( */}
  
      {entryGroup.map((item:string, itemIndex:number) => (
        <div
          key={`item-${groupIndex}-${itemIndex}`}
          className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mr-1 mb-1 cursor-default"
        >
          {item?.split("_")[0]}
          <div
                                role="button"
                                tabIndex={0}
                                className="ml-1 flex-shrink-0 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleRemove(parseInt(item?.split("_")[1]), groupIndex, itemIndex)
                                  }
                                }}
                                onMouseDown={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemove(parseInt(item?.split("_")[1]), groupIndex, itemIndex)
                                }}
                              >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                              </div>
        </div>
      ))}
  {/* ))} */}
</td>
                    <td className="w-[35px] cursor-pointer" onClick={() => deleteSingleEntry(groupIndex)}>
                    <Trash />
                    </td>
                  </tr>
              
            ))}
          </tbody>
        </table>
  )
}
export default TemplateTable;