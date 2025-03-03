"use client";

import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DesignationFilter from "@/app/components/prospect/Filters/designation";
import { useFilterContext } from "@/context/filterContext";

export default function JobFilter() {
  const { getLocalFilterValue, deleteMultipleLocalFilters } = useFilterContext();

  const handleClearFilter = (item: any) => {
    deleteMultipleLocalFilters([item]);
  };

  return (
    <div className="px-7 w-full">
      <Accordion
        type="single"
        className="bg-background border border-[var(--neutral-light-color)] rounded-sm mb-3"
        collapsible
      >
        <AccordionItem value="Job Function">
          <div className="flex items-center group relative">
            <div className="w-4/6">
              <AccordionTrigger
                className="hover:no-underline p-2 font-normal text-sm justify-start whitespace-nowrap w-full"
                iconPosition="start"
              >
                Job Function
                <span className="ml-4 bg-[#EBF5FF] text-[var(--info-text-color)] px-1 rounded-sm font-semibold text-xs">
                  {getLocalFilterValue("userJobTitle") &&
                    getLocalFilterValue("userJobTitle").split(",").length}
                </span>
              </AccordionTrigger>
            </div>
            {getLocalFilterValue("userJobTitle") && (
              <span
                className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 text-primary underline font-medium text-xs w-2/6"
                onClick={() => handleClearFilter('userJobTitle')}
              >
                Remove Filter
              </span>
            )}
          </div>
          <AccordionContent className={`"h-fit pb-1 overflow-x-hidden`}>
            <DesignationFilter />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion
        type="single"
        className="bg-background border border-[var(--neutral-light-color)] rounded-sm"
        collapsible
      >
        <AccordionItem value="Job Seniority">
          <div className="flex items-center group relative">
            <div className="w-4/6">
              <AccordionTrigger
                className="hover:no-underline p-2 font-normal text-sm justify-start whitespace-nowrap w-full"
                iconPosition="start"
              >
                Job Seniority
                <span className="ml-4 bg-[#EBF5FF] text-[var(--info-text-color)] px-1 rounded-sm font-semibold text-xs">
                  {getLocalFilterValue("userJobTitle") &&
                    getLocalFilterValue("userJobTitle").split(",").length}
                </span>
              </AccordionTrigger>
            </div>
            {getLocalFilterValue("userJobTitle") && (
              <span
                className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 text-primary underline font-medium text-xs w-2/6"
                onClick={() => handleClearFilter('userJobTitle')}
              >
                Remove Filter
              </span>
            )}
          </div>
          <AccordionContent className={`"h-fit pb-1 overflow-x-hidden`}>
            <DesignationFilter />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
