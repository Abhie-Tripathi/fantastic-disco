"use client";

import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { X, Search, ChevronDown } from "lucide-react";
import { useFilterContext } from "@/context/filterContext";
import KeywordTabs from "./keywordTabs";
import styles from "@/app/components/internal/trackers/Filters/filters.style.module.css";
interface KeywordSelectorProps{
  type?:string;
  fetchAISuggestion?: (promptText: string) => Promise<any>;
  suggestions?:any;
}
interface keywordInterface{
  isKeywordEnabled?:boolean;
  positiveKeywords?: string[] | undefined;
  negativeKeywords?: string[] | undefined;
}
export default function KeywordFilter({
  type,
  fetchAISuggestion,
  suggestions,
}:KeywordSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    getLocalFilterValue,
    setMultipleLocalFilters,
    localFilters,
    searchParams,
    setLocalFilter
  } = useFilterContext();
  const [localIncludeKeywords, setLocalIncludeKeywords] = useState<string[]>(
    []
  );
  const [localExcludeKeywords, setLocalExcludeKeywords] = useState<string[]>(
    []
  );
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState<"include" | "exclude">("include");
  const [includeKeywords, setIncludeKeywords] = useState<string[]>([]);
const [excludeKeywords, setExcludeKeywords] = useState<string[]>([]);
useEffect(()=>{
  const includeKeywords = [
    ...getLocalFilterValue("includeKeywords")?.split(",").filter((keyword) => keyword.trim() !== "")
  ];
  const excludeKeywords=[
        ...getLocalFilterValue("excludeKeywords")?.split(",").filter((keyword) => keyword.trim() !== "")
      ];
  if(includeKeywords.length>0 && type==="T_PRODUCT_KEYWORDS" && activeTab==="include")
  fetchAISuggestion?.(`List top 5 keywords similar to ${includeKeywords[includeKeywords.length-1]}. Response should be in plain JSON format without any additional formatting or text: {"data": ["keyword 1","keyword 2","keyword 3","keyword 4","keyword 5"]}. Do not show example values. If no company name found then return in below format: {\"data\": []}`);
  else if(excludeKeywords.length>0 && type==="T_PRODUCT_KEYWORDS" && activeTab==="exclude"){
  fetchAISuggestion?.(`List top 5 keywords similar to ${excludeKeywords[excludeKeywords.length-1]}. Response should be in plain JSON format without any additional formatting or text: {"data": ["keyword 1","keyword 2","keyword 3","keyword 4","keyword 5"]}. Do not show example values. If no company name found then return in below format: {\"data\": []}`);
}
},[getLocalFilterValue("includeKeywords"), getLocalFilterValue("excludeKeywords")])
  useEffect(() => {
    const savedIncludeKeywords = localFilters.includeKeywords;
    const savedExcludeKeywords = localFilters.excludeKeywords;
    if((savedIncludeKeywords ?? "").length > 0)
    setIncludeKeywords?.(savedIncludeKeywords?.split(",") || []);
    if((savedExcludeKeywords ?? "").length > 0)
    setExcludeKeywords?.(savedExcludeKeywords?.split(",") || []);
  }, [searchParams, localFilters]);

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newKeywords = inputValue
        .trim()
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
     addKeywords(newKeywords)
    }
  };
  const addKeywords=(newKeywords:string[])=>{
    if (activeTab === "include") {
      const uniqueNewKeywords = newKeywords.filter(
        (k) => !includeKeywords.includes(k)
      );
      setIncludeKeywords?.([...includeKeywords, ...uniqueNewKeywords]);
      setLocalFilter("includeKeywords",[...includeKeywords, ...uniqueNewKeywords].join(","))
    } else {
      const uniqueNewKeywords = newKeywords.filter(
        (k) => !excludeKeywords.includes(k)
      );
      setExcludeKeywords?.([...excludeKeywords, ...uniqueNewKeywords]);
      setLocalFilter("excludeKeywords",[...excludeKeywords, ...uniqueNewKeywords].join(","))
    }
    setInputValue("");
  }
  const handleRemoveKeyword = (
    keyword: string,
    keyType: "include" | "exclude"
  ) => {
    if (keyType === "include") {
      setIncludeKeywords?.(includeKeywords.filter((k) => k !== keyword));
      setLocalFilter("includeKeywords", includeKeywords.filter((k) => k !== keyword).join(","))
    } else {
      setExcludeKeywords?.(excludeKeywords.filter((k) => k !== keyword));
      setLocalFilter("excludeKeywords", excludeKeywords.filter((k) => k !== keyword).join(","));
    }
  };
  const handleApply = () => {
    // setMultipleLocalFilters({
    //   includeKeywords: includeKeywords.join(","),
    //   excludeKeywords: excludeKeywords.join(","),
    // });
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      handleApply();
    }
  };
  // useEffect(() => {
  //   if (type === "T_PRODUCT_KEYWORDS" && !isOpen) {
  //     handleOpenChange(true);
  //   }
  // }, [type, isOpen]);
  
  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      {type!=="T_PRODUCT_KEYWORDS" &&
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          // disabled={enabledProductData && !enabledProductData?.isKeywordEnabled}
          className="w-full justify-between px-3 py-5 text-base font-normal"
        >
          <span className="flex items-center gap-2">
            Products/Topics
            {(includeKeywords.length > 0 || excludeKeywords.length > 0) && (
              <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                {includeKeywords.length + excludeKeywords.length}
              </span>
            )}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      }
      {type==="T_PRODUCT_KEYWORDS"?(
      <>
      <KeywordTabs type="T_PRODUCT_KEYWORDS" activeTab={activeTab} setActiveTab={setActiveTab} handleAddKeyword={handleAddKeyword} inputValue={inputValue} setInputValue={setInputValue} includeKeywords={includeKeywords} excludeKeywords={excludeKeywords} handleRemoveKeyword={handleRemoveKeyword}/>
      {(activeTab && suggestions && suggestions.length > 0) &&
        (<div className="p-4 bg-[var(--primary-foreground)] border border-border-color rounded-sm mt-3 w-full" >
          <div className="text-sm font-[var(--font-weight-medium)] text-[var(--secondary-text-color)] flex gap-1.5 mb-3 items-center">
            AI SUGGESTIONS {" "}
            <span className={styles.experimental_tag}>Beta</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
             {suggestions.map((item: string, ind: number)=>(
               <div key={ind} className={styles.suggestion_badge} onClick={()=>addKeywords([item])}>{item}</div>
             ))} 
          </div>
        </div>)
      }
      </>
      ):
        (
          <PopoverContent className="w-[348px] p-0">
        <KeywordTabs type="" activeTab={activeTab} setActiveTab={setActiveTab} handleAddKeyword={handleAddKeyword} inputValue={inputValue} setInputValue={setInputValue} includeKeywords={includeKeywords} excludeKeywords={excludeKeywords} handleRemoveKeyword={handleRemoveKeyword}/>
      </PopoverContent>
        )
      }
      
    </Popover>
  );
}