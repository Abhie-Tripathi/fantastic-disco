"use client";

import React, { useMemo } from "react";
import { useFilterContext } from "@/context/filterContext";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  filterName: "userNames" | "userSocialLink";
}
export default function PeopleFilter({ filterName }: Props) {
  const placeholder =
    filterName === "userSocialLink"
      ? "Name"
      : "LinkedIn Profile";
  const { localFilters, setLocalFilter, getLocalFilterValue } =
    useFilterContext();

  const inputValue = useMemo(() => {
    return getLocalFilterValue(filterName) ?? "";
  }, [localFilters?.[filterName]]);

  const handleInputChange = (input: string) => {
    if (input.trim()) {
      setLocalFilter(filterName, input.trim());
    }
  };

  return (
    <div className="relative flex-grow p-2">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        type="text"
        placeholder={`Search by ${placeholder}`}
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        className="pl-8 outline-none focus-visible:ring-0"
      />
    </div>
  );
}
