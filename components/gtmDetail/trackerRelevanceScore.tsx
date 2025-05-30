"use client";

import { useEventsService } from "@/services/eventsService";
import CircularProgress from "../eventDetail/relevanceScoreCircularProgress";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import Slider from "../slider";
import IntelSkeleton from "@/app/components/Skeleton/dashboardskeleton/IntelSkeleton";
import { useTrackerServices } from "@/services/trackerServices";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAuthContext } from "@/context";
interface TrackerRelevanceScoreProps {
  eventId: string;
}
const TrackerRelevanceScore = ({ eventId }: TrackerRelevanceScoreProps) => {
  const {getEventIntelScore} = useEventsService();
  const {getTrackers} = useTrackerServices();
  const {isTentimesUser} = useAuthContext();
  const [intelData, setIntelData] = useState<any>(null);
  const [isLoading, setIsLoading]= useState(true);
  const [isData, setIsData] = useState(false);
  const data=[
      {
        people_score: 90,
        purpose_score: 80,
        prospect_score: 70,
        alltrackers_score: 50,
      },
    ]
  
  useEffect(() => {  
    const fetchIntelScore = async () => {
  try {
    const data = await getEventIntelScore(eventId);
    if (data?.intelScore) {
      const firstIntel = Object.values(data.intelScore)[0];
      setIntelData(firstIntel);
      setIsLoading(false);
    }
  } catch (error) {
    console.error("Failed to fetch event intel score:", error);
  }
};
     const fetchData = async () => {
      const data = await getTrackers(`offset=0&limit=0&type=trackers`);

      if (data) setIsLoading(false);
      if (data?.count) {
        // setHideTemplate(false);
        setIsData(true);
      }
    };

    fetchData();
  
    fetchIntelScore();
    
    // setInterval(() => {
    //   setIntelData(data);
    //   setIsLoading(false);
    // }, 2000);
  },[])
  
  return (
    <>
    {isTentimesUser?
      <div className={"gap-8 flex flex-col h-full justify-between"}>
      <div className={"flex justify-between items-center"}>
        <span className="text-[1rem] mb-2 font-medium">
          Relevance Score
        </span>
        {/* <Link className={styles.addTrackerBtn} href={'/internal/trackers'} >Add to Tracker</Link> */}
        {/* <Badge
          variant={"outline"}
          className="rounded-full bg-[#fff0f0] text-[#e5484d] shadow-none border-none h-fit"
        >
          Demo
        </Badge> */}
      </div>
     <>
  {isLoading ? (
    <IntelSkeleton />
  ) : !isData ? (
    <div className="flex flex-col items-center justify-center h-full gap-2">
      <div className="font-bold">Hello! Here’s your quick-start guide:</div>
      <div className={`w-full text-[#666666] text-sm text-center`}>Set up your tracker, and we’ll surface your most relevant insights.</div>
      <Link href="/internal/trackers?tab=allTrackers">
      <Button className="text-white">Create</Button>
      </Link>
    </div>
  ) : (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress 
          percentages={[
            intelData?.people_score ?? 0, 
            intelData?.purpose_score ?? 0, 
            intelData?.prospect_score ?? 0
          ]} 
          relevanceScore={intelData?.alltrackers_score} 
        />
      </div>

      <div style={{ display: "flex", gap: "6px" }}>
        <div style={{ width: "100%" }}>
          <div style={{ fontSize: "var(--font-size-large)" }}>
            {intelData?.people_score ?? "--"}
          </div>
          <div style={{
            fontSize: "var(--font-size-default)",
            padding: "4px 0",
            color: "#646BDC",
          }}>
            People
          </div>
          <Slider width={intelData?.people_score ?? 0} color="#646BDC" />
        </div>

        <div style={{ width: "100%" }}>
          <div style={{ fontSize: "var(--font-size-large)" }}>
            {intelData?.purpose_score ?? "--"}
          </div>
          <div style={{
            fontSize: "var(--font-size-default)",
            padding: "4px 0",
            color: "#E99CD4",
          }}>
            Purpose
          </div>
          <Slider width={intelData?.purpose_score ?? 0} color="#E99CD4" />
        </div>

        <div style={{ width: "100%" }}>
          <div style={{ fontSize: "var(--font-size-large)" }}>
            {intelData?.prospect_score ?? "--"}
          </div>
          <div style={{
            fontSize: "var(--font-size-default)",
            padding: "4px 0",
            color: "#9B86D4",
          }}>
            Prospect
          </div>
          <Slider width={intelData?.prospect_score ?? 0} color="#9B86D4" />
        </div>
      </div>
    </>
  )}
</>
    </div>
      : <div className={"gap-8 flex flex-col"}>
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
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress percentages={[80, 50, 70]} relevanceScore={"89"} />
      </div>

      <div style={{ display: "flex", gap: "6px" }}>
        <div style={{ width: "100%" }}>
          <div style={{ fontSize: "var(--font-size-large)" }}>80</div>
          <div
            style={{
              fontSize: "var(--font-size-default)",
              padding: "4px 0",
              color: "#646BDC",
            }}
          >
            People
          </div>
          <div
            style={{
              height: "13px",
              background: "#646BDC",
              borderRadius: "4px",
            }}
          ></div>
        </div>
        <div style={{ width: "100%" }}>
          <div style={{ fontSize: "var(--font-size-large)" }}>50</div>
          <div
            style={{
              fontSize: "var(--font-size-default)",
              padding: "4px 0",
              color: "#E99CD4",
            }}
          >
            Purpose
          </div>
          <div
            style={{
              height: "13px",
              background: "#E99CD4",
              borderRadius: "4px",
            }}
          ></div>
        </div>
        <div style={{ width: "100%" }}>
          <div style={{ fontSize: "var(--font-size-large)" }}>70</div>
          <div
            style={{
              fontSize: "var(--font-size-default)",
              padding: "4px 0",
              color: "#9B86D4",
            }}
          >
            Prospect
          </div>
          <div
            style={{
              height: "13px",
              background: "#9B86D4",
              borderRadius: "4px",
            }}
          ></div>
        </div>
      </div>
    </div>} 
  </>
  );
};
export default TrackerRelevanceScore;
