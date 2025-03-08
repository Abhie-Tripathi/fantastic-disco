"use client";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { useFilterContext } from "@/context/filterContext";
import { EventType } from "@/public/data/searchFilters";

export default function EventFormatSelector() {
  const { setLocalFilter, getLocalFilterValue, morphedData } =
    useFilterContext();
  const eventFormats = morphedData?.eventFormats?.options;
  const enabled = morphedData?.eventFormats?.isEnabled;
  const selectedFormats = getLocalFilterValue("eventFormats")
    .split(",")
    .filter(Boolean);

  const handleFormatToggle = (formatId: string) => {
    const newFormats = selectedFormats.includes(formatId)
      ? selectedFormats.filter((id) => id !== formatId)
      : [...selectedFormats, formatId];
    setLocalFilter("eventFormats", newFormats.join(","));
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="eventType" className="border no-underline">
        <AccordionTrigger className="p-2 no-underline">
          <div className="flex items-center justify-between w-full">
            <span className="flex items-center gap-2">
              Event Format
              {selectedFormats.length > 0 && (
                <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                  {selectedFormats.length}
                </span>
              )}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="p-4 space-y-4">
            {eventFormats?.map((eventFormat: EventType) => (
              <div key={eventFormat.id} className="flex items-center space-x-2">
                <Checkbox
                  id={eventFormat.id}
                  className="rounded-none"
                  checked={selectedFormats.includes(eventFormat.id)}
                  onCheckedChange={() => handleFormatToggle(eventFormat.id)}
                  disabled={!eventFormat.isEnabled}
                />
                <label
                  htmlFor={eventFormat.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {eventFormat.label}
                </label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
