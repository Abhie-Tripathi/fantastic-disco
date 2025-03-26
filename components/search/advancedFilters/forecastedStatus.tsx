"use client";
import React, { useMemo } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useFilterContext } from "@/context/filterContext";
import { Switch } from "@/components/ui/switch";
import { LockClosedSmall } from "geist-icons";
import { cn } from "@/lib/utils";
export default function ForecastedStatusSelector() {
  const { setLocalFilter, getLocalFilterValue, morphedData } =
    useFilterContext();
  const enabled = morphedData.forcastedStatus.isEnabled;
  const showToogle = morphedData.forcastedStatus.isToogleEnabled;
  const isEnabled = useMemo(() => {
    const showFilters = getLocalFilterValue("show").split(",");
    return showFilters.includes("forecasted");
  }, [getLocalFilterValue]);

  const handleToggle = (checked: boolean) => {
    const showFilters = getLocalFilterValue("show").split(",").filter(Boolean);

    if (checked) {
      setLocalFilter("show", [...showFilters, "forecasted"].join(","));
    } else {
      setLocalFilter(
        "show",
        showFilters.filter((filter) => filter !== "forecasted").join(",")
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
        <span className="mr-2">Forecasted Status</span>
      </div>
      <Switch
        disabled={!enabled}
        id="forecasted-status"
        checked={isEnabled}
        onCheckedChange={handleToggle}
      />
    </div>
  );
}
