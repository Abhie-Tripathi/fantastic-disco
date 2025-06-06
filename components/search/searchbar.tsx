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
import { useEventsService } from "@/services/eventsService";
import { Event } from "@/types/events";
import { useFilterContext } from "@/context/filterContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formattedDateRange } from "@/utils/date";
import { formatLocationParts } from "@/utils/locationFormat";

interface MultiSelectSearchBar {
  varient?: "small" | "medium" | "large";
}

export default function MultiSelectSearchBar({varient = "medium"}:MultiSelectSearchBar) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { getLocalFilterValue, localFilters } = useFilterContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [selectedItems, setSelectedItems] = useState<Event[]>([]);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { getEvents, isLoading } = useEventsService();
  const isDashboard = pathName == "/internal";

  useEffect(() => {
    const fetchEventDetails = async (eventIds: string[]) => {
      const eventPromises = eventIds.map((id) =>
        getEvents({ eventIds: id }).then((response) => response?.events[0])
      );
      try {
        const events = await Promise.all(eventPromises);
        setSelectedItems(events as unknown as Event[]);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    const eventIdsString = getLocalFilterValue("eventIds");
    if (!isDashboard && eventIdsString) {
      const eventIds = eventIdsString.split(",");
      fetchEventDetails(eventIds);
    }
  }, [localFilters]);

  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      if (value) {
        try {
          // Cancel any ongoing request
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
          }

          // Create new AbortController for this request
          abortControllerRef.current = new AbortController();

          const response = await getEvents(
            {
              query: value,
            },
            abortControllerRef.current.signal
          );

          const filteredResults =
            (response?.events as Event[])?.filter(
              (event) =>
                !selectedItems.some((item) => item.basic.id === event.basic.id)
            ) || [];
          setSearchResults(filteredResults);
        } catch (err) {
          // Only log error if it's not an abort error
          if (err instanceof Error && err.name !== "AbortError") {
            console.error("Error fetching search results:", err);
          }
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
    (item: Event) => {
      setSelectedItems((prev) => {
        const newSelectedItems = [...prev, item];
        const eventIds = newSelectedItems
          .map((event) => event.basic.id)
          .join(",");

        const newParams = new URLSearchParams();
        if (eventIds) {
          newParams.set("eventIds", eventIds);
        }

        router.push(`/internal/search/events?${newParams.toString()}`);

        return newSelectedItems;
      });
      setSearchTerm("");
      setSearchResults([]);
    },
    [router]
  );

  const handleRemoveItem = useCallback(
    (itemToRemove: Event) => {
      setSelectedItems((prev) => {
        const newSelectedItems = prev.filter(
          (item) => item.basic.id !== itemToRemove.basic.id
        );
        const eventIds = newSelectedItems
          .map((event) => event.basic.id)
          .join(",");

        const newParams = new URLSearchParams();
        if (newSelectedItems.length > 0) {
          newParams.set("eventIds", eventIds);
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
      // Cancel any pending request when component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <form onSubmit={handleSearchSubmit} className="w-full">
      <div ref={searchBarRef} className="relative">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div
              className={`flex items-center flex-wrap bg-background rounded-md shadow-sm border ${
                isDashboard ? "p-2" : "p-0"
              }`}
            >
              <Search
                className={`ml-2 text-gray-400 ${isDashboard ? "" : "w-4 h-4"} ${
                  varient === "small" ? "w-3 h-3" : 
                  varient === "large" ? "w-5 h-5" : 
                  "w-4 h-4"
                }`}
              />
              {selectedItems.map((item) => (
                <div
                  key={item.basic.id}
                  className={`flex items-center bg-gray-200 rounded-full px-3 py-1 m-1 ${
                    varient === "small" ? "text-xs" :
                    varient === "large" ? "text-base" :
                    "text-sm"
                  }`}
                >
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {item.basic.name}
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
              ))}
              <div className="flex-grow flex items-center">
                <Input
                  type="text"
                  placeholder={selectedItems.length ? "" : "Search Events"}
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className={`pl-2 py-0 pr-4 w-full border-none focus:ring-0 shadow-none ${
                    isDashboard ? "text-base" : "text-sm"
                  } ${
                    varient === "small" ? "text-xs h-7" :
                    varient === "large" ? "text-lg h-11" :
                    "text-sm h-9"
                  }`}
                />
              </div>
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
                      key={event.basic.id || index}
                      onSelect={() => handleItemSelect(event)}
                      className="flex flex-col items-start"
                    >
                      <div className="font-medium">
                        <span>{event.basic.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {formattedDateRange(
                            event.basic.startDateTime,
                            event.basic.endDateTime,
                            false
                          )}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatLocationParts(event.basic.eventLocation, true)}
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
