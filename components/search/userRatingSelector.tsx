"use client";

import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFilterState } from "@/hooks/useFilterState";
import dynamic from "next/dynamic";
import { useFilterContext } from "@/context/filterContext";

const DynamicSwitch = dynamic(() => Promise.resolve(Switch), { ssr: false });

const userRatings = [
  { id: "0-1", label: "0-1" },
  { id: "1-2", label: "1-2" },
  { id: "2-3", label: "2-3" },
  { id: "3-4", label: "3-4" },
  { id: "4-5", label: "4-5" },
];
interface UserRatingsProps{
  source: string,
  selectedRatings?: string[],
  enabledRatingData?: ratingsInterface,
  setSeectedRatings?: React.Dispatch<React.SetStateAction<string[]>>,
  isEnabled?: boolean;
  setIsEnabled?: React.Dispatch<React.SetStateAction<boolean>>;
}
interface ratingsInterface{
  isRatingEnabled?:boolean | undefined,
  selectedValue?:string[] | undefined,
  enabledValue?:string[] | undefined,
  toggleOpend?:boolean,
  popUpOpend?:boolean,
}
export default function UserRatingSelector({
  source,
  enabledRatingData,
  selectedRatings: parentSelectedRatings=[],
  setSeectedRatings: parentSetSelectedRatings,
  isEnabled: parentIsEnabled = false,
  setIsEnabled: parentSetIsEnabled,
}:UserRatingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { setLocalFilter, getLocalFilterValue, searchParams } =
    useFilterContext();
 const [selectedFormatsLocal, setSelectedFormatsLocal] = React.useState<string[]>(
    []
  );
  const [localIsEnabled, setLocalIsEnabled] = useState(false);
  // const [showRatings, setShowRatings] = useState(false);
  const showRatings = source === "tracker" ? parentIsEnabled : localIsEnabled;
const setShowRatings = source === "tracker" ? parentSetIsEnabled : setLocalIsEnabled;
  const [isMounted, setIsMounted] = useState(false);
   const selectedRatings=
  source === "tracker" ? parentSelectedRatings : selectedFormatsLocal;
const setSelectedRatings=
  source === "tracker" ? parentSetSelectedRatings : setSelectedFormatsLocal;
  useEffect(() => {
    setIsMounted(true);
    if(source!=="tracker" && setSelectedRatings){
    const ratings = getLocalFilterValue("ratings").split(",").filter(Boolean);
    setSelectedRatings(ratings);
    setShowRatings?.(getLocalFilterValue("show").includes("rating"));
    }
  }, [searchParams, getLocalFilterValue]);

  const handleRatingToggle = (ratingId: string) => {
    setSelectedRatings?.((prev) =>
      prev.includes(ratingId)
        ? prev.filter((id) => id !== ratingId)
        : [...prev, ratingId]
    );
  };

  const handleShowRatingsToggle = (checked: boolean) => {
    setShowRatings?.(checked);
    const currentShow = getLocalFilterValue("show").split(",").filter(Boolean);
    const newShow = checked
      ? [...currentShow, "rating"]
      : currentShow.filter((item) => item !== "rating");
    setLocalFilter("show", newShow.join(","));
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setLocalFilter("ratings", selectedRatings.join(","));
    }
    setIsOpen(open);
  };
console.log(enabledRatingData);

  console.log("hii", showRatings);
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          disabled={enabledRatingData && !enabledRatingData?.isRatingEnabled}
          className="w-full justify-between px-3 py-5 text-base font-normal"
        >
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
              disabled={!enabledRatingData?.isRatingEnabled}
              aria-label="Show ratings"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                e.stopPropagation()
              }
            />
          )}
        </Button>
      </PopoverTrigger> 
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {userRatings.map((rating) => (
              <div key={rating.id} className="flex items-center space-x-2">
                <Checkbox
                  id={rating.id}
                  disabled={enabledRatingData && !enabledRatingData?.enabledValue?.includes(rating.id)}
                  checked={selectedRatings.includes(rating.id)}
                  onCheckedChange={() => handleRatingToggle(rating.id)}
                />
                <Label htmlFor={rating.id}>{rating.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}