import { useEffect, useState } from "react";
// import styles from "./csvuploader.module.css";
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
  setSelectedEventKeywords: any;
}

const CsvUploader = ({
  templateData,
  customData,
  handleCustomData,
  setUploadEnabled,
  setSelectedEventKeywords,
}: Props) => {
  useEffect(() => {
    let tempData: any = [];
    if (templateData.name === "T_PRODUCT_KEYWORDS") {
      tempData.push(
        {
          label: "Keywords",
          key: "Keywords",
          alternateMatches: ["Keywords"],
          fieldType: {
            type: "input",
          },
          example: "Stephanie",
          validations: [
            {
              rule: "required",
              errorMessage: `Keywords is required`,
              level: "error",
            },
          ],
        },
        {
          label: "Excluded Keyword",
          key: "Excluded Keywords",
          alternateMatches: ["Excluded Keywords"],
          fieldType: {
            type: "input",
          },
          example: "Stephanie",
          validations: [
            {
              rule: "unique",
              allowEmpty: true,
              // errorMessage: `Excluded Keywords is required`,
              // level: "error",
            },
          ],
        }
      );
    } else {
      templateData.inputAreas?.map((item, i) => {
        let t_name = item.placeholder;
        tempData.push({
          label: t_name,
          key: t_name,
          alternateMatches: [t_name],
          fieldType: {
            type: "input",
          },
          example: "Stephanie",
          validations: [
            {
              rule: "required",
              errorMessage: `${t_name} is required`,
              level: "error",
            },
          ],
        });
      });
    }
    setCsvFields(tempData);
  }, []);

  const [uploaderOpen, setUploaderOpen] = useState<boolean>(true);

  const onClose = () => {
    setUploaderOpen(false);
    setUploadEnabled(false);
  };

  const onSubmit = (data: any) => {
    console.log("onSubmit", data);

    if (templateData.name === "T_PRODUCT_KEYWORDS") {
      const finalData2: any = [];
      data.validData.map((data: any) => {
        if (data["Keywords"] && data["Keywords"] !== "")
          finalData2.push(data["Keywords"]);
        if (data["Excluded Keywords"] && data["Excluded Keywords"] !== "")
          finalData2.push("-" + data["Excluded Keywords"]);
      });
      setSelectedEventKeywords(finalData2);
    } else handleCustomData(data.validData);
  };

  const [csvFields, setCsvFields] = useState<any[]>([]);

  return (
    <>
      <ReactSpreadsheetImport
        isOpen={uploaderOpen}
        onClose={onClose}
        onSubmit={onSubmit}
        fields={csvFields}
        maxRecords={100}
        maxFileSize={5000000}
        customTheme={{
          colors: {
            background: "var(--primary-foreground)",
            textColor: "var(--primary-text-color)",
            highlight: "var(--primary-color)",
            secondaryBackground: "var(--heading-background-color)",
            border: "var(--border-color)",
            rsi: {
              50: "var(--tabs-background-color)",
              100: "var(--primary-color)",
              200: "var(--primary-color)",
              300: "var(--primary-color)",
              400: "var(--primary-color)",
              500: "var(--primary-color)",
              600: "var(--primary-color)",
              700: "var(--primary-color)",
              800: "var(--primary-color)",
              900: "var(--primary-color)",
            },
          },
        }}
      />
    </>
  );
};

export default CsvUploader;
