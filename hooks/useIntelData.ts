// hooks/useIntelData.ts
import { isEventeli } from "@/config";
import { useAuthContext } from "@/context/auth";
import { useFilterContext } from "@/context/filterContext";
import { useTrackerServices } from "@/services/trackerServices";
import { useEffect, useState } from "react";

export const useIntelData = (trackerId: string | null, events: any[], eventType: string | null, trackerType?:string) => {
  const {isTentimesUser} = useAuthContext();
  const [intelScoreData, setIntelScoreData] = useState<any>(null);
  const {getIntelData} = useTrackerServices();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  
  useEffect(() => {
    if (events?.length > 0 && !isEventeli) {
      const fetchIntelData = async () => {
        try {
          setLoading(true);
          const eventIds = events.map((event) => event.basic.id).join(",");
          const response = await getIntelData(trackerId || "", eventIds, eventType||"");
          setIntelScoreData(response);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
      if(isTentimesUser && trackerId && trackerId.length > 0 && trackerType!=="T_EVENT_PARTICIPATION" && trackerType!=="T_CUSTOM")
      fetchIntelData();
    }
  }, [events, trackerId]);

  return {
    intelScoreData,
    loading,
    error,
  };
};
