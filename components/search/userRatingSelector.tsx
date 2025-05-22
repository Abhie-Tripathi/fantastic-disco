"use client";

import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import dynamic from "next/dynamic";
import { useFilterContext } from "@/context/filterContext";
import { EventType } from "@/public/data/searchFilters";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const DynamicSwitch = dynamic(() => Promise.resolve(Switch), { ssr: false });

// const userRatings = [
//   { id: "0-1", label: "0-1" },
//   { id: "1-2", label: "1-2" },
//   { id: "2-3", label: "2-3" },
//   { id: "3-4", label: "3-4" },
//   { id: "4-5", label: "4-5" },
// ];

interface FlexibleComponentProps {
  variant?: "accordion" | "popover";
}

export default function UserRatingSelector({ variant = "popover" }: FlexibleComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { setLocalFilter, getLocalFilterValue, morphedData } =
    useFilterContext();
  const userRatings = morphedData.userRatings.options;
  const showUserRatings = morphedData.userRatings.isEnabled;
  const selectedRatings = getLocalFilterValue("ratings")
    .split(",")
    .filter(Boolean);
  const showRatings = getLocalFilterValue("show").includes("rating");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRatingToggle = (ratingId: string) => {
    const newRatings = selectedRatings.includes(ratingId)
      ? selectedRatings.filter((id) => id !== ratingId)
      : [...selectedRatings, ratingId];
    setLocalFilter("ratings", newRatings.join(","));
  };

  const handleShowRatingsToggle = (checked: boolean) => {
    const currentShow = getLocalFilterValue("show").split(",").filter(Boolean);
    const newShow = checked
      ? [...currentShow, "rating"]
      : currentShow.filter((item) => item !== "rating");
    setLocalFilter("show", newShow.join(","));
  };

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const renderTriggerContent = (content: React.ReactNode, isOpen?: boolean, variant?: string) => (
    <div className="flex items-center justify-between w-full">
      {content}
      {variant === "popover" && (
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      )}
    </div>
  );

  const triggerContent = (
    <div className="flex items-center justify-between w-full">
      <span className="flex items-center gap-2">
        User Rating
        {selectedRatings.length > 0 && (
          <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
            {selectedRatings.length}
          </span>
        )}
      </span>
      {isMounted && (
        <DynamicSwitch
          checked={showRatings}
          onCheckedChange={handleShowRatingsToggle}
          aria-label="Show ratings"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
            e.stopPropagation()
          }
        />
      )}
    </div>
  );

  const content = (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {userRatings.map((rating: EventType) => (
          <div key={rating.id} className="flex items-center space-x-2">
            <Checkbox
              id={rating.id}
              disabled={!rating.isEnabled}
              checked={selectedRatings.includes(rating.id)}
              onCheckedChange={() => handleRatingToggle(rating.id)}
            />
            <Label htmlFor={rating.id}>{rating.label}</Label>
          </div>
        ))}
      </div>
    </div>
  );

  if (variant === "popover") {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-full justify-between px-3 py-5 text-base font-normal"
          >
            {renderTriggerContent(triggerContent, isOpen, variant)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="userRating" className="border rounded-md">
        <AccordionTrigger className={cn(buttonVariants({variant : "outline"}), "no-underline border-none justify-between px-3 py-5 text-base font-normal")}>
          {renderTriggerContent(triggerContent)}
        </AccordionTrigger>
        <AccordionContent>
          {content}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
