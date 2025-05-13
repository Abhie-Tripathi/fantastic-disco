import {useRef, useEffect, useState} from "react";
import {
  Dialog,
  DialogTitle,
  DialogPortal,
} from "@/components/ui/dialog";
import spinnerBrandBrief from "@/public/spinnerBrandBrief.svg";
import Image from "next/image";
import {
  Globe,
  LayoutGrid,
  X
} from "lucide-react";
import Link from "next/link";
import { useTrackerContext } from "@/context/tracker";
import PeopleFinder from "/public/peopleFinder.svg";
import Competitor from "/public/competitor.svg";
import Keywords from "/public/keywords.svg";
import { CardSkeleton } from "./FetchedTracker";
import TrackerDraftCard from "./TrackerDraftCard";
import fetchIcon from "@/public/internal/fetch_icon.svg";
import { useFilterContext } from "@/context/filterContext";
export type TemplateType = {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  visualization: string[];
  hierarchy?: { id: string; label: string; value: string }[];
  visibleFilters: {
    location?: boolean;
    eventTypes?: boolean;
    dateRange?: boolean;
    categories?: boolean;
    metrics?: boolean;
  };
  category: "traffic" | "share" | "impact" | "participation";
  version?: string;
};


type TemplatesModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const TemplatesModal = ({
  open,
  onOpenChange,
}: TemplatesModalProps) => {

   const {setSuggestion} = useTrackerContext();
   const {loadingState, templateView, setTemplateView} = useFilterContext();
   const templateData = JSON.parse(localStorage.getItem("companySuggestion") || "{}");
   const [loadedCount, setLoadedCount] = useState(0);
   const scrollRef = useRef<HTMLDivElement>(null);
   useEffect(() => {
    const anyLoaded =
      loadingState.isCompetitorsLoading ||
      loadingState.isKeywordsLoading ||
      loadingState.isPeopleLoading;
  
    if (anyLoaded && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
    const aiStatus = JSON.parse(localStorage.getItem("companySuggestion") || "{}");
    let res=0;
    if(aiStatus.companyData.status === 1)
    res=res+1;
    if(aiStatus.competitorData.status===1)
    res=res+1;
    if(aiStatus.keywordData.status===1)
    res=res+1;
    setLoadedCount(res);
  }, [loadingState]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
  <DialogPortal>
    {/* BACKDROP OVERLAY */}
    

    {/* DIALOG CONTENT */}
    <div className="fixed top-[72px] right-2 z-[11] shadow-[0_0.3125rem_0.3125rem_rgba(0,0,0,0.1)] h-[40vh] w-[20rem] bg-background rounded-[1.875rem] overflow-hidden">
    <div className="absolute z-[111111111] top-3 right-3 cursor-pointer" onClick={() => setTemplateView(false)}>
  <X className="text-[var(--secondary-text-color)]" />
  </div>
    <div className="flex relative"> {/* Container */}
  {/* Left element */}
  <div className="
    absolute 
    z-10 
    top-1 
    left-0 
    w-[7.5rem] 
    h-[3.125rem] 
    bg-background
    rounded-full 
    shadow-[0_-0.125rem_0_rgba(0,0,0,0.1)]
  "></div>

  {/* Center element */}
  <div className="
    absolute 
    left-[40%] 
    top-1 
    bg-background
    shadow-[0_0.125rem_0_rgba(0,0,0,0.1)] 
    rounded-full 
    z-[11] 
    -ml-5 
    -mt-7 
    w-[7.5rem] 
    h-[3.125rem]
  "></div>
  {/* Right element */}
  <div className="
    absolute 
    z-10 
    top-1 
    right-0 
    ml-[7.5rem] 
    w-[33%] 
    h-[3.125rem] 
    bg-background
    rounded-full 
    shadow-[0_-0.125rem_0_rgba(0,0,0,0.1)]
  "></div>
</div>
      <div className="bg-background h-[30vh] rounded-lg relative flex flex-col overflow-scroll top-[40px] z-10" ref={scrollRef}>
        {/* CUSTOM CLOSE BUTTON */}
        {/* <div className="absolute right-4 top-4 z-10">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Hide
          </Button>
        </div> */}

        {/* HEADER */}
        <div className="px-5">
          <DialogTitle className="tracking-normal text-base font-medium">Brand Brief Builder</DialogTitle>
        </div>
          <div className="px-5 flex gap-1 pt-2">
          <Image src={fetchIcon} height={18} width={18} alt="loading"/>
          <div className="text-sm">Hang in there ! <span className="text-[hsl(var(--primary))]">{loadedCount}/{Object.values(loadingState).length}</span> Trackers created...</div>
          </div>
        {/* SCROLLABLE CONTENT */}
        
          <div className="space-y-4 m-4">
          {!loadingState.isCompetitorsLoading &&
        <CardSkeleton />
      }
      {loadingState.isCompetitorsLoading &&
        <Link href="/internal/trackers/create?type=T_COMPETITOR">
        <TrackerDraftCard type="Competitors" heading="Top Competitors Tracker" imgUrl={Competitor} data={`${Object.keys(templateData.competitorData.data).length} Companies`} view="minView"/>
        </Link>
      }
      {(loadingState.isCompetitorsLoading && !loadingState.isKeywordsLoading) &&
      <CardSkeleton />
    }
    {loadingState.isKeywordsLoading && 
    <div onClick={() => setSuggestion(2)}>
    <Link href="/internal/trackers/create?type=T_PRODUCT_KEYWORDS">
    <TrackerDraftCard type="Product Keywords" heading="Top Product & Topic Tracker" imgUrl={Keywords} data={`${Object.keys(templateData.keywordData.data[0]).length} Keywords`} view="minView"/>
    </Link>
    </div>
    }
      {(loadingState.isCompetitorsLoading && loadingState.isKeywordsLoading &&!loadingState.isPeopleLoading) &&
      <CardSkeleton />}
    {loadingState.isPeopleLoading &&
      <div onClick={() => setSuggestion(3)}>
      <Link href="/internal/trackers/create?type=T_PEOPLE_FINDER">
      <TrackerDraftCard type="People Finder" heading="Top People Finder Tracker" imgUrl={PeopleFinder} data={`${Object.keys(templateData.competitorData.data).length} Profiles`} view="minView"/>
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
    </div>
  </DialogPortal>
</Dialog>


  );
};

export default TemplatesModal;
