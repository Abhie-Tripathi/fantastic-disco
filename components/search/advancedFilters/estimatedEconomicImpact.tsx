"use client";

import React, { useMemo } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useFilterContext } from "@/context/filterContext";
import { Switch } from "@/components/ui/switch";
import { LockClosedSmall } from "geist-icons";
import { cn } from "@/lib/utils";
import { PopoverTrigger } from "@/components/ui/popover";
import { Popover } from "@/components/ui/popover";

export default function EstimatedEconomicSelector() {
  const { setLocalFilter, getLocalFilterValue, morphedData } =
    useFilterContext();
  const enabled = morphedData.economicImpact.isEnabled;
  const showToggle = morphedData.economicImpact.isToogleEnabled;

  const isEnabled = useMemo(() => {
    const showFilters = getLocalFilterValue("show").split(",");
    return showFilters.includes("economicImpact");
  }, [getLocalFilterValue]);

  const handleToggle = (checked: boolean) => {
    const showFilters = getLocalFilterValue("show").split(",").filter(Boolean);

    if (checked) {
      setLocalFilter("show", [...showFilters, "economicImpact"].join(","));
    } else {
      setLocalFilter(
        "show",
        showFilters.filter((filter) => filter !== "economicImpact").join(",")
      );
    }
  };

  return (
    <Button
      disabled={!enabled}
      variant="outline"
      className="w-full justify-between px-3 py-5 text-base font-normal"
    >
      <div className="flex items-center">
        {!enabled && <LockClosedSmall color="var(--secondary-text-color)" />}
        <span className="mr-2">Economic Impact</span>
      </div>
      <Switch
        disabled={!enabled}
        id="economic-impact"
        checked={isEnabled}
        onCheckedChange={handleToggle}
      />
    </Button>
  );
}
