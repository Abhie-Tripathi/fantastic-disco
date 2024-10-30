"use client";

import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Search, ChevronDown } from "lucide-react";
import { useFilterContext } from "@/context/filterContext";

export default function KeywordFilter() {
  const [isOpen, setIsOpen] = useState(false);
  const { getLocalFilterValue, setMultipleLocalFilters } = useFilterContext();
  const [includeKeywords, setIncludeKeywords] = useState<string[]>([]);
  const [excludeKeywords, setExcludeKeywords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState("include");

  useEffect(() => {
    const savedIncludeKeywords = getLocalFilterValue("includeKeywords");
    const savedExcludeKeywords = getLocalFilterValue("excludeKeywords");
    if (savedIncludeKeywords)
      setIncludeKeywords(savedIncludeKeywords.split(","));
    if (savedExcludeKeywords)
      setExcludeKeywords(savedExcludeKeywords.split(","));
  }, [getLocalFilterValue]);

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
        setIncludeKeywords([...includeKeywords, ...uniqueNewKeywords]);
      } else {
        const uniqueNewKeywords = newKeywords.filter(
          (k) => !excludeKeywords.includes(k)
        );
        setExcludeKeywords([...excludeKeywords, ...uniqueNewKeywords]);
      }
      setInputValue("");
    }
  };

  console.log(includeKeywords);

  const handleRemoveKeyword = (
    keyword: string,
    type: "include" | "exclude"
  ) => {
    if (type === "include") {
      setIncludeKeywords(includeKeywords.filter((k) => k !== keyword));
    } else {
      setExcludeKeywords(excludeKeywords.filter((k) => k !== keyword));
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

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
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
      <PopoverContent className="w-[348px] p-0">
        <Tabs
          defaultValue="include"
          onValueChange={(value) =>
            setActiveTab(value as "include" | "exclude")
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="include">Include</TabsTrigger>
            <TabsTrigger value="exclude">Exclude</TabsTrigger>
          </TabsList>
          <div className="p-4 space-y-4">
            <form onSubmit={handleAddKeyword} className="flex space-x-2">
              <div className="relative flex-grow">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder={`Type Products/Topics to ${
                    activeTab === "include" ? "include" : "exclude"
                  }`}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button type="submit" size="sm" className="h-10 px-4">
                +
              </Button>
            </form>
            <TabsContent value="include" className="mt-0">
              <div className="flex flex-wrap gap-2">
                {includeKeywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="secondary"
                    className="text-sm py-1 px-2"
                  >
                    {keyword}
                    <button
                      onClick={() => handleRemoveKeyword(keyword, "include")}
                      className="ml-1 hover:text-destructive"
                      aria-label={`Remove keyword ${keyword}`}
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="exclude" className="mt-0">
              <div className="flex flex-wrap gap-2">
                {excludeKeywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="secondary"
                    className="text-sm py-1 px-2"
                  >
                    {keyword}
                    <button
                      onClick={() => handleRemoveKeyword(keyword, "exclude")}
                      className="ml-1 hover:text-destructive"
                      aria-label={`Remove keyword ${keyword}`}
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
