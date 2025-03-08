"use client";
import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFilterContext } from "@/context/filterContext";
import KeywordTabs from "./keywordTabs";
import styles from "@/app/components/internal/trackers/Filters/filters.style.module.css";

interface KeywordSelectorProps {
  type?: string;
  fetchAISuggestion?: (promptText: string) => Promise<any>;
  suggestions?: any;
  hideSuggestion?: boolean;
  setHideSuggestion?: (value: boolean) => void;
}

export default function KeywordFilter({
  type,
  fetchAISuggestion,
  suggestions,
  hideSuggestion,
  setHideSuggestion
}: KeywordSelectorProps) {
  const {
    getLocalFilterValue,
    setMultipleLocalFilters,
    localFilters,
    searchParams,
    setLocalFilter
  } = useFilterContext();
  
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState<"include" | "exclude">("include");
  const [includeKeywords, setIncludeKeywords] = useState<string[]>([]);
  const [excludeKeywords, setExcludeKeywords] = useState<string[]>([]);

  useEffect(() => {
    const includeKeywords = [
      ...getLocalFilterValue("includeKeywords")?.split(",").filter((keyword) => keyword.trim() !== "")
    ];
    const excludeKeywords = [
      ...getLocalFilterValue("excludeKeywords")?.split(",").filter((keyword) => keyword.trim() !== "")
    ];
    
    if (includeKeywords.length > 0 && type === "T_PRODUCT_KEYWORDS" && activeTab === "include" && !hideSuggestion) {
      fetchAISuggestion?.(`List top 5 keywords similar to ${includeKeywords[includeKeywords.length-1]}...`);
    } else if (excludeKeywords.length > 0 && type === "T_PRODUCT_KEYWORDS" && activeTab === "exclude" && !hideSuggestion) {
      fetchAISuggestion?.(`List top 5 keywords similar to ${excludeKeywords[excludeKeywords.length-1]}...`);
    }
  }, [getLocalFilterValue("includeKeywords"), getLocalFilterValue("excludeKeywords")]);

  useEffect(() => {
    const savedIncludeKeywords = localFilters?.includeKeywords;
    const savedExcludeKeywords = localFilters?.excludeKeywords;
    setIncludeKeywords(
      savedIncludeKeywords
        ?.split(",")
        .filter(item => item.trim().length !== 0) || []
    );
    setExcludeKeywords(
      savedExcludeKeywords
        ?.split(",")
        .filter(item => item.trim().length !== 0) || []
    );
  }, [searchParams, localFilters]);

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newKeywords = inputValue
        .trim()
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
      addKeywords(newKeywords);
    }
  };

  const addKeywords = (newKeywords: string[]) => {
    setHideSuggestion?.(false);
    if (activeTab === "include") {
      const uniqueNewKeywords = newKeywords.filter(
        (k) => !includeKeywords.includes(k)
      );
      setIncludeKeywords([...includeKeywords, ...uniqueNewKeywords]);
      setLocalFilter("includeKeywords", [...includeKeywords, ...uniqueNewKeywords].join(","));
    } else {
      const uniqueNewKeywords = newKeywords.filter(
        (k) => !excludeKeywords.includes(k)
      );
      setExcludeKeywords([...excludeKeywords, ...uniqueNewKeywords]);
      setLocalFilter("excludeKeywords", [...excludeKeywords, ...uniqueNewKeywords].join(","));
    }
    setInputValue("");
  };

  const handleRemoveKeyword = (
    keyword: string,
    keyType: "include" | "exclude"
  ) => {
    if (keyType === "include") {
      setIncludeKeywords(includeKeywords.filter((k) => k !== keyword));
      setLocalFilter("includeKeywords", includeKeywords.filter((k) => k !== keyword).join(","));
    } else {
      setExcludeKeywords(excludeKeywords.filter((k) => k !== keyword));
      setLocalFilter("excludeKeywords", excludeKeywords.filter((k) => k !== keyword).join(","));
    }
  };

  if (type === "T_PRODUCT_KEYWORDS") {
    return (
      <>
        <KeywordTabs
          type="T_PRODUCT_KEYWORDS"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleAddKeyword={handleAddKeyword}
          inputValue={inputValue}
          setInputValue={setInputValue}
          includeKeywords={includeKeywords}
          excludeKeywords={excludeKeywords}
          handleRemoveKeyword={handleRemoveKeyword}
        />
        {(activeTab && suggestions && suggestions.length > 0) && (
          <div className="p-4 bg-[var(--primary-foreground)] border border-border-color rounded-sm mt-3 w-full">
            <div className="text-sm font-[var(--font-weight-medium)] text-[var(--secondary-text-color)] flex gap-1.5 mb-3 items-center">
              AI SUGGESTIONS {" "}
              <span className={styles.experimental_tag}>Beta</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((item: string, ind: number) => (
                <div key={ind} className={styles.suggestion_badge} onClick={() => addKeywords([item])}>{item}</div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="productsTopics" className="border no-underline">
        <AccordionTrigger className="p-2 no-underline">
          <div className="flex items-center justify-between w-full">
            <span className="flex items-center gap-2 font-normal text-normal">
              Products/Topics
              {(includeKeywords.length > 0 || excludeKeywords.length > 0) && (
                <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                  {includeKeywords.length + excludeKeywords.length}
                </span>
              )}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <KeywordTabs
            type=""
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleAddKeyword={handleAddKeyword}
            inputValue={inputValue}
            setInputValue={setInputValue}
            includeKeywords={includeKeywords}
            excludeKeywords={excludeKeywords}
            handleRemoveKeyword={handleRemoveKeyword}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}