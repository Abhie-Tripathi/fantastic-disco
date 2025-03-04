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
import { useRouter } from "next/navigation";

export default function MultiSelectSearchBar() {
  const router = useRouter();
  const { getLocalFilterValue } = useFilterContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [selectedItems, setSelectedItems] = useState<Event[]>([]);
  const searchBarRef = useRef<HTMLDivElement>(null);
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
  }, []);

  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      if (value) {
        try {
          const response = await getEvents({ query: value });
          const filteredResults =
            (response?.events as Event[])?.filter(
              (event) =>
                !selectedItems.some((item) => item.basic.id === event.basic.id)
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

        router.push(`?${newParams.toString()}`);

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

        // Create a new URLSearchParams object
        const newParams = new URLSearchParams();
        if (newSelectedItems.length > 0) {
          newParams.set("eventIds", eventIds);
        }

        // Update the URL with the new search params
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

  return (
    <form onSubmit={handleSearchSubmit} className="w-full">
      <div ref={searchBarRef} className="relative">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="flex items-center flex-wrap bg-white rounded-md shadow-sm border border-[#EBEBEB] p-2">
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
                  className="pl-2 pr-4 w-full border-none focus:ring-0 text-base"
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
