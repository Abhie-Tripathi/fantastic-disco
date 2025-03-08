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

export default function EventEntrySelector() {
  const { setLocalFilter, getLocalFilterValue, morphedData } =
    useFilterContext();
  const eventEntries = morphedData?.eventEntries?.options;
  const enabled = morphedData?.eventEntries?.isEnabled || [];
  const selectedStatuses = getLocalFilterValue("entryType")
    ?.split(",")
    ?.filter(Boolean);

  const handleStatusToggle = (statusId: string) => {
    const newStatuses = selectedStatuses.includes(statusId)
      ? selectedStatuses.filter((id) => id !== statusId)
      : [...selectedStatuses, statusId];
    setLocalFilter("entryType", newStatuses.join(","));
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="eventType" className="border no-underline">
        <AccordionTrigger className="p-2 no-underline">
          <div className="flex items-center justify-between w-full">
            <span className="flex items-center gap-2">
              Event Entry
              {selectedStatuses.length > 0 && (
                <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                  {selectedStatuses.length}
                </span>
              )}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="p-4 space-y-4">
            {eventEntries.map((eventEntry: EventType) => (
              <div
                key={eventEntry.id}
                className={`flex items-center space-x-2 ${
                  !eventEntry.isEnabled ? "opacity-50" : ""
                }`}
              >
                <Checkbox
                  id={eventEntry.id}
                  className="rounded-none"
                  checked={selectedStatuses.includes(eventEntry.id)}
                  onCheckedChange={() => handleStatusToggle(eventEntry.id)}
                  disabled={!eventEntry.isEnabled}
                />
                <label
                  htmlFor={eventEntry.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {eventEntry.label}
                </label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
