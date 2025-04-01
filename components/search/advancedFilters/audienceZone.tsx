"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useFilterContext } from "@/context/filterContext";
import { Switch } from "@/components/ui/switch";
import { LockClosedSmall } from "geist-icons";
import { cn } from "@/lib/utils";
export default function AudienceZoneSatusSelector() {
  const { setLocalFilter, getLocalFilterValue, morphedData } =
    useFilterContext();
  const enabled = morphedData.audienceZone.isEnabled;
  const isEnabled = useMemo(() => {
    const showFilters = getLocalFilterValue("show").split(",");
    return showFilters.includes("audienceZone");
  }, [getLocalFilterValue]);

  const handleToggle = (checked: boolean) => {
    const showFilters = getLocalFilterValue("show").split(",").filter(Boolean);

    if (checked) {
      setLocalFilter("show", [...showFilters, "audienceZone"].join(","));
    } else {
      setLocalFilter(
        "show",
        showFilters.filter((filter) => filter !== "audienceZone").join(",")
      );
    }
  };

  return (
    <div
      className={cn(
        buttonVariants({ variant: "outline" }),
        "w-full justify-between px-3 py-5 text-base font-normal"
      )}
    >
      <div className="flex items-center">
        {!enabled && <LockClosedSmall color="var(--secondary-text-color)" />}
        <span className="mr-2">Audience Zone</span>
      </div>
      <Switch
        id="forecasted-status"
        checked={isEnabled}
        onCheckedChange={handleToggle}
      />
    </div>
  );
}
