import React, { useEffect, useState } from "react";
import styles from "./exportmodal.module.css";
import CloseIcon from "/public/close.svg";
import Image from "next/image";
import Refresh from "/public/Refresh.svg";
import HelpIcon from "/public/help.svg";
import MinusIcon from "/public/minus.svg";
import DownloadIcon from "/public/download.svg";
import { useTheme } from "@/context";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
import Loading from "../../UI/Loading";
import backIcon from "/public/internal/back_arrow.svg";
import Link from "next/link";
import { usePathname } from 'next/navigation';
interface exportModalProps {
  onClose: () => void;
  filterValue?: any;
  type?:string|undefined;
}

interface ExportContent {
  id: string;
  created: string;
  status: string;
  attachment: {
    fileType: string;
    fileName: string;
    filePath: string;
  };
  user: {
    firstname: string;
    lastname: string;
  };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  const months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const year: number = date.getFullYear();
  const month: string = months[date.getMonth()];
  const day: number = date.getDate();
  let hours: number = date.getHours();
  let minutes: number | string = date.getMinutes();
  let am_pm: string = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  minutes = minutes < 10 ? "0" + minutes : minutes;

  const formattedDate: string = `${day} ${month} ${year} ${hours}:${minutes} ${am_pm}`;
  return formattedDate;
}

const ExportModal = ({ onClose, filterValue, type }: exportModalProps) => {
  const pathName = usePathname().split('/');
  const [activeTab, setActiveTab] = useState("CSV");
  const [showExportedFiles, setShowExportedFiles] = useState(false);
  const [exportList, setExportList] = useState<ExportContent[]>([]);
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";

  const [refreshState, setRefreshState] = useState<boolean>(false);

  const fetchData = async () => {
    setRefreshState(true);
    if(type){
      const { data, error } = await myFetch(`${baseUrl}/export/list?tracker=${pathName[pathName.length-2]}`);
    console.log(data);
    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      setExportList(data);
      setTimeout(() => {
        setRefreshState(false);;
      }, 500);
    }
    }else{
    const { data, error } = await myFetch(`${baseUrl}/export/list`);
    console.log(data);
    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      setExportList(data);
      setTimeout(() => {
        setRefreshState(false);;
      }, 500);
    }
  }
  };
  useEffect(() => {
    if (showExportedFiles) {
      fetchData();
    }
  }, [showExportedFiles]);

  const exportDataHandler = async () => {
    if(type){
      const dataToSend={
          type:type,
      }
      const { data, error } = await myFetch(`${baseUrl}/tracker/${pathName[pathName.length-2]}/export`, {
        method: "POST",
        body: JSON.stringify(dataToSend),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (error) {
        console.log("Unable to send the post request", error);
        return;
      }
  
      // console.log(data);
      if (data) {
        console.log("Export Post Api", data);
        setShowExportedFiles(true);
      }
    }else{
    const formData = new URLSearchParams();
    Object.entries(filterValue).forEach(([key, value]: [string, any]) => {
      formData.append(key, value);
    });

    const { data, error } = await myFetch(`${baseUrl}/export`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (error) {
      console.log("Unable to send the post request", error);
      return;
    }

    // console.log(data);
    if (data) {
      console.log("Export Post Api", data);
      setShowExportedFiles(true);
    }
  }
  };

  const deleteFileHandler = async (dataexportId: string) => {
    const { data, error } = await myFetch(`${baseUrl}/export/${dataexportId}`, {
      method: "DELETE",
    });
    if (error) {
      console.log(error);
      return;
    }

    console.log("delete", data);
    if (data) {
      console.log("Deleted Successfully");
    }
    setExportList((prevFiles) =>
      prevFiles.filter((file) => file.id !== dataexportId)
    );
  };

  const downloadHandler = async (dataRequestId: string) => {
    const { data, error } = await myFetch(
      `${baseUrl}/export/download/${dataRequestId}`,
      {
        method: "POST",
      }
    );

    if (error) {
      console.log(error);
      return;
    }
    console.log(data);
    if (data) {
      console.log(data);
    }
  };

  return (
    <div className={styles.container}>
      {!showExportedFiles && (
        <div
          className={`${styles.exportType_modal} ${
            theme === "light" && styles.exportType_modal_light
          }`}
        >
          <div className={styles.exportType_modal_header}>
            <div className={styles.exportType_modal_header_title}>
              Export Events
            </div>
            <Image
              src={CloseIcon}
              alt="closeicon"
              onClick={() => onClose()}
              className={styles.closeIcon}
            />
          </div>

          <div className={styles.tabs_container}>
            <div
              className={`${styles.tab} ${
                activeTab == "CSV" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("CSV")}
            >
              CSV
            </div>
            <div
              className={`${styles.tab} ${
                activeTab == "JSONL" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("JSONL")}
            >
              JSONL
            </div>
          </div>

          <div className={styles.exportType_modal_description}>
            Exporting a large number of records will take some time to process.
            You can check the progress of your export in the exported files
            dialog.
          </div>

          <div
            className={styles.exportType_modal_button}
            onClick={exportDataHandler}
          >
            Export
          </div>
          <div
            className={styles.exportType_modal_button2}
            onClick={()=>setShowExportedFiles(true)}
          >
            See previous export files
          </div>
        </div>
      )}

      {showExportedFiles &&
        (exportList.length < 0 ? (
          <div className={styles.exportedfiles_modal}>
            <Loading />
          </div>
        ) : (
          <div
            className={`${styles.exportedfiles_modal} ${
              theme === "light" && styles.exportedfiles_modal_light
            }`}
          >
            <div className={styles.exportType_backArrow}>
              <Image
                src={backIcon}
                alt="back"
                onClick={() => setShowExportedFiles(false)}
              />
            </div>
            <div className={styles.exportedfiles_header}>
              <div className={styles.exportedfiles_header_title}>
                Exported Files
                <span className={styles.exportedfiles_stats}>2</span>
              </div>

              <div className={styles.refresh_button} onClick={fetchData}>
                <Image
                  src={Refresh}
                  alt="refresh"
                  width={24}
                  height={24}
                  className={`${iconClass} ${refreshState ?styles.rotating: ''}`}
                />
                <div>refresh</div>
              </div>

              <Image
                src={CloseIcon}
                alt="closeicon"
                onClick={() => onClose()}
                className={styles.closeIcon}
              />
            </div>

            <div className={styles.exportedfiles_container}>
              <div className={styles.alertpanel}>
                <Image src={HelpIcon} alt="helpicon" width={28} height={28} />
                <div className={styles.alerttext}>
                  <div>
                    Large exports may take some time. Exports will run in the
                    background after you close this window and we will email you
                    when they are done.
                  </div>
                  <div>
                    Open Exported Files again to check the progress and download
                    when completed. Completed exports are automatically deleted
                    after 30 days.
                  </div>
                </div>
              </div>

              {exportList.map((exportItem) => (
                <div className={styles.exportedfile} key={exportItem.id}>
                  <div className={styles.exportedfile_info}>
                    <div className={styles.exportedfile_name}>
                      {exportItem.attachment.fileName}
                    </div>
                    <div className={styles.exportedfile_description}>
                      {formatDate(exportItem.created)} by {exportItem.user.firstname}{" "}
                      {exportItem.user.lastname}
                    </div>
                  </div>

                  <div className={styles.exportedfile_controls}>
                    <div className={styles.exportedfile_status}>
                      {exportItem.status === "COMPLETED" && (
                        <>
                          {/* <Image src={GreenCheck} alt="greencheck" /> */}
                          {/* <div>0.03MB</div> */}
                        </>
                      )}
                      {exportItem.status}
                      {exportItem.status === "COMPLETED" && (
                        <Link href={exportItem.attachment.filePath}>
                          <span
                            className={styles.exportedfile_downloadicon}
                            onClick={() => downloadHandler(exportItem.id)}
                          >
                            <Image
                              src={DownloadIcon}
                              width={20}
                              height={20}
                              alt="download"
                            />
                          </span>
                        </Link>
                      )}
                    </div>
                    <span
                      className={styles.exportedfile_minusicon}
                      onClick={() => deleteFileHandler(exportItem.id)}
                    >
                      <Image src={MinusIcon} alt="minusicon" />
                    </span>
                  </div>
                </div>
              ))}

              {/* <div className={styles.exportedfile}>
                <div className={styles.exportedfile_info}>
                  <div className={styles.exportedfile_name}>
                    Real-World-Events-20240328-0645.csv
                  </div>
                  <div className={styles.exportedfile_description}>
                    28 Mar 2024 12:15 PM by Abhinav Tripathi
                  </div>
                </div>

                <div className={styles.exportedfile_controls}>
                  <div className={styles.exportedfile_status}>
                    <Image src={GreenCheck} alt="greencheck" />
                    <div>0.03MB</div>
                  </div>
                  <span className={styles.exportedfile_downloadicon}>
                    <Image
                      src={DownloadIcon}
                      width={20}
                      height={20}
                      alt="download"
                    />
                  </span>
                  <span className={styles.exportedfile_minusicon}>
                    <Image src={MinusIcon} alt="minusicon" />
                  </span>
                </div>
              </div> */}
            </div>
          </div>
        ))}
    </div>
  );
};

export default ExportModal;
