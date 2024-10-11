"use client";

import { useState, useCallback, useEffect } from "react";
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
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
// import {
//   useNominatimAutocomplete,
//   useSavedLocationAutocomplete,
//   useDatabaseLocationcomplete,
// } from "@/hooks/useLocationAutocomplete";
// import { useLocationService } from "@/services/locationService";

interface Location {
  id: string;
  description: string;
}

interface AutocompleteInputProps {
  type: "SavedLocations" | "LocationId" | "GeoCoordinate";
  placeholder: string;
  onSelect: (location: any) => void;
  multiple?: boolean;
  value?: Location[] | Location | null;
}

export default function AutocompleteInput({
  type,
  placeholder,
  onSelect,
  multiple = false,
  value,
}: AutocompleteInputProps) {
//   const { getCoordinates } = useLocationService();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
//   const savedLocationsResult = useSavedLocationAutocomplete(inputValue);
//   const databaseLocationResult = useDatabaseLocationcomplete(inputValue);
//   const nominatimResult = useNominatimAutocomplete(inputValue);

//   const { predictions, isLoading, isError } =
//     type === "SavedLocations"
//       ? savedLocationsResult
//       : type === "LocationId"
//       ? databaseLocationResult
//       : nominatimResult;
const [cityData, setCityData] = useState([]);
const [stateData, setStateData] = useState([]);
const [countryData, setCountryData] = useState([]);
const [zoneData, setZoneData] = useState([]);
const fetchSuggestions = async(text: string) => {
  try {
    const [suggestionResponse, countryResponse] = await Promise.all([
      myFetch(`${baseUrl}/location/suggestion?q=${text}`),
      myFetch(`${baseUrl}/location/country?name=${text}`),
    ]);

    setCityData(suggestionResponse.data.city);
    setStateData(suggestionResponse.data.state);
    setCountryData(countryResponse.data);
    setZoneData(suggestionResponse.data.zone);
  } catch (error) {
    console.error("Error fetching location data:", error);
  } finally {
    // setLocationSearchLoader(false);
  }
}
useEffect(()=>{
  if(inputValue.length>0)
  fetchSuggestions(inputValue);
else {
  setCityData([]);
  setCountryData([]);
  setZoneData([]);
}
},[inputValue])
  useEffect(() => {
    console.log(value);
    
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
    async (description: string, placeId: string) => {
      const newLocation = { id: placeId, description };
      if (multiple) {
        const updatedLocations = [...selectedLocations, newLocation];
        setSelectedLocations(updatedLocations);
        setInputValue("");
        onSelect(updatedLocations);
      } else {
        setSelectedLocations([newLocation]);
        setInputValue("");
        setOpen(false);
        onSelect(newLocation);
      }

    //   if (type === "GeoCoordinate") {
    //     // const location = await getCoordinates(placeId);
    //     onSelect({
    //       description: description,
    //       lat: location.lat,
    //       lng: location.lng,
    //       radius: 5,
    //     });
    //   }
    },
    [multiple, type, onSelect, selectedLocations, cityData]
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
  console.log(countryData)
  return (
    <Popover open={open} onOpenChange={setOpen}>
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
                  {location.description}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
                  </button>
                </Badge>
              ))
            ) : selectedLocations.length === 1 ? (
              <span>{selectedLocations[0].description}</span>
            ) : (
              <span>{placeholder}</span>
            )}
          </div>
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput
            placeholder={placeholder}
            value={inputValue}
            onValueChange={setInputValue}
          />
          {/* <CommandEmpty>
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
          </CommandEmpty> */}
          <CommandGroup>
            <CommandList>
  {cityData.map((data: any) => (
    <CommandItem key={data.id}>
      {data.name}
      {data.state && `, ${data.state}`}
      {data.countryName && `, ${data.countryName}`}
    </CommandItem>
  ))}
</CommandList>
            <CommandList>
          {countryData.map((data: any) => (
          <CommandItem
            key={data.id}
            onSelect={() => handleSelect(data.name, data.id)}
          >
            {data?.name}
          </CommandItem>
        ))}
        </CommandList>
        <CommandList>
        {zoneData.map((data: any) => (
          <CommandItem
          key={data.id}
          onSelect={()=> handleSelect(data.name, data.id)}
          >
          {data?.name}
          </CommandItem>
        ))}
        </CommandList>
            {/* <CommandList>
              {predictions?.map((prediction: any) => {
                const description =
                  type === "GeoCoordinate"
                    ? prediction.display_name
                    : type === "SavedLocations"
                    ? prediction.locationName
                    : prediction.displayName;
                const placeId =
                  type === "GeoCoordinate"
                    ? prediction.place_id
                    : type === "SavedLocations"
                    ? prediction.locationId
                    : prediction.id;
                return (
                  <CommandItem
                    key={placeId}
                    onSelect={() => handleSelect(description, placeId)}
                  >
                    {description}
                  </CommandItem>
                );
              })}
            </CommandList> */}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}