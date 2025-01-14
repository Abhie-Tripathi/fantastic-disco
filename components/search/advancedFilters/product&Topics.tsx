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
// interface KeywordSelectorProps{
//   source:string;
//   enabledProductData?:keywordInterface,
//   type?:string;
//   includeKeywords?:string[];
//   setIncludeKeywords?:React.Dispatch<React.SetStateAction<string[] | undefined>>;
//   excludeKeywords?:string[];
//   setExcludeKeywords?:React.Dispatch<React.SetStateAction<string[] | undefined>>;
// }
interface keywordInterface{
  isKeywordEnabled?:boolean;
  positiveKeywords?: string[] | undefined;
  negativeKeywords?: string[] | undefined;
}
export default function KeywordFilter({
  type,
}:{type?:string}) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    getLocalFilterValue,
    setMultipleLocalFilters,
    localFilters,
    searchParams,
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
      if (activeTab === "include") {
        const uniqueNewKeywords = newKeywords.filter(
          (k) => !includeKeywords.includes(k)
        );
        
        setIncludeKeywords?.([...includeKeywords, ...uniqueNewKeywords]);
      } else {
        const uniqueNewKeywords = newKeywords.filter(
          (k) => !excludeKeywords.includes(k)
        );
        setExcludeKeywords?.([...excludeKeywords, ...uniqueNewKeywords]);
      }
      setInputValue("");
    }
  };

  const handleRemoveKeyword = (
    keyword: string,
    type: "include" | "exclude"
  ) => {
    if (type === "include") {
      setIncludeKeywords?.(includeKeywords.filter((k) => k !== keyword));
    } else {
      setExcludeKeywords?.(excludeKeywords.filter((k) => k !== keyword));
    }
  };

  const handleApply = () => {
    setMultipleLocalFilters({
      includeKeywords: includeKeywords.join(","),
      excludeKeywords: excludeKeywords.join(","),
    });
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      handleApply();
    }
  };
  useEffect(() => {
    if (type === "T_PRODUCT_KEYWORDS" && !isOpen) {
      handleOpenChange(true);
    }
  }, [type, isOpen]);
  
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
      <KeywordTabs type="T_PRODUCT_KEYWORDS" activeTab={activeTab} setActiveTab={setActiveTab} handleAddKeyword={handleAddKeyword} inputValue={inputValue} setInputValue={setInputValue} includeKeywords={includeKeywords} excludeKeywords={excludeKeywords} handleRemoveKeyword={handleRemoveKeyword}/>
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