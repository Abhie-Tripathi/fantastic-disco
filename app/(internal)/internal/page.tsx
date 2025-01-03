"use client";
import CoordinateContainer from "@/app/components/internal/Dashboard/Coordinate/CoordinateContainer";
import ManageTeam from "@/app/components/internal/Dashboard/ManageTeam";
import ModuleSelection from "@/app/components/internal/Dashboard/Landing/ModuleSelection";
import RecentActivity from "@/app/components/internal/Dashboard/Recentactivity/RecentActivity";
import React, { useEffect, useRef, useState } from "react";
import Research from "@/app/components/internal/Dashboard/Research/Research";
import Prospect from "@/app/components/internal/Dashboard/Prospect";
import PromoteContainer from "@/app/components/internal/Dashboard/Promote/PromoteContainer";
import TrackerContainer from "@/app/components/internal/Dashboard/Tracker/TrackerContainer";
import Outreach from "@/app/components/internal/Dashboard/Outreach/Outreach";
import Trends from "@/app/components/internal/Dashboard/Trends/Trends";
import { useTheme } from "@/context";
import { useCoordinateService } from "@/services/coordinateService";
import { useWidgetServices } from "@/services/geniservices/widgetService";
import { useEventServices } from "@/services/geniservices/eventService";
import { useTrackerServices } from "@/services/trackerServices";
const Dashboard = () => {

  let role = "user"
  let value = "filled"
  let outreach = role === "sa"
  let prospect = true
  let trends = true

  const [coordinateData, setCoordinateData] = useState<{ heading: string, value: number }[]>([])
  const [promoteData, setPromoteData] = useState<{ name: string, value: number }[]>([])
  const [trackerData, setTrackerData] = useState<any>()


  const { theme } = useTheme()
  const { getParticipentCount } = useCoordinateService()
  const { getActiveWidget, getOnlyDraftWidget } = useWidgetServices()
  const {getUpcomingEvents} = useEventServices()
  const {getTrackers} = useTrackerServices()

  const fetchCoordinateData = async () => {
    const data: any = await getParticipentCount()
    const formattedData = data.filter((item: any) => item.name !== undefined && item.count !== undefined)
      .map((item: any) => ({
        heading: item.name,
        value: item.count,
      }));

    setCoordinateData(formattedData);
  }

  const fetchPromoteData = async () => {
    const activeData: any = await getActiveWidget()
    const draftData: any = await getOnlyDraftWidget()
    const eventData : any = await getUpcomingEvents(0)

    const formattedData = [
      { name: "Widgets", value: activeData.totalCount },
      { name: "Drafts", value: draftData.totalCount },
    ];
    setPromoteData(formattedData)
  }
  
  const fetchTrackerData = async()=>{
    const trackerData : any =  await getTrackers(`limit=4&offset=0`)
    console.log("tracker data ,", trackerData.trackerData)
  }

  useEffect(() => {
    fetchCoordinateData()
    fetchPromoteData()
    fetchTrackerData()
  }, [])

  return (
    <div className="flex p-3 min-h-[91vh] max-h-[91vh] gap-3">
      <div className="flex-1">
        {(role === "sa" && value === "empty") ? <ModuleSelection theme={theme} value="admin" /> :
          (role === "user" && value === "empty") ? <ModuleSelection theme={theme} value="user" /> :
            value === "filled" ?
              <div className="flex flex-col gap-3">
                <Research theme={theme} />
                <div className="flex gap-3 mb-2">
                  <div className="flex flex-col gap-3 w-[55%]">
                    <div className="w-full flex gap-3">
                      <div className={(outreach && trends) ? "w-[50%]" : "w-full"}>
                        <TrackerContainer width={(outreach && trends) ? "smaller" : "large"} />
                      </div>
                      {(trends && role === "sa") && <div className="w-[50%]">
                        <Trends container="small" />
                      </div>}
                    </div>
                    {(outreach && role === "sa") && <div><Outreach theme={theme} /> </div>}
                  </div>

                  <div className="flex flex-col gap-3 w-[45%]">
                    {(role === "user" && trends) && <div><Trends container="large" /></div>}
                    <div className="w-full">
                      <CoordinateContainer
                        theme={theme}
                        // height={role === "sa" ? "small" : "large"}
                        coordinateData={coordinateData}
                        height="small"
                      />
                    </div>
                    {role === "sa" && <div className="flex gap-3">
                      <div className={prospect ? "w-[50%]" : "w-full"}>
                        <PromoteContainer promoteData={promoteData} theme={theme} width={prospect ? "small" : "large"} />
                      </div>
                      {prospect && <div className="w-[50%]">
                        <Prospect theme={theme} />
                      </div>}

                    </div>}
                  </div>
                </div>
              </div> : <></>
        }
        {/* <ModuleSelection value="admin" /> */}
        {/* <ModuleSelection value="user" /> */}
        {/* <Research /> */}
        {/* <CoordinateContainer height="small"/> */}
        {/* <CoordinateContainer height="large"/> */}
        {/* <Prospect/> */}
        {/* <PromoteContainer width="large"/> */}
        {/* <PromoteContainer width="small"/> */}
        {/* <TrackerContainer width="smaller"/> */}
        {/* <Outreach/> */}
        {/* <Trends container="large"/> */}
      </div>
      <div className="flex flex-col min-w-[20%] gap-3">
        <RecentActivity />
        <ManageTeam />
      </div>
    </div>
  );
};

export default Dashboard;

