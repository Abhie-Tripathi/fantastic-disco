import { Skeleton } from "@/components/ui/skeleton";
import fetchIcon from "@/public/internal/fetch_icon.svg";
import Image from "next/image";
import TrackerDraftCard from "./TrackerDraftCard";
import Link from "next/link";
import spinnerBrandBrief from "@/public/spinnerBrandBrief.svg";
import PeopleFinder from "/public/peopleFinder.svg";
import Competitor from "/public/competitor.svg";
import Keywords from "/public/keywords.svg";
import React, { useEffect, useState } from "react"; 
import { useTrackerContext } from "@/context/tracker";

const CardSkeleton = () => {
  return (
    <div className="grid grid-cols-6 gap-2 items-center">
      <Skeleton className="col-span-1 w-full h-full" />

      <div className="col-span-4 gap-2 flex flex-col">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-2 w-2/3" />
        <Skeleton className="h-2 w-2/3" />
        <Skeleton className="h-2 w-1/3" />
      </div>
      <Skeleton className="col-span-1 h-4" />
    </div>
  );
};
interface fetchedTrackerProps {
    loadingState: {
      isKeywordsLoading: boolean;
      isCompetitorsLoading: boolean;
      isPeopleLoading: boolean;
    };
}
const FetchedTracker = ({loadingState}:fetchedTrackerProps) => {
  const {setSuggestion} = useTrackerContext();
  const [loadedCount, setLoadedCount] = useState(0);
  const [d,setD] = useState();
  const templateData = JSON.parse(localStorage.getItem("companySuggestion") || "{}");
  useEffect(() => {
    const aiStatus = JSON.parse(localStorage.getItem("companySuggestion") || "{}");
    // console.log("aiStatus", aiStatus);
  
    let res=0;
    if(aiStatus?.companyData?.status === 1)
    res=res+1;
    if(aiStatus?.competitorData?.status===1)
    res=res+1;
    if(aiStatus?.keywordData?.status===1)
    res=res+1;
    setLoadedCount(res);
  },[loadingState])
  const structure = (obj: string, innerObj: string): string[] => {
    const aiStatus = JSON.parse(localStorage.getItem("companySuggestion") || "{}");
  
    const rawData = innerObj === ""
      ? aiStatus?.[obj]?.data
      : aiStatus?.[obj]?.data?.[innerObj];
  
    const structuredData = rawData?.map((item: any) => {
      const values = Object.values(item);
      if (Object.keys(item).length > 1) {
        const [main, ...rest] = values.slice(0, values.length - 1);
        return `${main} ${rest.map(v => `(${v})`).join(' ')}`;
      } else {
        return values.join(', ');
      }
    });
  
    return structuredData ?? [];
  };
  
  return (
    <div className="flex flex-col gap-5">
      <div>
      <div className="flex gap-1 mb-1 items-start transition-all duration-300 ease-in-out">
  {loadingState.isCompetitorsLoading && loadingState.isKeywordsLoading && loadingState.isPeopleLoading ? (
    <div className="flex flex-col gap-1 mb-1 animate-fadeIn"> 
      <div className="flex gap-1">
        <Image src={fetchIcon} height={18} width={18} alt="loading" />
        <span className="font-medium text-base">
          All set! We have successfully created some trackers for you
        </span>
      </div>
      <div className="text-sm text-[var(--secondary-text-color)]">
        Here&apos;s What We Found for You! Choose from the below and add them to get started on tracking
      </div>
    </div>
  ) : (!loadingState.isCompetitorsLoading && !loadingState.isKeywordsLoading &&!loadingState.isPeopleLoading) ?(
    <div className="flex flex-col gap-1 mb-1 animate-fadeIn"> 
      <div className="flex gap-1">
        <Image src={fetchIcon} height={18} width={18} alt="loading" />
        <span className="font-medium text-base">
          Hang in there! We&apos;re analysing the best for you <span className="dots"></span>
        </span>
      </div>
      <div className="text-sm text-[var(--secondary-text-color)]">
        We&apos;re gathering the information to create your trackers
      </div>
    </div>
  ): (
    <div className="flex flex-col gap-1 mb-1 animate-fadeIn"> 
      <div className="flex gap-1">
        <Image src={fetchIcon} height={18} width={18} alt="loading" />
        <span className="font-medium text-base">
        Hang in there ! <span className="text-[hsl(var(--primary))]">{loadedCount}/{Object.values(loadingState).length}</span> Trackers created <span className="dots"></span>
        </span>
      </div>
      <div className="text-sm text-[var(--secondary-text-color)]">
        We&apos;re gathering the information to create your trackers
      </div>
    </div>
  )}
</div>

      </div>
      <div className="flex gap-3 flex-col transition-all duration-300 ease-in-out">
      {!loadingState.isCompetitorsLoading ?
        <CardSkeleton />:
        <div onClick={() => setSuggestion(1)} className="animate-fadeIn">
        {/* <Link href="/internal/trackers/create?type=T_COMPETITOR"> */}
        <TrackerDraftCard
        data={`${Object.keys(templateData?.competitorData?.data).length} Companies`}
        type="T_COMPETITOR"
        heading="Top Competitors Tracker"
        imgUrl={Competitor}
        entries={structure("competitorData","")}
        />
        {/* </Link> */}
        </div>
      }
      {!loadingState.isKeywordsLoading ?
      <CardSkeleton />:
      <div onClick={() => setSuggestion(2)} className="animate-fadeIn">
      {/* <Link href="/internal/trackers/create?type=T_PRODUCT_KEYWORDS"> */}
      <TrackerDraftCard data={`${Object?.keys(templateData?.keywordData?.data).length} Keywords`} type="T_PRODUCT_KEYWORDS" heading="Top Product & Topic Tracker" imgUrl={Keywords} 
      entries={structure("keywordData","")}
      />
      {/* </Link> */}
      </div>
    }
      {!loadingState.isPeopleLoading ?
      <CardSkeleton />:
      <div onClick={() => setSuggestion(3)} className="animate-fadeIn">
      <Link href="/internal/trackers/create?type=T_PEOPLE_FINDER">
      <TrackerDraftCard data={`${Object.keys(templateData?.companyData?.data?.pocs).length} Profiles`} type="T_PEOPLE_FINDER" heading="Top People Finder Tracker" imgUrl={PeopleFinder} entries={structure("companyData", "pocs")}/>
      </Link>
      </div>
    }
    {!(loadingState.isCompetitorsLoading && loadingState.isKeywordsLoading && loadingState.isPeopleLoading) &&
    <div className="flex w-full items-center justify-center flex-col gap-1">
      <div className="flex w-4 h-[18px] animate-[spin_1s_linear_infinite]">
        <Image src={spinnerBrandBrief} alt="spinner"/>
      </div>
    <div className="text-[var(--secondary-text-color)]">Analysing...</div>
    </div>}
    </div>
    </div>
  );
};

export default FetchedTracker;
export { CardSkeleton };