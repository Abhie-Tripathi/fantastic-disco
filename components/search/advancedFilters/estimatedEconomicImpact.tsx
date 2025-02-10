"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useFilterContext } from "@/context/filterContext";
import { LockClosedSmall } from "geist-icons";

export default function EstimatedEconomicSelector() {
  const { setLocalFilter, getLocalFilterValue, morphedData } =
    useFilterContext();
  const enabled = morphedData.economicImpact.isEnabled;
  const showToogle = morphedData.economicImpact.isToogleEnabled;
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
      variant="outline"
      className="w-full justify-between px-3 py-5 text-base font-normal"
      disabled={!enabled}
    >
      <div className="flex items-center">
        {!enabled && <LockClosedSmall color="var(--secondary-text-color)" />}
        <span className="mr-2">Economic Impact</span>
      </div>
      <Switch
        disabled={!enabled}
        id="forecasted-status"
        checked={isEnabled}
        onCheckedChange={handleToggle}
      />
    </Button>
  );
}
