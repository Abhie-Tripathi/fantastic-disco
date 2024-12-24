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

export default function UserRatingSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { setLocalFilter, getLocalFilterValue } = useFilterContext();

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

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
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
