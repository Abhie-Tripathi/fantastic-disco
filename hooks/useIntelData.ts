// hooks/useIntelData.ts
import { isEventeli } from "@/config";
import { useTrackerServices } from "@/services/trackerServices";
import { useEffect, useState } from "react";

export const useIntelData = (trackerId: string | null, events: any[], eventType: string | null) => {
  console.log("eventType", eventType);
  
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

      fetchIntelData();
    }
  }, [events, trackerId]);

  return {
    intelScoreData,
    loading,
    error,
  };
};
