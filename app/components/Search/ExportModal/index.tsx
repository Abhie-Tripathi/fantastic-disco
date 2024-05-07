import React, { useState } from "react";
import styles from "./exportmodal.module.css";
import CloseIcon from "/public/close.svg";
import Image from "next/image";
import Refresh from "/public/Refresh.svg";
import HelpIcon from "/public/help.svg";
import MinusIcon from "/public/minus.svg";
import DownloadIcon from "/public/download.svg";
import GreenCheck from "/public/greenCheck.svg";
import { useTheme } from "@/context";

interface exportModalProps {
  onClose: () => void;
}

const ExportModal = ({ onClose }: exportModalProps) => {
  const [activeTab, setActiveTab] = useState("CSV");
  const [showExportedFiles, setShowExportedFiles] = useState(false);
  const {theme} = useTheme();
  const iconClass = theme === 'light' ? 'icons_light' : 'icon'

  return (
    <div className={styles.container}>
      {!showExportedFiles && (
        <div className={`${styles.exportType_modal} ${theme === 'light' && styles.exportType_modal_light}`}>
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
            onClick={() => setShowExportedFiles(true)}
          >
            Export
          </div>
        </div>
      )}

      {showExportedFiles && (
        <div className={`${styles.exportedfiles_modal} ${theme === 'light' && styles.exportedfiles_modal_light}`}>
          <div className={styles.exportedfiles_header}>
            <div className={styles.exportedfiles_header_title}>
              Exported Files
              <span className={styles.exportedfiles_stats}>2</span>
            </div>

            <div className={styles.refresh_button}>
              <Image src={Refresh} alt="refresh" width={24} height={24} className={iconClass} />
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
              <Image src={HelpIcon} alt="helpicon" width={28} height={28}  />
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

            <div className={styles.exportedfile}>
              <div className={styles.exportedfile_info}>
                <div className={styles.exportedfile_name}>
                  Real-World-Events-20240328-0645.csv
                </div>
                <div className={styles.exportedfile_description}>
                  28 Mar 2024 12:15 PM by Abhinav Tripathi
                </div>
              </div>

              <div className={styles.exportedfile_controls}>
                <div className={styles.exportedfile_status}>processing</div>
                <span className={styles.exportedfile_minusicon}>
                  <Image src={MinusIcon} alt="minusicon"  />
                </span>
              </div>
            </div>

            <div className={styles.exportedfile}>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportModal;