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
import { ExportContent } from '@/types/trackers';
import { usePathname } from 'next/navigation';
import { GAEvent } from "@/utils/GAEvent";
import { Button } from "@/components/ui/button";
import { Crown, X } from "lucide-react";
import { isEventeli } from "@/config";
import { MembershipPlan } from "@/data/membershipPlans";
import { useTrackerServices } from "@/services/trackerServices";
import ExportList from "./exportList";
import { useToast } from "@/hooks/use-toast";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { InformationFill } from "geist-icons";
import PremiumModal from "@/components/premium-modal";
interface exportModalProps {
  onClose: () => void;
  filterValue?: any;
  type?:string|undefined;
  source:string;
  active?:string;
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
  
  const pathName = usePathname().split('/');
  const [activeTab, setActiveTab] = useState("CSV");
  const [showExportedFiles, setShowExportedFiles] = useState(false);
  const [exportList, setExportList] = useState<ExportContent[]>([]);
  const { theme } = useTheme();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [isLoading,setIsLoading] = useState<boolean>(false);
  const iconClass = theme === "light" ? "icons_light" : "icon";
  const {membershipData, isTentimesUser} = useAuthContext();
  const [refreshState, setRefreshState] = useState<boolean>(false);
  const {getExportData, postExportReq} = useTrackerServices();
  const [isPremiumModalOpen, setPremiumModalOpen] = React.useState(false);
  const isAdvancedPlanOrAbove = !!membershipData && membershipData.membership != null && membershipData.membership >= MembershipPlan.Advance;
  const fetchData = async () => {
  try {
    setIsLoading(true);
    // setRefreshState(true);

    const data = await getExportData(`${pathName[pathName.length - 2]}`);
    // console.log("exportData", data);

    setExportList(data?.trackerExports || []);
  } catch (error) {
    // console.error("Error fetching export data:", error);
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
    try {
    setIsLoading(true);
    // setRefreshState(true);
    const fullUrl = window.location.href
    const data = await postExportReq(pathName[pathName.length-2], active || "", fullUrl) as { message: string };
    setIsFetched(true);
    toast({ title: "Success", description: data?.message })
    await fetchData();
  } catch (error : any) {
    toast({ title: "Error", description: error?.message })
    // console.error("Error fetching export data:", error);
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
            </div>
            {/* <Image
              src={CloseIcon}
              alt="closeicon"
              onClick={() => onClose()}
              className={styles.closeIcon}
            /> */}
            <button onClick={() => onClose()} className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            {/* <div className="absolute right-5"> */}
            <X className={`${styles.closeIcon}`} width={16}/>
              {/* </div> */}
            </button>
          </div>

          
          {(isTentimesUser) ?
          <>
          <div className={styles.exportType_modal_description}>
             <div>
                    Large exports may take some time. Exports will run in the
                    background after you close this window and we will email you
                    when they are done.
              </div>
          </div>
          {((membershipData && ((membershipData.membership === MembershipPlan.Advance)||(membershipData.membership === MembershipPlan.Enterprise))) || (isTentimesUser)) &&
          <div className="flex justify-end w-full mb-3">
            <Button variant="outline" className="p-2 mr-6">
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
            </Button>
            </div>
            }
          <ExportList  data={exportList} isLoading={isLoading}/>
          <Button 
            variant="outline"
            disabled={isFetched}
            className={`mx-5 mb-5 bg-[var(--primary-color)] text-white hover:text-white hover:bg-[var(--primary-color)]`}
            onClick={exportDataHandler}
          >
            Export
          </Button>
          </>
          : isAdvancedPlanOrAbove?
              <div className={`p-5 pt-0 ${styles.exportType_modal_description}`}>
                We're working on adding this option directly to the panel. In the meantime, just drop us an email at {" "}
                <span className="text-primary hover:underline cursor-pointer" onClick={() => window.open("mailto:help@whr.ai", "_blank")}>help@whr.ai</span>
                {" "}with your tracker details, and we'll send you the export within 24 working hours.
              </div>
          :
          <div className="w-full pb-4 flex items-center justify-center gap-1">
             {/* <Badge variant="secondary" className="mx-auto">
            <Crown className="w-3 h-3 mr-1" />
            Advance Plan Feature
          </Badge> */}
          <span className="text-xs flex items-center" style={{color:"var(--primary-color)"}}>
            <InformationFill style={{marginBottom: "3px"}} color="var(--primary-color)" height="12px" />
            Available only in the Advance &amp; above plan</span>
            {!isAdvancedPlanOrAbove && <RainbowButton
              size="sm"
              className="hidden sm:inline ml-2 h-6 rounded-sm"
              onClick={(e) => {
                e.stopPropagation();
                setPremiumModalOpen(true);
              }}
            >
              Premium
            </RainbowButton>}
            </div>
          }
        </div>
      )}
      <PremiumModal open={isPremiumModalOpen} onOpenChange={setPremiumModalOpen} />
    </div>
    
  );
};

export default ExportModal;
