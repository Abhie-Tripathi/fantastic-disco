"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";
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
import { Search, X } from "lucide-react";
import { useFilterContext } from "@/context/filterContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCoordinateService } from "@/services/coordinateService";
import { enquiryType } from "@/types/coordinateEventType";
import { formattedDateRange } from "@/utils/date";
import { formatLocationParts } from "@/utils/locationFormat";

interface Props {
  selectedData: enquiryType;
}

export default function MultiSelectSearchBar({ selectedData }: Props) {
  const router = useRouter();
  const pathName = usePathname();
  const { getLocalFilterValue, localFilters } = useFilterContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<enquiryType[]>([]);
  const [selectedItems, setSelectedItems] = useState<enquiryType[]>([]);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const { getEvents, isLoading } = useCoordinateService();

  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      if (value) {
        try {
          const response = await getEvents(value);
          const filteredResults =
            (response?.enquiries as enquiryType[])?.filter(
              (enquiry) =>
                !selectedItems.some((item) => item.eventId === enquiry.eventId)
            ) || [];
          setSearchResults(filteredResults);
        } catch (err) {
          console.error("Error fetching search results:", err);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    }, 300),
    [selectedItems]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      setOpen(true);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const handleSearchSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setOpen(false);
    },
    [selectedItems]
  );

  const handleItemSelect = useCallback(
    (item: enquiryType) => {
      setSelectedItems((prev) => {
        const newSelectedItems = [item];
        const eventIds = newSelectedItems
          .map((event) => event.eventId)
          .join(",");

        const newParams = new URLSearchParams();
        if (eventIds) {
          newParams.set("eventId", eventIds);
        }

        router.push(`/internal/coordinate?${newParams.toString()}`);

        return newSelectedItems;
      });
      setSearchTerm("");
      setSearchResults([]);
    },
    [router]
  );

  const handleRemoveItem = useCallback(
    (itemToRemove: enquiryType) => {
      setSelectedItems((prev) => {
        const newSelectedItems = prev.filter(
          (item) => item.eventId !== itemToRemove.eventId
        );
        const eventIds = newSelectedItems
          .map((event) => event.eventId)
          .join(",");

        const newParams = new URLSearchParams();
        if (newSelectedItems.length > 0) {
          newParams.set("eventId", eventIds);
        }

        router.push(`?${newParams.toString()}`);

        return newSelectedItems;
      });
    },
    [router]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  useEffect(() => {
    const eventIdsString = getLocalFilterValue("eventId");

    if (eventIdsString) {
      const eventIds = eventIdsString.split(",");
      setSelectedItems([selectedData]);
    }
  }, [pathName]);

  return (
    <form onSubmit={handleSearchSubmit} className="w-full">
      <div ref={searchBarRef} className="relative">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="flex items-center flex-wrap bg-background rounded-md shadow-sm border p-0.5">
              <Search className="ml-2 text-gray-400" />
              {selectedItems.length > 0 ? (
                selectedItems.map((item) => (
                  <div
                    key={item.eventId}
                    className="flex items-center bg-gray-200 rounded-full px-3 py-1 m-1 max-w-[70%]"
                  >
                    <span className="text-sm line-clamp-1">
                      {item.eventData.name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        handleRemoveItem(item);
                        e.preventDefault();
                      }}
                      className="ml-2 focus:outline-none"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex-grow flex items-center">
                  <Input
                    type="text"
                    placeholder={selectedItems.length ? "" : "Search Events"}
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-2 pr-4 w-full border-none focus:ring-0 text-base shadow-none"
                  />
                </div>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="p-0 w-[var(--radix-popover-trigger-width)] mt-1 border-none shadow-lg"
            align="start"
          >
            <Command shouldFilter={false}>
              <CommandInput
                value={searchTerm}
                onValueChange={handleSearchChange}
              />
              <CommandEmpty>
                {isLoading ? "Searching..." : "No results found."}
              </CommandEmpty>
              {/* {error && (
                <div className="p-2 text-red-500">Error: {error.message}</div>
              )} */}
              <CommandGroup>
                <CommandList>
                  {searchResults.map((event, index) => (
                    <CommandItem
                      key={event.eventId || index}
                      onSelect={() => handleItemSelect(event)}
                      className="flex flex-col items-start"
                    >
                      <div className="font-medium">
                        <span>{event.eventData.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {formattedDateRange(
                            event.eventData.startDateTime,
                            event.eventData.endDateTime,
                            false
                          )}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatLocationParts(event.eventData.eventLocation, true)}
                      </div>
                    </CommandItem>
                  ))}
                </CommandList>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </form>
  );
}
