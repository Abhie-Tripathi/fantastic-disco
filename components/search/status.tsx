"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { useFilterContext } from "@/context/filterContext";
import { EventType } from "@/public/data/searchFilters";

export default function StatusSelector() {
  const { setLocalFilter, getLocalFilterValue, morphedData } =
    useFilterContext();
  const eventStatuses = morphedData.eventStatus.options;
  const enabled = morphedData.eventStatus.isEnabled;
  const selectedStatuses = getLocalFilterValue("status")
    .split(",")
    .filter(Boolean);

  const handleStatusToggle = (statusId: string) => {
    const newStatuses = selectedStatuses.includes(statusId)
      ? selectedStatuses.filter((id) => id !== statusId)
      : [...selectedStatuses, statusId];
    setLocalFilter("status", newStatuses.join(","));
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="status" className="border no-underline">
        <AccordionTrigger className="p-2 no-underline">
          <div className="flex items-center justify-between w-full">
            <span className="flex items-center gap-2">
              Event Status
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
            {eventStatuses?.map((status: EventType) => (
              <div key={status.id} className="flex items-center space-x-2">
                <Checkbox
                  id={status.id}
                  disabled={!status.isEnabled}
                  className="rounded-none"
                  checked={selectedStatuses.includes(status.id)}
                  onCheckedChange={() => handleStatusToggle(status.id)}
                />
                <label
                  htmlFor={status.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {status.label}
                </label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
