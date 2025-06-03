"use client";

import CircularProgress from "../eventDetail/relevanceScoreCircularProgress";
import VideoModal from "@/components/layout/videoModal";
import { Badge } from "../ui/badge";

const TrackerRelevanceScore = () => {
  return (
    <div className={"gap-8 flex flex-col"}>
      <div className={"flex justify-between items-center"}>
        <div className="text-sm flex gap-2 items-center">
          Tracker Relevance Score
          <Badge
            variant={"outline"}
            className="rounded-full bg-[#fff0f0] text-[#e5484d] shadow-none border-none h-fit"
          >
            Demo
          </Badge>
        </div>
        {/* <Link className={styles.addTrackerBtn} href={'/internal/trackers'} >Add to Tracker</Link> */}
        <VideoModal source="intelScore" />
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
    </div>
  );
};
export default TrackerRelevanceScore;
