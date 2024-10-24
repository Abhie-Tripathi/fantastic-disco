"use client";

import React, { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useMiscService } from "@/services/miscService";
import { useQuery } from "@tanstack/react-query";
import { Tags } from "@/types";
import { useFilterContext } from "@/context/filterContext";

const useLabelsAutocomplete = (input: string) => {
  const miscService = useMiscService();

  const { data, error, isLoading } = useQuery({
    queryKey: ["labels", input],
    queryFn: () => miscService.getLabelAutocomplete(input),
  });

  return {
    labels: data?.tags ?? [],
    isLoading,
    isError: !!error,
  };
};

export default function LabelsSelector() {
  const [open, setOpen] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<Tags[]>([]);
  const [search, setSearch] = useState("");
  const { setLocalFilter, getLocalFilterValue } = useFilterContext();
  const { labels, isLoading, isError } = useLabelsAutocomplete(search);

  const handleSelect = (label: Tags) => {
    setSelectedLabels((prev) => {
      const isSelected = prev.some((l) => l.id === label.id);
      if (isSelected) {
        return prev.filter((l) => l.id !== label.id);
      } else {
        return [...prev, label];
      }
    });
  };

  const handleApply = () => {
    setLocalFilter("tags", selectedLabels.map((l) => l.slug).join(","));
    setOpen(false);
  };

  const handleRemoveLabel = (labelId: string) => {
    setSelectedLabels((prev) => prev.filter((l) => l.id !== labelId));
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      handleApply();
    }
    setOpen(open);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-between px-3 py-5 text-base font-normal ${
            open ? "border-primary" : "border-input"
          }`}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-haspopup="true"
        >
          <div className="flex items-center">
            <span className="mr-2">Labels</span>
            {selectedLabels.length > 0 && (
              <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                {selectedLabels.length}
              </span>
            )}
          </div>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
              open ? "rotate-180 transform" : ""
            }`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-[240px] p-0">
        <div className="flex justify-between items-center p-4 py-2 border-b">
          <span className="font-medium">Labels</span>
          <Button
            variant="link"
            className="text-primary pr-0"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search Labels"
            onValueChange={(search) => setSearch(search)}
          />
          <CommandEmpty>No label found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {labels?.map((label: Tags) => (
                <CommandItem
                  key={label.id}
                  onSelect={() => handleSelect(label)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedLabels.some((l) => l.id === label.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {label.name}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
        {selectedLabels.length > 0 && (
          <div className="p-2 border-t">
            <div className="flex flex-wrap gap-1">
              {selectedLabels.map((label) => (
                <Badge key={label.id} variant="secondary" className="mr-1 mb-1">
                  {label.name}
                  <button
                    className="ml-1 hover:text-destructive"
                    onClick={() => handleRemoveLabel(label.id)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
