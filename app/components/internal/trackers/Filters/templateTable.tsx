import CheckboxInput from "@/app/components/UI/CheckBoxInput";
import styles from "./templatetable.style.module.css";
import { useState } from "react";

interface Props {
  customData: any[];
  handleCustomData: (data: any) => void;
}

const TemplateTable = ({ customData, handleCustomData }: Props) => {
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

  return (
    <div className={styles.allCompetitors}>
      
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <div className={styles.totalRecords} >Total {customData.length} records</div>
        {selectedIdArray.length > 0 && (
          <div className={styles.remove_all_custom} onClick={removeCustomData}>
            Remove Selected
          </div>
        )}
      </div>
      {/* {selectedIdArray.length > 0 && (
        <div className={styles.remove_all_custom} onClick={removeCustomData}>
          Remove Selected
        </div>
      )} */}
      <div className={styles.table_container}>
        <table className={styles.allCustomData}>
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
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {customData.length > 5 && (
        <div
          className={styles.expandTableBtn}
          onClick={() => setExpandTable((prev) => !prev)}
        >
          {expandTable ? "Read Less" : "Read More"}
        </div>
      )}
    </div>
  );
};

export default TemplateTable;
