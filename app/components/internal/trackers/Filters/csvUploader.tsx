import { useEffect, useState } from "react";
// import styles from "./csvuploader.module.css";
import { ReactSpreadsheetImport } from "react-spreadsheet-import";

interface InputArea {
  type: string;
  placeholder: string;
  example?: string;
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
          example: "Technology",
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
          example: "Medical",
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
          alternateMatches: [t_name, "Competitor Name / Website", "Competitor"],
          fieldType: {
            type: "input",
          },
          example: item.example,
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
    } else {
      const cleanedSpeakers = data.validData
      .map((item: any) => {
          const trimmedItem: any = {};
          Object.keys(item).forEach(key => {
              trimmedItem[key] = item[key].trim();
          });
          return trimmedItem;
      })
      .filter((item: any) => {
          return Object.values(item).every(value => value !== '');
      });

      handleCustomData(cleanedSpeakers);
    }
  };

  const [csvFields, setCsvFields] = useState<any[]>([]);

  return (
    <>
      <ReactSpreadsheetImport
        uploadStepHook={(data: any) => {
          if(data.length == 0) {
            let fieldArr: any = [];
            csvFields.map((fieldItem)=>{
              fieldArr.push(fieldItem.key);
            })
            return [fieldArr, ...data];
          }
          return data
        }}
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
              100: "var(--tabs-background-color)",
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
          components: {
            UploadStep: {
              baseStyle: {
                heading: {
                  fontSize: "2xl",
                  mb: "0.5rem",
                  fontWeight: "semibold",
                },
                title: {
                  fontSize: "1xl",
                  lineHeight: 8,
                  fontWeight: "medium",
                },
                subtitle: {
                  fontSize: "sm",
                  lineHeight: 6,
                  mb: "1rem",
                },
                dropzoneText: {
                  size: "lg",
                  lineHeight: 7,
                  fontWeight: "medium",
                  color: "textColor",
                },
              }
            },
            SelectHeaderStep: {
              baseStyle: {
                heading: {
                  mb: 3,
                  fontSize: "1xl",
                },
              },
            },
            MatchColumnsStep: {
              baseStyle: {
                heading: {
                  mb: 3,
                  fontSize: "2xl",
                },
                title: {
                  fontSize: "1xl",
                  lineHeight: 8,
                  fontWeight: "medium",
                  mb: 2,
                },
              }
            },
            ValidationStep: {
              baseStyle: {
                heading: {
                  fontSize: "2xl",
                },
              }
            },
            Modal: {
              variants: {
                rsi: {
                  header: {
                    px: "2rem",
                    py: "1rem",
                  },
                  body: {
                    paddingX: "2rem",
                    paddingY: "1rem",
                  },
                  footer: {
                    py: "1rem",
                    px: "2rem",
                  },
                }
              }
            },
            MatchIcon: {
              baseStyle: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bg: "background",
                color: "background",

                borderColor: "var(--primary-color)",
                borderRadius: "50%",
                borderWidth: "2px",
                transitionDuration: "ultra-fast",
                _highlighted: {
                  bg: "var(--primary-color)",
                  borderColor: "var(--primary-color)",
                },
              }
            },
          },
          styles: {
            global: {
              ".rdg-cell-error": {
                backgroundColor: 'var(--danger-background-color)'
              },
              ".cui-steps__step-icon-container[data-highlighted]": {
                background: 'var(--primary-color)!important',
                borderColor: 'var(--primary-color)!important'
              },
              ".cui-steps__step-icon-container[aria-current=step]": {
                borderColor: 'var(--primary-color)!important'
              },
              ".cui-steps__horizontal-step[data-highlighted]:not(:last-child):after": {
                backgroundColor: 'var(--primary-color)!important'
              },
              ".chakra-switch__track[data-checked]": {
                backgroundColor: 'var(--primary-color)!important'
              },
              ".chakra-checkbox__control[data-checked]": {
                backgroundColor: 'var(--primary-color)!important',
                borderColor: 'var(--primary-color)!important'
              },
            }
          }
        }}
        translations={{
          uploadStep: {
            // manifestTitle: "",
            manifestDescription: "(You can rename or remove columns in the next steps. The first row will be used as the header)",
            // <ul style={{fontSize: '12px'}}>
            //   <li>Text line 1</li>
            //   <li>Text line 2</li>
            // </ul>,
            dropzone: {
              title: "Upload .xlsx, .xls or .csv file (File size should be less than 5MB)",
              errorToastDescription: "upload rejected",
              activeDropzoneTitle: "Drop file here...",
              buttonTitle: "Select file",
              loadingTitle: "Processing...",
            },
          }
        }}
      />
    </>
  );
};

export default CsvUploader;
