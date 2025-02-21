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
import { useAuthContext, useTheme } from "@/context";
import { useCoordinateService } from "@/services/coordinateService";
import { useWidgetServices } from "@/services/geniservices/widgetService";
import { useEventServices } from "@/services/geniservices/eventService";
import { useTrackerServices } from "@/services/trackerServices";
import { useEventsService } from "@/services/eventsService";
import { useProfileServices } from "@/services/profileService";
import { useFilterContext } from '@/context/filterContext';
import Pricing from "@/app/components/internal/Dashboard/Pricing";
import Loading from "@/components/ui/Loading";
import { useDefaultFilters } from "@/hooks/useDefaultFilters";

interface TrackerData {
  id: string;
  location: string[]
  name: string;
  newCount: number;
  expiredCount: number;
  activeCount: number;
  type: string;
}
interface OutreachLastChat {
  eventName: string;
  status: string;
  comment: string;
  eventId: string;
  enquiryId: string;
  enquiryStatus : string;
}

interface ProfileData {
  name: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
  department: string;
}
const Dashboard = () => {
  console.log("Dashboard");

  let role = "sa"
  let outreach = role === "sa"
  let prospect = true
  let trends = true
  const { searchParams } = useDefaultFilters();
  const [coordinateData, setCoordinateData] = useState<{ heading: string, value: number }[]>([])
  const [promoteData, setPromoteData] = useState<{ name: string, value: number }[]>([])
  const [trackerData, setTrackerData] = useState<TrackerData[]>([])
  const [outreachData, setOutreachData] = useState<{ name: string, value: number }[]>([])
  const [outreachChat, setOutreachChat] = useState<OutreachLastChat>({ eventName: "", status: "", comment: "", eventId: "", enquiryId: "", enquiryStatus : "" })
  const [value, setValue] = useState<string>("empty")
  const [profileData, setProfileData] = useState<ProfileData>({ name: "", email: "", phoneNumber: "", profilePicture: "", department: "" })
  const [loading, setLoading] = useState<boolean>(true);

  const { theme } = useTheme()
  const { getParticipentCount, getPipelineConfig, getOutreachSingleEvent, getLatestComment, getInterestConfig, getEnquiryStatusCount } = useCoordinateService()
  const { getActiveWidget, getOnlyDraftWidget } = useWidgetServices()
  const { getUpcomingEvents } = useEventServices()
  const { getRecentSearch } = useEventsService()
  const { getTrackers } = useTrackerServices()
  const { getMyProfileData } = useProfileServices()
  const { setLocalFilter } = useFilterContext();
  const { user } = useAuthContext()
   
  const fetchCoordinateData = async () => {
    const apiData: any = await getInterestConfig();
    const coordinateActions =  apiData?.interest?.slice(1);
    const data: any = await getParticipentCount()
    const formattedData = coordinateActions.map((item: any) => {
      const statusKey = item.status.toLowerCase();
      return { value: data?.count[statusKey], heading: item.label };
    });
    setCoordinateData(formattedData);
  }

  const fetchPromoteData = async () => {
    const activeData: any = await getActiveWidget()
    const draftData: any = await getOnlyDraftWidget()
    const eventData: any = await getUpcomingEvents(0)

    const formattedData = [
      { name: "Widgets", value: activeData.totalCount },
      { name: "Drafts", value: draftData.totalCount },
      { name: "Events", value: eventData?.totalCount || 0 },
    ];
    setPromoteData(formattedData)
  }

  const fetchTrackerData = async () => {
    const trackerData: any = await getTrackers(`limit=4&offset=0&refresh=true`)
    const fetchedTrackers: TrackerData[] = [];
    trackerData.trackers.map((tracker: any, key: any) => {
      const locations = Object.values(tracker.filterValues?.locationIds).map((item: any) => item.displayName);
      const value: TrackerData = { id: tracker.id, name: tracker.name, newCount: tracker.groupedEventsCount.new, activeCount: tracker.groupedEventsCount.active, expiredCount: tracker.groupedEventsCount.past, location: locations, type: tracker.type }
      fetchedTrackers.push(value)
    })
    setTrackerData(fetchedTrackers)
  }
  // useEffect(()=>{
  //   console.log("tracker data," , trackerData)
  // },[trackerData])

  // This function is to fetch the whole array
  const fetchOutreachData = async () => {
    const apiData: any = await getPipelineConfig();
    const outreachStages =  apiData?.outreach.slice(1, apiData.outreach.length - 1);
    const data: any = await getEnquiryStatusCount();
    const formattedData = outreachStages.map((item: any) => {
      const statusKey = item.status.toLowerCase();
      return { value: data?.count[statusKey], name: item.label };
    });    
    setOutreachData(formattedData);
  }

  const fetchOutreachMessage = async () => {
    const data = await getLatestComment()
    const messageData: OutreachLastChat =
      { eventName: data.event.name, status: data.enquiry.enquiryStatusLabel, comment: data.comment.content, eventId: data.event.id, enquiryId: data.enquiry.enquiryId, enquiryStatus : data.enquiry.enquiryStatus}
    setOutreachChat(messageData)
  }

  // const fetchRecentSearch = async () => {
  //   const data: any = await getRecentSearch();
  //   if (data.length > 0) {
  //     const recentSearch = data[0];
  //     // Handle eventType: Convert to comma-separated string with transformations
  //     const eventType = recentSearch.eventType
  //       ? recentSearch.eventType.map((type: string) => {
  //         if (type === "Tradeshow") return "tradeshows";
  //         if (type === "Conference") return "conferences";
  //         if (type === "Workshop") return "workshops";
  //         return type; // Fallback for unexpected types
  //       }).join(",")
  //       : "";
  //     const startDate = recentSearch.startDate || "";
  //     const locationIds = recentSearch.locationIds || {};
  //     const cityIds = locationIds.city
  //       ? locationIds.city.map((c: any) => Object.keys(c)).flat().join(", ")
  //       : "";
  //     const stateIds = locationIds.state
  //       ? locationIds.state.map((s: any) => Object.keys(s)).flat().join(", ")
  //       : "";
  //     const countryIds = locationIds.country
  //       ? locationIds.country.map((c: any) => Object.keys(c)).flat().join(", ")
  //       : "";
  //     // Combine location IDs
  //     const combinedLocationIds = [cityIds, stateIds, countryIds].filter(loc => loc).join(",");

  //     // console.log("combined locations : ", combinedLocationIds)
  //     if (combinedLocationIds) {
  //       setLocalFilter("locationIds", combinedLocationIds)
  //     } else setLocalFilter("locationIds", "e3ef02ad-2f97-5fa6-9033-9addfad3f0ef")

  //     setLocalFilter("eventTypes", eventType)
  //     setLocalFilter("active_gte", startDate.split(",")[0])
  //     setLocalFilter("active_lte", startDate.split(",")[1])
  //   }
  //   else setLocalFilter("locationIds", "e3ef02ad-2f97-5fa6-9033-9addfad3f0ef")
  // }

  const fetchProfileData = async () => {
    const data: any = await getMyProfileData();
    const profileObject: ProfileData =
      { name: data.firstname ? data.firstname : data.email.split('@')[0], email: data.email, phoneNumber: data.phoneNumber, profilePicture: data.profilePicture, department: data.department }
    setProfileData(profileObject)
    // console.log("user", user)
  }
  useEffect(() => {
    const fetchData = async () => {
      // Call all fetch functions in parallel
      await Promise.all([
        // fetchRecentSearch(),
        fetchTrackerData(),
        fetchCoordinateData(),
        fetchOutreachData(),
        fetchOutreachMessage(),
        fetchPromoteData(),
        fetchProfileData()
      ]);
    };

    fetchData();
  }, []);

  const isCoordinateEmpty = (coordinateData: { heading: string; value: number }[]) => {
    return !coordinateData.some(item => item.value > 0);
  };

  const isPromoteEmpty = (promoteData: { name: string; value: number }[]) => {
    return !promoteData.some(item => item.value > 0);
  };

  const isOutreachEmpty = (outreachData: { name: string; value: number }[]) => {
    return !outreachData.some(item => item.value > 0);
  };

  useEffect(() => {
    // Simulate a delay for loading state (optional)
    const timer = setTimeout(() => {
      // Check if any state has meaningful data
      if (
        !isCoordinateEmpty(coordinateData) ||
        !isPromoteEmpty(promoteData) ||
        trackerData.length > 0 ||
        !isOutreachEmpty(outreachData)
      ) {
        setValue("filled");
      } else {
        setValue("empty");
      }
      setLoading(false); // Set loading to false after the computation
    }, 500); // Adjust delay if needed

    return () => clearTimeout(timer); // Cleanup timeout on component unmount
  }, [coordinateData, promoteData, trackerData, outreachData]);

  return (
    <div className="flex p-3 min-h-[91vh] max-h-[91vh] gap-3 max-[1010px]:max-h-none max-[1010px]:h-[100%]">
      {loading ?
        <div className="flex justify-center items-center h-full absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
          <Loading />
        </div> :
        <>
          <div className="flex-1">
            {(role === "sa" && value === "empty") ? <div className="h-full max-[1010px]:h-fit"><ModuleSelection theme={theme} value="admin" /></div> :
              (role === "user" && value === "empty") ? <ModuleSelection theme={theme} value="user" /> :
                value === "filled" ?
                  <div className="flex flex-col gap-3">
                    <Research theme={theme} />
                    <div className="flex flex-col gap-3 mb-2">
                      <div className="w-full flex gap-3 max-[1100px]:flex-col">
                        <div className="w-[50%] flex gap-3 max-[1100px]:w-full max-[885px]:flex-col">
                          <div className="w-full hidden max-[885px]:block max-[600px]:hidden">
                            <TrackerContainer trackers={trackerData} width="small" />
                          </div>
                          <div className="w-full hidden max-[600px]:block">
                            <TrackerContainer trackers={trackerData} width="smaller" />
                          </div>
                          <div className={`${(outreach && trends) ? "w-[50%]" : "w-full"} max-[885px]:hidden`}>
                            <TrackerContainer trackers={trackerData} width={(role === "sa") ? "smaller" : "large"} />
                          </div>
                          {(trends && role === "sa") && <div className="w-[50%] max-[885px]:w-full">
                            <Trends container="small" />
                          </div>}
                        </div>
                        <div className="w-[50%] max-[1100px]:w-full">
                          <CoordinateContainer
                            theme={theme}
                            coordinateData={coordinateData}
                            height="small"
                          />
                        </div>
                      </div>
                      <div className="w-full flex gap-3 max-[885px]:flex-col">
                        {(role === "sa") && <div className="w-[50%] max-[885px]:w-full">
                          <Outreach outreachChat={outreachChat} outreachData={outreachData} theme={theme} /> </div>}
                        {role === "sa" && <div className="flex gap-3 w-[50%] max-[885px]:w-full max-[500px]:flex-col">
                          <div className={`${prospect ? "w-[50%]" : "w-full"} max-[500px]:w-full`}>
                            <PromoteContainer promoteData={promoteData} theme={theme} width={prospect ? "small" : "large"} />
                          </div>
                          {prospect && <div className="w-[50%] max-[500px]:w-full">
                            <Prospect theme={theme} />
                          </div>}

                        </div>}
                      </div>
                    </div>
                  </div> : <></>
            }
          </div>
          <div className="flex flex-col min-w-[20%] gap-3 max-[1350px]:hidden">
            <RecentActivity value={value} profileData={profileData} />
            <ManageTeam />
            <Pricing />
          </div>
        </>
      }
    </div>
  );
};

export default Dashboard;


{/* <div className="flex gap-3 mb-2">
                  <div className="flex flex-col gap-3 w-[55%]">
                    <div className="w-full flex gap-3">
                      <div className={(outreach && trends) ? "w-[50%]" : "w-full"}>
                        <TrackerContainer trackers={trackerData} width={(role === "sa") ? "smaller" : "large"} />
                      </div>
                      {(trends && role === "sa") && <div className="w-[50%]">
                        <Trends container="small" />
                      </div>}
                    </div>
                    {(outreach && role === "sa") && <div><Outreach outreachChat={outreachChat} outreachData={outreachData} theme={theme} /> </div>}
                  </div>

                  <div className="flex flex-col gap-3 w-[45%]">
                    {(role === "user" && trends) && <div><Trends container="large" /></div>}
                    <div className="w-full">
                      <CoordinateContainer
                        theme={theme}
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
                </div> */}