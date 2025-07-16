"use client";
import { useFilterContext } from "@/context/filterContext";
import PresetBase from "./Presets"; 
import { useMemo } from "react";
import { useRef } from "react";
interface Props {
  isPublic?: boolean;
  isFull?: boolean;
  template?: any;
  handlePresetClick?: (item: any, id: string, trackerType: string, name: string) => void;
  setShowTemplate?: (val: boolean) => void;
}
const PrivatePresets = (props: Props) => {
  const { getLocalFilterValue, localFilters } = useFilterContext();
    const containerRef = useRef<HTMLDivElement>(null);
  const selectedLocation = useMemo(() =>
    getLocalFilterValue("presetCountry")?.split(',').filter(Boolean) || [],
    [localFilters.presetCountry]
  );

  const selectedCategory = useMemo(() =>
    getLocalFilterValue("presetCategory")?.split(',').filter(Boolean) || [],
    [localFilters.presetCategory]
  );

  return (
    <PresetBase
      {...props}
      selectedLocation={selectedLocation}
      containerRef={containerRef}
      selectedCategory={selectedCategory}
      isPublic={props.isPublic}
      isFull = {props.isFull || false}
    />
  );
};

export default PrivatePresets;
