"use client";
import { useConfiguration } from "@/hooks/useConfiguration";
import StatusEnd from "@/app/components/internal/eventdetail/icons/statusEnd";
import StatusMid from "@/app/components/internal/eventdetail/icons/statusMid";
import StatusStart from "@/app/components/internal/eventdetail/icons/statusStart";
import { useCoordinateService } from "@/services/coordinateService";
import { useEffect, useState } from "react";

interface Props {
  eventId: string;
  enquiryId: string;
  enquiryStatus: string;
}

export const OutreachProgressBar = ({
  eventId,
  enquiryId,
  enquiryStatus,
}: Props) => {
  const { setEnquiryStatus } = useCoordinateService();
  const { outreachConfiguration, isLoading: isConfigLoading } =
    useConfiguration.outreach();
  const [currentStatus, setCurrentStatus] = useState(enquiryStatus);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleStatusChange = async (changeStatusTo: string) => {
    let payloadData = {
      enquiryId: enquiryId,
      enquiryStatus: changeStatusTo,
    };
    try {
      const apiData: any = await setEnquiryStatus(payloadData);

      if (apiData) {
        // GAEvent("Outreach", "Enquiry Detail", `Outreach | Enquiry Status Change`, `Change | ${initiator} | ${changeStatusTo}`);
        setCurrentStatus(changeStatusTo);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (!isConfigLoading)
      setCurrentIndex(
        outreachConfiguration?.outreach?.findIndex(
          (item: any) => item.status === currentStatus
        ) || 0
      );
  }, [currentStatus, outreachConfiguration]);

  return (
    <div className="flex justify-evenly rounded-md my-3 border p-3 px-5 gap-4 bg-accent">
      {outreachConfiguration?.outreach.map((item, index: number) => {
        const isActive = index <= currentIndex;

        if (item.status !== "PENDING" && item.status !== "REJECTED") {
          return (
            <div
              key={index}
              className="text-white cursor-pointer text-base relative text-center"
              onClick={() => handleStatusChange(item.status)}
            >
              {item.status === "SHORTLISTED" ? (
                <StatusStart
                  fillColor={
                    isActive
                      ? "var(--primary-color)"
                      : "var(--primary-foreground)"
                  }
                  borderColor={isActive ? "var(--primary-color)" : "#C9C9C9"}
                />
              ) : item.status === "IN_DISCUSSION" ||
                item.status === "IN_NEGOTIATION" ||
                item.status === "CONFIRMED" ? (
                <StatusMid
                  fillColor={
                    isActive
                      ? "var(--primary-color)"
                      : "var(--primary-foreground)"
                  }
                  borderColor={isActive ? "var(--primary-color)" : "#C9C9C9"}
                />
              ) : item.status === "CANCELLED" ? (
                <StatusEnd
                  fillColor={
                    isActive
                      ? "var(--primary-color)"
                      : "var(--primary-foreground)"
                  }
                  borderColor={isActive ? "var(--primary-color)" : "#C9C9C9"}
                />
              ) : (
                <></>
              )}

              {item.status !== "PENDING" && item.status !== "REJECTED" && (
                <div
                  className={`absolute top-0 h-full w-full flex items-center justify-center truncate text-xs md:text-sm ${
                    isActive ? "text-white" : "text-primary"
                  }`}
                >
                  {item.label}
                </div>
              )}
            </div>
          );
        }
      })}
    </div>
  );
};
