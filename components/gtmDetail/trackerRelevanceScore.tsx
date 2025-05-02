"use client";

import { useEventsService } from "@/services/eventsService";
import CircularProgress from "../eventDetail/relevanceScoreCircularProgress";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import Slider from "../slider";
import IntelSkeleton from "@/app/components/Skeleton/dashboardskeleton/IntelSkeleton";
interface TrackerRelevanceScoreProps {
  eventId: string;
}
const TrackerRelevanceScore = ({ eventId }: TrackerRelevanceScoreProps) => {
  const {getEventIntelScore} = useEventsService();
  const [intelData, setIntelData] = useState<any>(null);
  const [isLoading, setIsLoading]= useState(true);
  const data=[
      {
        people_score: 90,
        purpose_score: 80,
        prospect_score: 70,
        alltrackers_score: 50,
      },
    ]
  
  useEffect(() => {  
    // const fetchIntelScore = async () => {
    //   try {
    //     const data = await getEventIntelScore(eventId);
    //     if(data){
    //     console.log(data);
    //     setIntelData(data);
    //     setIsLoading(false);
    //     }
    //   } catch (error) {
    //     console.error('Failed to fetch event intel score:', error);
    //   }
    // };
  
    // fetchIntelScore();
    setInterval(() => {
      setIntelData(data);
      setIsLoading(false);
    }, 2000);
  },[])
  
  return (
    <div className={"gap-8 flex flex-col"}>
      <div className={"flex justify-between items-center"}>
        <span style={{ fontSize: "var(--font-size-default)" }}>
          Tracker Relevance Score
        </span>
        {/* <Link className={styles.addTrackerBtn} href={'/internal/trackers'} >Add to Tracker</Link> */}
        <Badge
          variant={"outline"}
          className="rounded-full bg-[#fff0f0] text-[#e5484d] shadow-none border-none h-fit"
        >
          Demo
        </Badge>
      </div>
      <>
      {isLoading ? <IntelSkeleton /> : 
      <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress percentages={[intelData?.[0]?.people_score ?? 0, intelData?.[0]?.purpose_score ?? 0, intelData?.[0]?.prospect_score ?? 0]} relevanceScore={intelData?.[0]?.alltrackers_score} />
      </div>

      <div style={{ display: "flex", gap: "6px" }}>
        <div style={{ width: "100%" }}>
          <div style={{ fontSize: "var(--font-size-large)" }}>{intelData?.[0]?.people_score ?? "--"}</div>
          <div
            style={{
              fontSize: "var(--font-size-default)",
              padding: "4px 0",
              color: "#646BDC",
            }}
          >
            People
          </div>
          <Slider width={intelData?.[0]?.people_score ?? 0} color="#646BDC"/>
          {/* <div
            style={{
              height: "13px",
              background: "#646BDC",
              borderRadius: "4px",
            }}
          ></div> */}
        </div>
        <div style={{ width: "100%" }}>
          <div style={{ fontSize: "var(--font-size-large)" }}>{intelData?.[0]?.purpose_score ?? "--"}</div>
          <div
            style={{
              fontSize: "var(--font-size-default)",
              padding: "4px 0",
              color: "#E99CD4",
            }}
          >
            Purpose
          </div>
          <Slider width={intelData?.[0]?.purpose_score ?? "--"} color="#E99CD4"/>
          {/* <div
            style={{
              height: "13px",
              background: "#E99CD4",
              borderRadius: "4px",
            }}
          ></div> */}
        </div>
        <div style={{ width: "100%" }}>
          <div style={{ fontSize: "var(--font-size-large)" }}>{intelData?.[0]?.prospect_score ?? "-"}</div>
          <div
            style={{
              fontSize: "var(--font-size-default)",
              padding: "4px 0",
              color: "#9B86D4",
            }}
          >
            Prospect
          </div>
          <Slider width={intelData?.[0]?.prospect_score ?? 0} color="#9B86D4"/>
          {/* <div
            style={{
              height: "13px",
              background: "#9B86D4",
              borderRadius: "4px",
            }}
          ></div> */}
        </div>
      </div>
      </>}
      </>
    </div>
  );
};
export default TrackerRelevanceScore;
