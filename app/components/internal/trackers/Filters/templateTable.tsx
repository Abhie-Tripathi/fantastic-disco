import CheckboxInput from "@/app/components/UI/CheckBoxInput";
import styles from "./templatetable.style.module.css";
import { useState } from "react";
import { Trash } from "geist-icons";

interface Props {
  customData: any[];
  handleCustomData: (data: any) => void;
  presetName?: string;
}

const TemplateTable = ({ customData, handleCustomData, presetName }: Props) => {
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
    handleCustomData(filteredData);
    setSelectedIdArray([]);
  };

  const selectAllData = () => {
    if (selectedIdArray.length == customData.length) setSelectedIdArray([]);
    else setSelectedIdArray(customData.map((_, index) => index));
  };
  const deleteSingleEntry = (index: number) => {
    const filteredData = customData.filter((_, i) => i !== index);
    handleCustomData(filteredData);
    setSelectedIdArray([]);
  };
  
  return (
    <div className="flex flex-col gap-[var(--spacing-xs)] relative">
      
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <div className="text-sm text-[var(--secondary-text-color)] font-medium" >
          {presetName &&
            <span title={presetName} className="mr-3 p-1 px-2 bg-[var(--primary-light-color)] font-medium text-xs rounded-md text-[var(--primary-color)]" >Preset Selected</span>
          }
          Total {customData.length} records
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
              {Object.entries(customData[0]).map(([entryKey, value]) => (
                <th key={entryKey} className={styles.dataColoumn}>
                  {entryKey as string}
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
                    {Object.entries(item).map(([entryKey, value]) => (
                      <td key={entryKey} className={styles.dataColoumn}>
                        {value as string}
                      </td>
                    ))}
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
                    {Object.entries(item).map(([entryKey, value]) => (
                      <td key={entryKey} className={styles.dataColoumn}>
                        {value as string}
                      </td>
                    ))}
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
          className="text-sm text-[var(--secondary-text-color)] font-medium cursor-pointer"
          onClick={() => setExpandTable((prev) => !prev)}
        >
          {expandTable ? "Show Less" : "Show All"}
        </div>
      )}
    </div>
  );
};

export default TemplateTable;