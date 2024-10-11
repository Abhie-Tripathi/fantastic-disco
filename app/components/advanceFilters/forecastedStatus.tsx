"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
// import { useFilterState } from "@/app/hooks/useFilterState";
import { Switch } from "../../../components/ui/switch";

export default function ForecastedStatusSelector() {
//   const { setFilter, getFilterValue } = useFilterState();
  const [isEnabled, setIsEnabled] = useState(false);

//   useEffect(() => {
//     const showFilters = getFilterValue("show").split(",");
//     setIsEnabled(showFilters.includes("forecasted"));
//   }, [getFilterValue]);

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    // const showFilters = getFilterValue("show").split(",");
    // console.log(showFilters);
    // if (checked) {
    //   setFilter(
    //     "show",
    //     [...showFilters, "forecasted"].join(",").replace(/^,|,$/g, "")
    //   );
    // } else {
    //   setFilter(
    //     "show",
    //     showFilters
    //       .filter((filter) => filter !== "forecasted")
    //       .join(",")
    //       .replace(/^,|,$/g, "")
    //   );
    // }
  };

  return (
    <Button
      variant="outline"
      className="w-full justify-between px-3 py-5 text-base font-normal"
    >
      <div className="flex items-center">
        <span className="mr-2">Forecasted Status</span>
      </div>
      <Switch
        id="forecasted-status"
        checked={isEnabled}
        onCheckedChange={handleToggle}
      />
    </Button>
  );
}