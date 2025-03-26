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
import { ChevronDown, Search, X } from "lucide-react";
import { useEventsService } from "@/services/eventsService";
import { Event } from "@/types/events";
import { useFilterContext } from "@/context/filterContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

interface MultiSelectSearchBarProps {
  trigger?: React.ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

export default function MultiSelectSearchBar({
  trigger,
  className = "",
  align = "start",
  sideOffset = 4,
}: MultiSelectSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getLocalFilterValue, localFilters } = useFilterContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [selectedItems, setSelectedItems] = useState<Event[]>([]);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { getEvents, isLoading } = useEventsService();

  useEffect(() => {
    const fetchEventDetails = async (eventIds: string[]) => {
      const eventPromises = eventIds.map((id) =>
        getEvents({ eventIds: id }).then((response) => response?.events[0])
      );
      try {
        const events = await Promise.all(eventPromises);
        console.log(events);
        setSelectedItems(events as unknown as Event[]);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    const eventIdsString = getLocalFilterValue("eventIds");
    if (eventIdsString) {
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
      console.log("Selected items:", selectedItems);
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

  // Create a default trigger if none is provided
  const defaultTrigger = (
    <div className="flex items-center flex-wrap bg-background rounded-md shadow-sm border p-2">
      <Search className="ml-2 text-gray-400" />
      {selectedItems.map((item) => (
        <div
          key={item.basic.id}
          className="flex items-center bg-gray-200 rounded-full px-3 py-1 m-1"
        >
          <span className="text-sm">{item.basic.name}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveItem(item);
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
          className="pl-2 pr-4 w-full border-none focus:ring-0 text-base shadow-none"
        />
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSearchSubmit} className={`w-full ${className}`}>
      <div ref={searchBarRef} className="relative">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between px-3 py-5 text-base font-normal"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <span className="mr-2">Search Events</span>
                  {selectedItems.length > 0 && (
                    <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                      {selectedItems.length}
                    </span>
                  )}
                </div>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="p-0 w-[var(--radix-popover-trigger-width)] border-none shadow-lg"
            align={align}
            sideOffset={sideOffset}
          >
            {selectedItems.length > 0 && (
              <div className="flex items-center flex-wrap gap-2 w-full p-2">
                {selectedItems.map((item) => (
                  <div
                    key={item.basic.id}
                    className="flex items-center bg-gray-200 rounded-full px-3 py-1"
                  >
                    <span className="text-xs">{item.basic.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(item);
                      }}
                      className="ml-2 focus:outline-none"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <Command shouldFilter={false}>
              <CommandInput
                value={searchTerm}
                onValueChange={handleSearchChange}
                placeholder="Search events..."
              />
              <CommandEmpty>
                {isLoading ? "Searching..." : "No results found."}
              </CommandEmpty>
              <CommandGroup>
                <CommandList>
                  {searchResults.map((event, index) => (
                    <CommandItem
                      key={event.basic.id || index}
                      onSelect={() => handleItemSelect(event)}
                    >
                      {event.basic.name}
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
