"use client";

import type React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X, Loader2, ChevronDown } from "lucide-react";
import { useEventsService } from "@/services/eventsService";
import type { Event } from "@/types/events";
import { useFilterContext } from "@/context/filterContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formattedDateRange } from "@/utils/date";
import { formatLocationParts } from "@/utils/locationFormat";

interface MultiSelectSearchBar {
  varient?: "small" | "medium" | "large";
}

export default function MultiSelectSearchBar({
  varient = "medium",
}: MultiSelectSearchBar) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { getLocalFilterValue, localFilters } = useFilterContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [selectedItems, setSelectedItems] = useState<Event[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const searchBarRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  const { getEvents, isLoading } = useEventsService();
  const isDashboard = pathName == "/internal";

  // Debounced search effect
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm]);

  // Fetch search results when debounced term changes
  useEffect(() => {
    const fetchSearchResults = async (value: string) => {
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
              view: "suggestion",
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
    };

    fetchSearchResults(debouncedSearchTerm);
  }, [debouncedSearchTerm, selectedItems]);

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

  // Reset highlighted index when search results change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchResults]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setOpen(value.length > 0);
    setHighlightedIndex(-1);
  }, []);

  const handleSearchSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      // Select highlighted item if available
      if (highlightedIndex >= 0 && searchResults[highlightedIndex]) {
        handleItemSelect(searchResults[highlightedIndex]);
      }
      setOpen(false);
    },
    [highlightedIndex, searchResults]
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
      setOpen(false);
      setHighlightedIndex(-1);

      // Refocus input for continued searching
      setTimeout(() => inputRef.current?.focus(), 0);
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

      // Refocus input after removing item
      setTimeout(() => inputRef.current?.focus(), 0);
    },
    [router]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open && e.key !== "ArrowDown" && e.key !== "Enter") return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (!open && searchTerm.length > 0) {
            setOpen(true);
          } else {
            setHighlightedIndex((prev) =>
              prev < searchResults.length - 1 ? prev + 1 : prev
            );
          }
          break;

        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;

        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && searchResults[highlightedIndex]) {
            handleItemSelect(searchResults[highlightedIndex]);
          }
          break;

        case "Escape":
          e.preventDefault();
          setOpen(false);
          setHighlightedIndex(-1);
          inputRef.current?.blur();
          break;

        case "Tab":
          setOpen(false);
          setHighlightedIndex(-1);
          break;

        case "Backspace":
          if (searchTerm === "" && selectedItems.length > 0) {
            e.preventDefault();
            const lastItem = selectedItems[selectedItems.length - 1];
            handleRemoveItem(lastItem);
          }
          break;
      }
    },
    [
      open,
      highlightedIndex,
      searchResults,
      handleItemSelect,
      searchTerm,
      selectedItems,
      handleRemoveItem,
    ]
  );

  const handleFocus = () => {
    if (searchTerm.length > 0) {
      setOpen(true);
    }
  };

  useEffect(() => {
    return () => {
      // Cancel any pending request when component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <form onSubmit={handleSearchSubmit} className="w-full">
      <div ref={containerRef} className="relative">
        <div
          ref={searchBarRef}
          className={`flex items-center flex-wrap bg-background rounded-md shadow-sm border ${
            isDashboard ? "p-2" : "p-0"
          }`}
        >
          <Search
            className={`ml-2 text-gray-400 flex-shrink-0 ${
              isDashboard ? "" : "w-4 h-4"
            } ${
              varient === "small"
                ? "w-3 h-3"
                : varient === "large"
                ? "w-5 h-5"
                : "w-4 h-4"
            }`}
          />

          {selectedItems.map((item) => (
            <div
              key={item.basic.id}
              className={`flex items-center bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 m-1 ${
                varient === "small"
                  ? "text-xs"
                  : varient === "large"
                  ? "text-base"
                  : "text-sm"
              }`}
            >
              <span className="text-sm text-gray-900 dark:text-gray-100 truncate max-w-[150px]">
                {item.basic.name}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveItem(item);
                }}
                className="ml-2 focus:outline-none hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-0.5"
                tabIndex={-1}
              >
                <X size={12} />
              </button>
            </div>
          ))}

          <div className="flex-grow flex items-center min-w-[120px]">
            <Input
              ref={inputRef}
              type="text"
              placeholder={selectedItems.length ? "" : "Search Events"}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              className={`pl-2 py-0 pr-4 w-full border-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 shadow-none ${
                isDashboard ? "text-base" : "text-sm"
              } ${
                varient === "small"
                  ? "text-xs h-7"
                  : varient === "large"
                  ? "text-lg h-11"
                  : "text-sm h-9"
              }`}
              autoComplete="off"
              role="combobox"
              aria-expanded={open}
              aria-haspopup="listbox"
              aria-autocomplete="list"
              aria-activedescendant={
                highlightedIndex >= 0
                  ? `event-option-${highlightedIndex}`
                  : undefined
              }
            />
          </div>
        </div>

        {open && (
          <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-4 py-8 text-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-[var(--secondary-text-color)]">Searching...</span>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-4 py-8 text-center text-sm text-[var(--secondary-text-color)]">
                {searchTerm.trim() === ""
                  ? "Type to search events..."
                  : "No events found."}
              </div>
            ) : (
              <ul ref={listRef} role="listbox" className="py-1">
                {searchResults.map((event, index) => {
                  const isHighlighted = index === highlightedIndex;

                  return (
                    <li
                      key={event.basic.id || index}
                      id={`event-option-${index}`}
                      role="option"
                      aria-selected={isHighlighted}
                      className={`px-2 py-1.5 cursor-pointer flex flex-col items-start transition-colors ${
                        isHighlighted
                          ? "bg-accent"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleItemSelect(event)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <div className="font-medium text-sm">
                        <span>{event.basic.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {formattedDateRange(
                            event.basic.startDateTime,
                            event.basic.endDateTime,
                            false
                          )}
                        </span>
                      </div>
                        <div className="text-sm text-gray-500">
                        {formatLocationParts(event.basic.eventLocation, true)}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
