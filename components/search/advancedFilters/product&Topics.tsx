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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { LockClosedSmall } from "geist-icons";

interface KeywordSelectorProps {
  type?: string;
  fetchAISuggestion?: (promptText: string) => Promise<any>;
  suggestions?: any;
  hideSuggestion?: boolean;
  setHideSuggestion?: (value: boolean) => void;
}

interface KeywordFilterProps extends KeywordSelectorProps {
  variant?: "accordion" | "popover";
}

export default function KeywordFilter({
  type,
  fetchAISuggestion,
  suggestions,
  hideSuggestion,
  setHideSuggestion,
  variant = "popover",
}: KeywordFilterProps) {
  const {
    getLocalFilterValue,
    setMultipleLocalFilters,
    localFilters,
    searchParams,
    setLocalFilter,
  } = useFilterContext();

  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState<"include" | "exclude">("include");
  const [includeKeywords, setIncludeKeywords] = useState<string[]>([]);
  const [excludeKeywords, setExcludeKeywords] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { morphedData } = useFilterContext();
  const enabled = morphedData.globalAndTourings.isEnabled;

  useEffect(() => {
    const includeKeywords = [
      ...getLocalFilterValue("includeKeywords")
        ?.split(",")
        .filter((keyword) => keyword.trim() !== ""),
    ];
    const excludeKeywords = [
      ...getLocalFilterValue("excludeKeywords")
        ?.split(",")
        .filter((keyword) => keyword.trim() !== ""),
    ];

    if (
      includeKeywords.length > 0 &&
      type === "T_PRODUCT_KEYWORDS" &&
      activeTab === "include" &&
      !hideSuggestion
    ) {
      fetchAISuggestion?.(
        `List top 5 keywords similar to ${
          includeKeywords[0]
        }. Response should be in plain JSON format without any additional formatting or text, avoid dummy data in any case: {
          "data": [
             keyword 1, keyword 2, keyword 3, keyword 4 , keyword 5
          ]
      }.  Do not show example values and don't include [
             keyword 1, keyword 2, keyword 3, keyword 4 , keyword 5
          ] in response. If no data is found, respond in this format: {\"data\": []}`
      );
    } else if (
      excludeKeywords.length > 0 &&
      type === "T_PRODUCT_KEYWORDS" &&
      activeTab === "exclude" &&
      !hideSuggestion
    ) {
      fetchAISuggestion?.(
        `List top 5 keywords similar to ${
          excludeKeywords[0]
        }. Response should be in plain JSON format without any additional formatting or text, avoid dummy data in any case: {
          "data": [
             keyword 1, keyword 2, keyword 3, keyword 4 , keyword 5
          ]
      }.  Do not show example values and don't include [
             keyword 1, keyword 2, keyword 3, keyword 4 , keyword 5
          ] in response. If no data is found, respond in this format: {\"data\": []}`
      );
    }
  }, [
    getLocalFilterValue("includeKeywords"),
    getLocalFilterValue("excludeKeywords"),
  ]);

  useEffect(() => {
    const savedIncludeKeywords = localFilters?.includeKeywords;
    const savedExcludeKeywords = localFilters?.excludeKeywords;
    setIncludeKeywords(
      savedIncludeKeywords
        ?.split(",")
        .filter((item) => item.trim().length !== 0) || []
    );
    setExcludeKeywords(
      savedExcludeKeywords
        ?.split(",")
        .filter((item) => item.trim().length !== 0) || []
    );
  }, [searchParams, localFilters]);

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newKeywords = inputValue
        .trim()
        .split(",")
        .map((k) => k.trim().replace(/ /g, "_"))
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
      setLocalFilter(
        "includeKeywords",
        [...includeKeywords, ...uniqueNewKeywords].join(",")
      );
    } else {
      const uniqueNewKeywords = newKeywords.filter(
        (k) => !excludeKeywords.includes(k)
      );
      setExcludeKeywords([...excludeKeywords, ...uniqueNewKeywords]);
      setLocalFilter(
        "excludeKeywords",
        [...excludeKeywords, ...uniqueNewKeywords].join(",")
      );
    }
    setInputValue("");
  };

  const handleRemoveKeyword = (
    keyword: string,
    keyType: "include" | "exclude"
  ) => {
    if (keyType === "include") {
      setIncludeKeywords(includeKeywords.filter((k) => k !== keyword));
      setLocalFilter(
        "includeKeywords",
        includeKeywords.filter((k) => k !== keyword).join(",")
      );
    } else {
      setExcludeKeywords(excludeKeywords.filter((k) => k !== keyword));
      setLocalFilter(
        "excludeKeywords",
        excludeKeywords.filter((k) => k !== keyword).join(",")
      );
    }
  };

  const triggerContent = (
    <span className="flex items-center font-normal text-normal">
      {!enabled && <LockClosedSmall color="var(--secondary-text-color)" />}
      <span className="mr-2">Products/Topics</span>
      {(includeKeywords.length > 0 || excludeKeywords.length > 0) && (
        <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
          {includeKeywords.length + excludeKeywords.length}
        </span>
      )}
    </span>
  );

  const content = (
    <KeywordTabs
      type={type === "T_PRODUCT_KEYWORDS" ? type : ""}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      handleAddKeyword={handleAddKeyword}
      inputValue={inputValue}
      setInputValue={setInputValue}
      includeKeywords={includeKeywords}
      excludeKeywords={excludeKeywords}
      handleRemoveKeyword={handleRemoveKeyword}
    />
  );

  if (type === "T_PRODUCT_KEYWORDS") {
    return (
      <>
        {content}
        {activeTab && suggestions && suggestions.length > 0 && (
          <div className="p-4 bg-[var(--primary-foreground)] border border-border-color rounded-sm mt-3 w-full">
            <div className="text-sm font-[var(--font-weight-medium)] text-[var(--secondary-text-color)] flex gap-1.5 mb-3 items-center">
              AI SUGGESTIONS{" "}
              <span className={styles.experimental_tag}>Beta</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((item: string, ind: number) => (
                <div
                  key={ind}
                  className={styles.suggestion_badge}
                  onClick={() => addKeywords([item])}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  if (variant === "popover") {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={!enabled}
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-full justify-between px-3 py-5 text-base font-normal"
          >
            <div className="flex items-center justify-between w-full">
              {triggerContent}
              <ChevronDown
                className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="productsTopics" className="border rounded-md">
        <AccordionTrigger
          disabled={!enabled}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "no-underline border-none justify-between px-3 py-5 text-base font-normal"
          )}
        >
          <div className="flex items-center justify-between w-full">
            {triggerContent}
          </div>
        </AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
