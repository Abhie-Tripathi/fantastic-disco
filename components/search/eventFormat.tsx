import * as React from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useFilterContext } from "@/context/filterContext";

const eventFormats = [
  { id: "online", label: "Online/Virtual" },
  { id: "offline", label: "Offline" },
  { id: "hybrid", label: "Hybrid" },
];

export default function EventFormatSelector() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { setLocalFilter, getLocalFilterValue, searchParams } =
    useFilterContext();
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([]);

  React.useEffect(() => {
    const currentFilter = getLocalFilterValue("eventFormats");
    setSelectedStatuses(currentFilter ? currentFilter.split(",") : []);
  }, [searchParams, getLocalFilterValue]);

  const selectedStatus = selectedStatuses.length;

  const handleStatusToggle = (statusId: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(statusId)
        ? prev.filter((id) => id !== statusId)
        : [...prev, statusId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedStatuses(
      checked ? eventFormats.map((eventFormat) => eventFormat.id) : []
    );
  };

  const isAllSelected = selectedStatuses.length === eventFormats.length;

  const handleApply = () => {
    setLocalFilter("eventFormats", selectedStatuses.join(","));
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
            <span className="mr-2">Event Format</span>
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
          <span className="font-medium">Event Format</span>
          <Button
            variant="link"
            className="text-primary pr-0"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div> */}

        <div className="p-2 space-y-2">
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
          {eventFormats.map((eventFormat) => (
            <div key={eventFormat.id} className="flex items-center space-x-2">
              <Checkbox
                id={eventFormat.id}
                className="rounded-none"
                checked={selectedStatuses.includes(eventFormat.id)}
                onCheckedChange={() => handleStatusToggle(eventFormat.id)}
              />
              <label
                htmlFor={eventFormat.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {eventFormat.label}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
