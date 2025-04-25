"use client";

import {
  useState,
  useCallback,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { Search, Loader2, X } from "lucide-react";
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
import {
  useNominatimAutocomplete,
  useDatabaseLocationcomplete,
} from "@/hooks/useLocationAutocomplete";
import { useLocationService } from "@/services/locationService";

interface Location {
  id: string;
  description: string;
}

interface AutocompleteInputProps {
  type: "SavedLocations" | "LocationId" | "GeoCoordinate";
  defaultOpen?: boolean;
  placeholder: string;
  onSelect: (location: any) => void;
  isOpen?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  multiple?: boolean;
  value?: Location[] | Location | null;
  setApplyHandlerCalled?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AutocompleteInput({
  type,
  defaultOpen,
  placeholder,
  onSelect,
  isOpen,
  setIsOpen,
  multiple = false,
  value,
  setApplyHandlerCalled,
}: AutocompleteInputProps) {
  const { getCoordinates } = useLocationService();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const databaseLocationResult = useDatabaseLocationcomplete(
    type == "LocationId" ? inputValue : ""
  );
  const nominatimResult = useDatabaseLocationcomplete(
    type == "GeoCoordinate" ? inputValue : "",
    "VENUE"
  );

  const { predictions, isLoading, isError } =
    type === "LocationId" ? databaseLocationResult : nominatimResult;
  useEffect(() => {
    if (isOpen) {
      setOpen(isOpen);
    }
  }, [isOpen]);
  useEffect(() => {
    if (value) {
      if (Array.isArray(value)) {
        setSelectedLocations(value);
      } else if (typeof value === "object" && value !== null) {
        setSelectedLocations([value]);
      }
    } else {
      setSelectedLocations([]);
    }
  }, [value]);

  const handleSelect = useCallback(
    async (prediction: any) => {
      const newLocation = {
        id: prediction.id,
        description: prediction.displayName,
      };
      if (multiple) {
        let updatedLocations;
        if (
          selectedLocations.some((location) => location.id === newLocation.id)
        ) {
          return;
        }
        updatedLocations = [...selectedLocations, newLocation];
        setSelectedLocations(updatedLocations);
        setInputValue("");
        onSelect(updatedLocations);
      } else {
        setSelectedLocations([newLocation]);
        setInputValue(prediction.displayName);
        setOpen(false);
        onSelect([newLocation]);
      }

      if (type === "GeoCoordinate") {
        onSelect({
          description: prediction.displayName,
          lat: prediction.latitude,
          lng: prediction.longitude,
          radius: 5,
        });
      }
      setApplyHandlerCalled?.(true);
    },
    [multiple, type, getCoordinates, onSelect, selectedLocations]
  );

  const handleRemove = useCallback(
    (locationToRemove: Location) => {
      const updatedLocations = selectedLocations.filter(
        (location) => location.id !== locationToRemove.id
      );
      setSelectedLocations(updatedLocations);
      onSelect(updatedLocations);
    },
    [selectedLocations, onSelect]
  );

  return (
    <Popover
      open={defaultOpen || open}
      onOpenChange={(open) => {
        setOpen(open);
        if (setIsOpen) {
          setIsOpen(open);
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full h-auto justify-between"
        >
          <div className="flex flex-wrap gap-1 items-center truncate">
            {multiple && selectedLocations.length > 0 ? (
              selectedLocations.map((location) => (
                <Badge key={location.id} variant="secondary">
                  <div className="flex items-center max-w-full">
                    <span className="truncate max-w-[200px]">
                      {location.description}
                    </span>
                    <div
                      role="button"
                      tabIndex={0}
                      className="ml-1 flex-shrink-0 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRemove(location);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => handleRemove(location)}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </div>
                  </div>
                </Badge>
              ))
            ) : selectedLocations.length === 1 ? (
              <span>{selectedLocations[0].description}</span>
            ) : (
              <span className="text-[#7d7d7d]">{placeholder}</span>
            )}
          </div>
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandEmpty>
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2">Searching...</span>
              </div>
            ) : isError ? (
              "Error fetching locations."
            ) : (
              "No locations found."
            )}
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {predictions.map((prediction: any) => {
                const city = prediction.name;
                const placeId = prediction.id;
                const state = prediction.state?.name;
                const country = prediction.country?.name;
                return (
                  <CommandItem
                    key={placeId}
                    onSelect={() => handleSelect(prediction)}
                    className="flex flex-col items-start"
                  >
                    <span className="font-medium">{city}</span>
                    <span className="text-sm text-muted-foreground">
                      {state && `${state}, `}
                      {country}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
