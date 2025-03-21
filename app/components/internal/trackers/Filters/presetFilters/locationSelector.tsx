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
import data from '@/public/data/countryData.json'
const EventEntries = [
  { id: "free", label: "Free" },
  { id: "paid", label: "Paid" },
];
interface EventEntryProps{
  source: string;
  selectedStatuses?: string[];
  setSelectedStatuses?: React.Dispatch<React.SetStateAction<string[]>>;
}
export default function LocationSelector({
  source,
  selectedStatuses: parentSelectedFormats = [],
  setSelectedStatuses: parentSetSelectedFormats,
}: EventEntryProps) {
  const { setFilter, getFilterValue, searchParams } = useFilterState();
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedFormatsLocal, setSelectedFormatsLocal] = React.useState<string[]>(
    []
  );

  const selectedStatuses =
    source === "tracker" ? parentSelectedFormats : selectedFormatsLocal;
  const setSelectedStatuses =
    source === "tracker" ? parentSetSelectedFormats : setSelectedFormatsLocal;

    // React.useEffect(() => {
    //   if(source!=="tracker" && setSelectedStatuses){
    //   const currentFilter = getFilterValue("entryType");
    //   setSelectedStatuses(currentFilter ? currentFilter.split(",") : []);
    //   }
    // }, [searchParams, getFilterValue]);
  
    const selectedStatus = selectedStatuses.length;
  
    const handleStatusToggle = (statusId: string) => {
      console.log(statusId);
      
      if(setSelectedStatuses)
      setSelectedStatuses((prev) =>
        prev.includes(statusId)
          ? prev.filter((id) => id !== statusId)
          : [...prev, statusId]
      );
      
    };
  
    // const handleSelectAll = (checked: boolean) => {
    //   setSelectedStatuses(
    //     checked ? EventEntries.map((eventEntry) => eventEntry.id) : []
    //   );
    // };
  
    // const isAllSelected = selectedStatuses.length === EventEntries.length;
  
    const handleApply = () => {
      if(source!=="tracker")
      setFilter("entryType", selectedStatuses.join(","));
      setIsOpen(false);
    };
  
    const onOpenChange = (open: boolean) => {
      if (!open) {
        handleApply();
      }
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
            {selectedStatus > 0 && (
              <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                {selectedStatus}
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
        {/* <div className="flex justify-between items-center p-4 py-2 border-b">
          <span className="font-medium">Event Entry</span>
          <Button
            variant="link"
            className="text-primary pr-0"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div> */}

        <div className="p-2 space-y-2 h-[200px] overflow-scroll">
          {/* <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              className="rounded-none"
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
            />
            <label
              htmlFor="select-all"
              className=" text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Select All
            </label>
          </div> */}
          {data.map((item) => (
            <div key={item.code} className="flex items-center space-x-2">
              <Checkbox
                id={item.code}
                className="rounded-none"
                checked={selectedStatuses.includes(item.code)}
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
}