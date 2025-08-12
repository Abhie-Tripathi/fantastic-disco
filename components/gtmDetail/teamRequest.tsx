"use client";
import { useEffect, useState } from "react";
import { useCoordinateService } from "@/services/coordinateService";
import { useConfiguration } from "@/hooks/useConfiguration";
import AttendeeCard from "@/app/components/internal/eventdetail/AttendeeCard";

interface Props {
  eventId: string;
  enquiryId: string;
}

export const TeamRequest = ({ eventId, enquiryId }: Props) => {
  const coordinateService = useCoordinateService();
  const [participentData, setParticipentData] = useState<any>();
  const { interestConfiguration } = useConfiguration.interest();

  useEffect(() => {
    const fetchInterestData = async () => {
      const data: any = await coordinateService.getInterestedUsers(
        eventId,
        enquiryId
      );
      if (data) {
        setParticipentData(data.interestedUsers);
        console.log("Participent Data:", data.interestedUsers);
      }
    };
    fetchInterestData();
  }, [eventId]);
  return (
    <div className={`flex flex-col gap-6`}>
      {interestConfiguration?.interest.map(
        (item: any) =>
          participentData &&
          participentData?.filter(
            (users: any) => users.interest === item.status
          ).length > 0 && (
            <AttendeeCard
              key={item.status}
              cardType={item.label}
              userList={participentData.filter(
                (users: any) => users.interest === item.status
              )}
            />
          )
      )}
    </div>
  );
};
