import Papa from "papaparse";
import { useEffect, useRef, useState } from "react";
import styles from "./csvuploader.module.css";
import { Cross, Share } from "geist-icons";
import competitorSampleImage from "/public/trackerimages/competitorsample.png";
import Image from "next/image";
import { ReactSpreadsheetImport } from "react-spreadsheet-import";

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
  sampleImage?: string;
}

interface Props {
  templateData: Template;
  customData: any[];
  handleCustomData: (data: any) => void;
  setUploadEnabled: any;
  setInputFieldEnabled: any;
  setSelectedEventKeywords: any;
}

const allowedTypes = ["text/csv"];

const CsvUploader = ({
  templateData,
  customData,
  handleCustomData,
  setUploadEnabled,
  setInputFieldEnabled,
  setSelectedEventKeywords,
}: Props) => {
  const parseLimit = 11;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const [parsedData, setParsedData] = useState([]);
  const [parsingError, setParsingError] = useState("");
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [dragging, setDragging] = useState(false);

  const parseFile = (file: any) => {
    if (file) {
      Papa.parse(file, {
        header: false,
        preview: parseLimit,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          console.log("parsed results", results.data);
          if (results.data.length > 1) {
            const csvData = results.data.slice(1);
            setParsedData(csvData);
            setInputFieldEnabled(true);
          }
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

  const validateFile = (file: any) => {
    if (file) {
      setFileName(file.name);
      if (!allowedTypes.includes(file.type)) {
        setParsingError("Please upload only CSV files");
        return;
      } else if (file.size > MAX_FILE_SIZE) {
        setParsingError("File size should be less than 5MB");
        return;
      }

      setUploadedFile(file);
      setParsingError("");
      // setIsDataLoading(true);

      parseFile(file);
    }
  };

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    validateFile(file);
    return;
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      const inputElement = fileInputRef.current as HTMLInputElement;
      inputElement.click();
    }
  };

  const handleCancelRequest = () => {
    setFileName("");
    setParsedData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleContinue = () => {
    if (uploadedFile) {
      setIsDataLoading(true);
      Papa.parse(uploadedFile, {
        header: false,
        preview: parseLimit,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          console.log("parsed results", results.data);
          if (results.data.length > 1) {
            const csvData = results.data.slice(1);
            setParsedData(csvData);
            setInputFieldEnabled(true);
          }
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

  const handleClose = () => {
    setUploadEnabled(false);
    setInputFieldEnabled(true);
  };

  const handleDragEnter = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    validateFile(e?.dataTransfer.files[0]);
  };

  useEffect(() => {
    const finalData2: any = [];
    if (templateData.name === "T_PRODUCT_KEYWORDS") {
      parsedData.map((data, index) => {
        if (data[0] && data[0] !== "") finalData2.push(data[0]);
        if (data[1] && data[1] !== "") finalData2.push("-" + data[1]);
      });
      setSelectedEventKeywords(finalData2);
    } else {
      parsedData.map((data, index) => {
        let tempObj: any = {};
        templateData.inputAreas?.map((item, i) => {
          let t_name = item.placeholder;
          tempObj[t_name] = data[i];
        });
        finalData2.push(tempObj);
      });

      if (finalData2 && finalData2.length > 0) handleCustomData(finalData2);
    }
  }, [parsedData]);

  const [uploaderOpen, setUploaderOpen] = useState<boolean>(true);
  const onClose = () => {
    console.log('onClose');
    setUploaderOpen(false);
    setUploadEnabled(false);
  }

  const onSubmit = (data: any) => {
    console.log('onSubmit', data);
  }

  const speakerFields = [
    {
      // Visible in table header and when matching columns.
      label: "Name",
      // This is the key used for this field when we call onSubmit.
      key: "name",
      // Allows for better automatic column matching. Optional.
      alternateMatches: ["first name", "first"],
      // Used when editing and validating information.
      fieldType: {
        // There are 3 types - "input" / "checkbox" / "select".
        type: "input",
      },
      // Used in the first step to provide an example of what data is expected in this field. Optional.
      example: "Stephanie",
      // Can have multiple validations that are visible in Validation Step table.
      validations: [
        {
          // Can be "required" / "unique" / "regex"
          rule: "required",
          errorMessage: "Name is required",
          // There can be "info" / "warning" / "error" levels. Optional. Default "error".
          level: "error",
        },
      ],
    },
    {
      // Visible in table header and when matching columns.
      label: "Company1",
      // This is the key used for this field when we call onSubmit.
      key: "company",
      // Allows for better automatic column matching. Optional.
      // alternateMatches: ["first name", "first"],
      // Used when editing and validating information.
      fieldType: {
        // There are 3 types - "input" / "checkbox" / "select".
        type: "input",
      },
      // Used in the first step to provide an example of what data is expected in this field. Optional.
      example: "10times.com",
      // Can have multiple validations that are visible in Validation Step table.
      validations: [
        {
          // Can be "required" / "unique" / "regex"
          rule: "required",
          errorMessage: "company name/website is required",
          // There can be "info" / "warning" / "error" levels. Optional. Default "error".
          level: "error",
        },
      ],
    },
  ]

  return (
    <>
      <ReactSpreadsheetImport 
        isOpen={uploaderOpen}
        onClose={onClose}
        onSubmit={onSubmit}
        fields={speakerFields}
        maxRecords={100}
        maxFileSize={5000000}

        customTheme={{
          colors: {
            background: 'var(--primary-foreground)',
            textColor: 'var(--primary-text-color)',
            highlight: "yellow",
            secondaryBackground: 'var(--heading-background-color)',
            border: "var(--border-color)",
            rsi: {
              50: 'var(--tabs-background-color)',
              100: 'var(--tabs-background-color)',
              200: 'var(--primary-color)',
              300: 'var(--primary-color)',
              400: 'var(--primary-color)',
              500: 'var(--primary-color)',
              600: 'var(--primary-color)',
              700: 'var(--primary-color)',
              800: 'var(--primary-color)',
              900: 'var(--primary-color)',
            },
          },
        }}
      />
    </>
  );

  return (
    <>
      <div className={styles.container}>
        <div
          className={`${styles.upload_container} ${
            dragging ? styles.blur_background : ""
          }`}
          onClick={handleButtonClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Share
            style={{ marginBottom: "3px", color: "var(--primary-text-color)" }}
            height="15px"
            width="15px"
          />
          &nbsp; Click or Drag files to this area to upload
        </div>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          ref={fileInputRef}
          style={{ display: "none" }}
        />

        <div className={styles.action_container}>
          <div className={styles.file_name}>
            {parsingError ? (
              <>
                {/* <div className={styles.error} >{fileName}</div> */}
                <span className={styles.error}>
                  {fileName} ({parsingError})
                </span>
              </>
            ) : fileName ? (
              <div title={fileName} className={styles.success}>
                {fileName}
                <Cross
                  style={{
                    cursor: "pointer",
                    color: "var(--primary-text-color)",
                  }}
                  height="11px"
                  onClick={handleCancelRequest}
                />
              </div>
            ) : (
              <></>
            )}
          </div>

          {/* <div className={styles.button_container}>
            <Button10x style={{ color: "var(--primary-text-color)" }} variant="tertiary" size="sm" onClick={handleClose}>Close</Button10x>
            <Button10x style={{ color: "white" }} variant="primary" size="sm" isLoading={isDataLoading} onClick={handleContinue} >Continue</Button10x>
          </div> */}

          <div className={styles["hover-container"]}>
            <p className={styles["hover-text"]}>See Sample File</p>
            {templateData?.sampleImage &&
              <Image
                src={templateData.sampleImage}
                alt="sample"
                className={styles["hover-image"]}
                width={320}
                height={240}
              />
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default CsvUploader;
