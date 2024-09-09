import { Button as Button10x } from "10xui";
import Papa from "papaparse";
import { useEffect, useRef, useState } from "react";
import styles from "./csvuploader.module.css";

interface InputArea {
  type: string;
  placeholder: string;
}

interface Template {
  name: string;
  type?: string;
  templateName?: string;
  description?: string | undefined;
  inputAreas?: InputArea[];
}

interface Props {
  templateData: Template;
  customData: any[];
  handleCustomData: (data: any) => void;
}

const CsvUploader = ({ templateData, customData, handleCustomData }: Props) => {
  const parseLimit = 10;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const [parsedData, setParsedData] = useState([]);
  const [parsingError, setParsingError] = useState("");
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef(null);

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setParsingError("File size should be less than 5MB.");
        return;
      }

      setFileName(file.name);
      setParsingError("");
      setIsDataLoading(true);

      Papa.parse(file, {
        header: false,
        preview: parseLimit,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          console.log("parsed results", results.data, file);
          setParsedData(results.data);
          setIsDataLoading(false);

          // handleCustomData();
        },
        error: (error: any) => {
          console.error("Error parsing CSV file:", error);
          setIsDataLoading(false);
        },
      });
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      const inputElement = fileInputRef.current as HTMLInputElement;
      inputElement.click();
    }
  };

  useEffect(()=>{
    const finalData: any = [];
    parsedData.map((data, index)=>{
      console.log('parsedData1', index, data);
      let t_name = templateData.inputAreas[0].placeholder;
      finalData.push({[t_name]: data[0]});
    })
    console.log('finalData', finalData);
    handleCustomData(finalData);
  }, [parsedData])

  return (
    <>
      <div className={styles.button_container}>
        <Button10x
          style={{ color: "white", textWrap: "nowrap", width: "fit-content" }}
          variant="primary"
          size="sm"
          onClick={handleButtonClick}
          isLoading={isDataLoading}
        >
          Upload
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
        </Button10x>
        {parsingError ? (
          <span className={styles.error}>{parsingError}</span>
        ) : (
          <span title={fileName} className={styles.success}>
            {fileName}
          </span>
        )}
      </div>
    </>
  );
};

export default CsvUploader;
