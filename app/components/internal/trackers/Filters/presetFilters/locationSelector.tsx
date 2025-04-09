import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useFilterState } from "@/hooks/useFilterState";
import data from '@/public/data/countryData.json';

interface CountryData {
  code: string;
  displayName: string;
}
interface LocationSelectorProps {
  selectedLocation: string[];
  setSelectedLocation: React.Dispatch<React.SetStateAction<string[]>>;
}

const LocationSelector = React.memo(function LocationSelector({
  setSelectedLocation,
  selectedLocation = [],
}: LocationSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleStatusToggle = (statusId: string) => {
    setSelectedLocation((prev = []) =>
      prev.includes(statusId)
        ? prev.filter((id) => id !== statusId)
        : [...prev, statusId]
    );
  };

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-between px-3 py-5 text-base font-normal ${
            isOpen ? "border-primary" : "border-input"
          }`}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="flex items-center">
            <span className="mr-2">Location</span>
            {selectedLocation?.length > 0 && (
              <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                {selectedLocation?.length}
              </span>
            )}
          </div>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180 transform" : ""
            }`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <div className="p-2 space-y-2 h-[200px] overflow-scroll">
          {data.map((item: CountryData) => (
            <div key={item.code} className="flex items-center space-x-2">
              <Checkbox
                id={item.code}
                className="rounded-none"
                checked={selectedLocation.includes(item.code)}
                onCheckedChange={() => handleStatusToggle(item.code)}
              />
              <label
                htmlFor={item.code}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {item.displayName}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
});

LocationSelector.displayName = "LocationSelector";

export default LocationSelector;