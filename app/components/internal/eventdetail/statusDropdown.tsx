import styles from "./statusDropdown.style.module.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCoordinateService } from "@/services/coordinateService";
import { showToast } from "@/utils/showToast";
import { GAEvent } from "@/utils/GAEvent";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown, Clock5 } from "lucide-react";
interface PropType {
  label: string;
  eventId: string;
  enquiryId: string;
  currentEnquiryStatus: string;
  handleShortlistModal?: (eventId: string, enquiryId: string) => void;
  setSelectedId: any;
  pipelineConfig: any;
  enquiryStatusUpdate: (eventId: string, status: string) => void;
}

const StatusChangeDropdown: React.FC<PropType> = (props: PropType) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState<boolean>(false);

  const [value, setValue] = useState("");

  const coordinateService = useCoordinateService();

  const statusLabel = props.pipelineConfig?.filter(
    (item: any) => item.status === props.currentEnquiryStatus
  )?.[0]?.label;

  const openDropDownHandler = () => {
    if (
      ["PENDING", props.pipelineConfig?.[1]?.status, "REJECTED"].includes(
        props?.currentEnquiryStatus
      )
    )
      setShowStatusDropdown((prev) => !prev);
    else showToast("error", "Status already updated");
    return;
  };
  useEffect(() => {
    if (props?.currentEnquiryStatus) setValue(statusLabel);
  }, [props.currentEnquiryStatus]);
  const handleMenuItemClick = () => {
    if (props.handleShortlistModal && props.eventId && props.enquiryId) {
      props.handleShortlistModal(props.eventId, props.enquiryId);
      props.setSelectedId(props.eventId);
    }
  };

  const handleRejectClick = async () => {
    let payloadData = {
      enquiryId: props.enquiryId,
      enquiryStatus: "REJECTED",
    };
    try {
      const apiData = await coordinateService.setEnquiryStatus(payloadData);
      if (apiData) {
        GAEvent(
          "Coordinate",
          "Enquiry Detail",
          "Coordinate | Enquiry Status Change",
          `Change | REJECTED`
        );
        toast.error(
          <div>
            Status updated!{" "}
            <span
              className={styles["reject-undo-btn"]}
              onClick={() => handleUndoClick()}
            >
              UNDO
            </span>
          </div>,
          {
            position: "bottom-right",
            autoClose: 3000,
            closeButton: false,
            hideProgressBar: true,
          }
        );
        props.enquiryStatusUpdate(props.eventId, "REJECTED");
        // setValue('Rejected');
        // setIsOpen(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUndoClick = async () => {
    let payloadData = {
      enquiryId: props.enquiryId,
      enquiryStatus: props.currentEnquiryStatus,
    };
    try {
      const apiData = await coordinateService.setEnquiryStatus(payloadData);
      setValue(statusLabel);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Popover open={showStatusDropdown} onOpenChange={openDropDownHandler}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="border px-3 gap-1.5 text-[var(--info-text-color)] hover:text-[var(--info-text-color)] bg-[var(--info-background-color)]"
        >
          <Clock5 color="var(--info-text-color)" className="h-4 w-4" />
          {value}
          <ChevronDown color="var(--info-text-color)" className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-2">
        <div className="flex flex-col space-y-1">
          <Button
            variant={"ghost"}
            className="justify-between flex items-center gap-2"
            onClick={handleMenuItemClick}
          >
            <span>
              {props?.pipelineConfig?.[1]?.label
                ? props?.pipelineConfig?.[1]?.label
                : "Shortlist"}
            </span>
          </Button>

          <Button
            variant={"ghost"}
            className="justify-between flex items-center gap-2"
            onClick={handleRejectClick}
          >
            <span>Reject</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default StatusChangeDropdown;
