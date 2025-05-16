import {useRef, useEffect, useState} from "react";
import {
  Dialog,
  DialogTitle,
  DialogPortal,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import spinnerBrandBrief from "@/public/spinnerBrandBrief.svg";
import Image from "next/image";
import {
  Maximize2,
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
import { DraggableDialog } from "./DraggableDialog";
import { useRouter } from 'next/navigation';


type TemplatesModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const TemplatesModal = ({
  open,
  onOpenChange,
}: TemplatesModalProps) => {
  const {setShowFetchedData} = useFilterContext();
  const router = useRouter();
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
    if(aiStatus?.companyData?.status === 1 && Object.keys(aiStatus?.companyData?.data)?.length>0)
    res=res+1;
    if(aiStatus?.competitorData?.status===1 && aiStatus?.competitorData?.data?.length>0)
    res=res+1;
    if(aiStatus?.keywordData?.status===1 && aiStatus?.keywordData?.data?.length>0)
    res=res+1;
    setLoadedCount(res);
  }, [loadingState]);
  const maximizeModal = () => {
    setShowFetchedData(true);
    setTemplateView(false);
    router.push("/internal/trackers?showTemplates=true");   
  }
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
    // <DraggableDiv>
    <Dialog open={open} onOpenChange={onOpenChange} >
  <DialogPortal>
    {/* BACKDROP OVERLAY */}
    <DraggableDialog
          open={open}
          onOpenChange={onOpenChange}
          initialPosition={{ x: window.innerWidth - 336, y: 72 }} // Adjust as needed
          className="shadow-[0_0.3125rem_0.3125rem_rgba(0,0,0,0.1)] dark:shadow-[0_0.3125rem_0.3125rem_rgba(0,0,0,1)] bg-transparent"
        >


    {/* DIALOG CONTENT */}
    {/* <div className="fixed top-[72px] right-2 z-[11] shadow-[0_0.3125rem_0.3125rem_rgba(0,0,0,0.1)] h-[40vh] w-[20rem] bg-background rounded-[1.875rem] overflow-hidden"> */}
   <div className="absolute z-[111111111] top-3 right-3 cursor-pointer flex gap-2 items-center" >
    <Button variant="outline" className="flex gap-1 p-2" onClick={maximizeModal}>
  <Maximize2  className="text-[var(--secondary-text-color)]" width={14} height={14}/>
  </Button>
  <Button onClick={() => setTemplateView(false)} variant="outline" className="flex gap-1 p-2">
  <X className="text-[var(--secondary-text-color)]" width={14} height={14}/>
  </Button>
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
    bg-[var(--tabs-background-color)]
    rounded-full 
    shadow-[0_-0.125rem_0_rgba(0,0,0,0.1)]
  "></div>

  {/* Center element */}
  <div className="
    absolute 
    left-[40%] 
    top-1 
    bg-transparent
    shadow-[0_0.125rem_0_rgba(0,0,0,0.1)] 
    rounded-[20px] 
    z-[1] 
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
    bg-[var(--tabs-background-color)]
    rounded-full 
    shadow-[0_-0.125rem_0_rgba(0,0,0,0.1)]
  "></div>
</div>
<div className="h-[28px] top-[20px] mt-[26px]
 w-full bg-[var(--tabs-background-color)]">{" "}</div>
      <div className="bg-[var(--tabs-background-color)] rounded-lg relative flex flex-col overflow-scroll top-[10px] z-10 h-[32vh] -mt-4" ref={scrollRef}>
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
        <TrackerDraftCard type="T_COMPETITOR" heading="Top Competitors Tracker" imgUrl={Competitor} data={`${Object.keys(templateData.competitorData.data || {}).length} Companies`} view="minView" entries={structure("competitorData","")}/>
      }
      {(loadingState.isCompetitorsLoading && !loadingState.isKeywordsLoading) &&
      <CardSkeleton />
    }
    {loadingState.isKeywordsLoading && 
    <div onClick={() => setSuggestion(2)}>
    <TrackerDraftCard type="T_PRODUCT_KEYWORDS" heading="Top Product & Topic Tracker" imgUrl={Keywords} data={`${Object?.keys(templateData?.keywordData?.data || {}).length} Keywords`} view="minView"  entries={structure("keywordData","")}/>
    </div>
    }
      {(loadingState.isCompetitorsLoading && loadingState.isKeywordsLoading &&!loadingState.isPeopleLoading) &&
      <CardSkeleton />}
    {loadingState.isPeopleLoading &&
      <div onClick={() => setSuggestion(3)}>
      <TrackerDraftCard type="T_PEOPLE_FINDER" heading="Top People Finder Tracker" imgUrl={PeopleFinder} data={`${Object.keys(templateData?.companyData?.data?.pocs || {}).length} Profiles`} view="minView" entries={structure("companyData", "pocs")}/>
      </div>
    }
    {/* {!(loadingState.isCompetitorsLoading && loadingState.isKeywordsLoading && loadingState.isPeopleLoading) &&
    <div className="flex w-full items-center justify-center flex-col gap-1">
      <div className="flex w-4 h-[18px] animate-[spin_1s_linear_infinite]">
        <Image src={spinnerBrandBrief} alt="spinner"/>
      </div>
    <div className="text-[var(--secondary-text-color)]">Analysing...</div>
    </div>} */}
          </div>
        
      {/* </div> */}
    </div>
    </DraggableDialog>
  </DialogPortal>
 
</Dialog>
// </DraggableDiv>

  );
};

export default TemplatesModal;
