import React, { useEffect, useState } from "react";
import styles from "./exportmodal.module.css";
import CloseIcon from "/public/close.svg";
import Image from "next/image";
import Refresh from "/public/Refresh.svg";
import HelpIcon from "/public/help.svg";
import MinusIcon from "/public/minus.svg";
import DownloadIcon from "/public/download.svg";
import { useAuthContext, useTheme } from "@/context";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
import Loading from "../../UI/Loading";
import backIcon from "/public/internal/back_arrow.svg";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { showToast } from "@/utils/showToast";
import { GAEvent } from "@/utils/GAEvent";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, X } from "lucide-react";
import { isEventeli } from "@/config";
import { MembershipPlan } from "@/data/membershipPlans";
import { useTrackerServices } from "@/services/trackerServices";
import ExportList from "./exportList";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/useMediaQuery";
interface exportModalProps {
  onClose: () => void;
  filterValue?: any;
  type?:string|undefined;
  source:string;
  active?:string;
}
const sampleExports: ExportEntry[] = [
  {
    id: '1',
    name: 'Event Export - Q4 2024',
    type: 'CSV Export',
    status: 'completed',
    progress: 100,
    createdAt: '2024-01-15T10:30:00Z',
    createdBy: 'John Doe',
    totalRecords: 1250,
    processedRecords: 1250,
    downloadUrl: '/exports/events-q4-2024.csv'
  },
  {
    id: '2',
    name: 'User Data Export',
    type: 'Excel Export',
    status: 'processing',
    progress: 65,
    createdAt: '2024-01-15T14:20:00Z',
    createdBy: 'Jane Smith',
    totalRecords: 5000,
    processedRecords: 3250,
  },
  {
    id: '3',
    name: 'Analytics Export',
    type: 'JSON Export',
    status: 'failed',
    progress: 0,
    createdAt: '2024-01-14T09:15:00Z',
    createdBy: 'Mike Johnson',
    totalRecords: 890,
    processedRecords: 0,
  },
  {
    id: '4',
    name: 'Monthly Report',
    type: 'PDF Export',
    status: 'pending',
    progress: 0,
    createdAt: '2024-01-15T16:45:00Z',
    createdBy: 'Sarah Wilson',
    totalRecords: 320,
    processedRecords: 0,
  },
  {
    id: '5',
    name: 'Customer Database Backup',
    type: 'CSV Export',
    status: 'completed',
    progress: 100,
    createdAt: '2024-01-13T08:30:00Z',
    createdBy: 'Alex Chen',
    totalRecords: 8750,
    processedRecords: 8750,
    downloadUrl: '/exports/customer-backup.csv'
  },
  {
    id: '6',
    name: 'Product Inventory Report',
    type: 'Excel Export',
    status: 'processing',
    progress: 35,
    createdAt: '2024-01-15T11:20:00Z',
    createdBy: 'Maria Rodriguez',
    totalRecords: 2400,
    processedRecords: 840,
  },
  {
    id: '7',
    name: 'Sales Analytics Q1',
    type: 'PDF Export',
    status: 'completed',
    progress: 100,
    createdAt: '2024-01-12T15:45:00Z',
    createdBy: 'David Kim',
    totalRecords: 1650,
    processedRecords: 1650,
    downloadUrl: '/exports/sales-q1.pdf'
  },
  {
    id: '8',
    name: 'User Activity Logs',
    type: 'JSON Export',
    status: 'failed',
    progress: 0,
    createdAt: '2024-01-14T13:10:00Z',
    createdBy: 'Emily Davis',
    totalRecords: 12000,
    processedRecords: 0,
  },
  {
    id: '9',
    name: 'Financial Summary Report',
    type: 'Excel Export',
    status: 'pending',
    progress: 0,
    createdAt: '2024-01-15T17:30:00Z',
    createdBy: 'Robert Taylor',
    totalRecords: 950,
    processedRecords: 0,
  }
];

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

const ExportModal = ({ onClose, filterValue, type, source, active }: exportModalProps) => {
  console.log("active",active);
  
  const pathName = usePathname().split('/');
  const [activeTab, setActiveTab] = useState("CSV");
  const [showExportedFiles, setShowExportedFiles] = useState(false);
  const [exportList, setExportList] = useState<ExportContent[]>([]);
  const { theme } = useTheme();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isLoading,setIsLoading] = useState<boolean>(false);
  const iconClass = theme === "light" ? "icons_light" : "icon";
  const {membershipData, isTentimesUser} = useAuthContext();
  const [refreshState, setRefreshState] = useState<boolean>(false);
  const {getExportData, postExportReq} = useTrackerServices();
  const fetchData = async () => {
  try {
    setIsLoading(true);
    // setRefreshState(true);

    const data = await getExportData(`${pathName[pathName.length - 2]}`);
    console.log("exportData", data);

    setExportList(data.trackerExports || []);
  } catch (error) {
    console.error("Error fetching export data:", error);
  } finally {
    setIsLoading(false);
    // setRefreshState(false);
  }
};
  useEffect(() => {
    // if (showExportedFiles) {
      fetchData();
    // }
  }, []);

  const exportDataHandler = async () => {
    // if(type){
    //   const dataToSend={
    //       type:type,
    //   }
    //   const { data, error } = await postExportReq(`${pathName[pathName.length-2]}`, dataToSend);
    try {
    setIsLoading(true);
    // setRefreshState(true);
    const fullUrl = window.location.href
    const data = await postExportReq(pathName[pathName.length-2], active, fullUrl);
    console.log("exportData", data);
    toast({ title: "Success", description: data?.message })
    await fetchData();
  } catch (error) {
    toast({ title: "Error", description: error?.message })
    console.error("Error fetching export data:", error);
  } finally {
    setIsLoading(false);
    // setRefreshState(false);
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
 const handleUpgradeClick = () => {
    window.open(
      `https://whr.ai/pricing?utm_source=${isEventeli ? "geo" : "gtm"}&utm_campaign=pricing&utm_medium=web&utm_term=${source}_export`,
      "_blank"
    );
    GAEvent(
      "",
      "Plan Upgrade",
      `${source}`,
      `${isEventeli ? "geo" : "gtm"} | pricing | web | export`
    );
  };
  console.log("exportList", isTentimesUser);
  
  return (
    <div className={`${styles.container}`}>
      {!showExportedFiles && (
        <div
          className={`${styles.exportType_modal} ${
            theme === "light" && styles.exportType_modal_light
          } flex flex-col relative ${isMobile? "w-[390px]": "w-[440px]"}`}
        >
          <div className={styles.exportType_modal_header}>
            <div className={styles.exportType_modal_header_title}>
              Export
              {/* <span className="text-xs font-norma">
                Available only in the Advance plan.
                <Button
                        variant="outline"
                        size="sm"
                        className="hidden md:flex"
                        // onClick={handleUpgradeClick}
                      >
                        <span className="hidden sm:inline">Upgrade</span>
                      </Button>
              </span> */}
              
            </div>
            {((membershipData && ((membershipData.membership === MembershipPlan.Advance)||(membershipData.membership === MembershipPlan.Enterprise))) || (isTentimesUser)) &&
            <Button variant="outline" className="p-2 mr-12">
            <div className={`${styles.refresh_button} text-xs`} style={{color:"var(--secondary-text-color)"}} onClick={fetchData}>
                <Image
                  src={Refresh}
                  alt="refresh"
                  width={16}
                  height={24}
                  className={`${iconClass} ${refreshState ?styles.rotating: ''}`}
                />
                <div>refresh</div>
              </div>
            </Button>}
            {/* <Image
              src={CloseIcon}
              alt="closeicon"
              onClick={() => onClose()}
              className={styles.closeIcon}
            /> */}
            <Button variant="outline" className="px-3 py-2  absolute right-5">
            {/* <div className="absolute right-5"> */}
            <X onClick={() => onClose()} className={`${styles.closeIcon}`} width={16}/>
              {/* </div> */}
            </Button>
          </div>
          {/* <div className={styles.tabs_container}>
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
          </div> */}

          
          {((membershipData && ((membershipData.membership === MembershipPlan.Advance)||(membershipData.membership === MembershipPlan.Enterprise))) || (isTentimesUser)) ?
          <>
          <div className={styles.exportType_modal_description}>
             <div>
                    Large exports may take some time. Exports will run in the
                    background after you close this window and we will email you
                    when they are done.
              </div>
          </div>
          <ExportList  exports={sampleExports} data={exportList} isLoading={isLoading}/>
          <div
            className={`${styles.exportType_modal_button}`}
            onClick={exportDataHandler}
          >
            Export
          </div>
          </>
          :
          <div className="w-full pb-4 flex items-center justify-center gap-1">
             {/* <Badge variant="secondary" className="mx-auto">
            <Crown className="w-3 h-3 mr-1" />
            Advance Plan Feature
          </Badge> */}
          <span className="text-xs" style={{color:"var(--primary-color)"}}>Available only in the Advance and Above plan</span>
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex"
            onClick={handleUpgradeClick}
          >
            <span className="hidden sm:inline">Upgrade</span>
          </Button>
          </div>
          }
          
          {/* <div
            className={styles.exportType_modal_button2}
            onClick={()=>setShowExportedFiles(true)}
          >
            See previous exported files
          </div> */}
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
                {exportList.length>0 && 
                <span className={styles.exportedfiles_stats}>{exportList.length}</span>
                }
                
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
