"use client";
import { useCallback, useState } from "react";
import { useFilterContext } from "@/context/filterContext";
import FetchTemplateMinModal from "./FetchTemplateMinModal";

export default function TrackerGlobalModal() {
 const {templateView} = useFilterContext();
 const [showFetchedData, setShowFetchedData] = useState(false);
 
  const handleTemplateSelect = useCallback(() => {
    //  console.log("Selected template:", template);
     setShowFetchedData(false);
   }, [templateView]);
  
  if (!templateView) return null;

  return (
    <FetchTemplateMinModal 
          open={templateView}
          onOpenChange={setShowFetchedData}
        />
  );
}
