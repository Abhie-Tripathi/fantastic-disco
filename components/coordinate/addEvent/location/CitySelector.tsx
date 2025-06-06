import { useDatabaseLocationcomplete } from "@/hooks/useLocationAutocomplete";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Loader2, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { AddEventFormState } from "@/types/Formstate";
import { useEffect, useState } from "react";

interface Props {
  formState: AddEventFormState;
  handleChange: (field: keyof AddEventFormState, value: any) => void;
  locationType: "CITY" | "VENUE";
}

const CitySelector = ({ formState, handleChange, locationType }: Props) => {
  const [open, setOpen] = useState(false);

  const { predictions, isLoading, isError } = useDatabaseLocationcomplete(
    formState.query.trim(),
    locationType
  );

  const handleInputChange = (val: string) => {
    handleChange("query", val);
    handleChange("isEventFormatEmpty", false);
  };

  const handleSuggestionClick = (suggestion: any) => {
    handleChange("locationType", suggestion.locationType);
    handleChange("locationDisplayName", suggestion.displayName);

    if (suggestion.locationType === "VENUE") {
      handleChange("venueId", suggestion.id);
      handleChange("venueName", suggestion.name);
      handleChange("venueAddress", suggestion.displayName);
      handleChange("venueLatitude", suggestion.latitude);
      handleChange("venueLongitude", suggestion.longitude);
      handleChange("cityId", suggestion.city.id);
      handleChange("cityName", suggestion.city.name);
      handleChange("latitude", suggestion.city.latitude);
      handleChange("longitude", suggestion.city.longitude);
      handleChange("stateId", suggestion.state?.id);
      handleChange("stateName", suggestion.state?.name);
      handleChange("countryId", suggestion.country.id);
      handleChange("countryCode", suggestion.country.iso);
      handleChange("countryName", suggestion.country.name);
    } else if (suggestion.locationType === "CITY") {
      handleChange("venueId", "");
      handleChange("venueName", "");
      handleChange("venueAddress", "");
      handleChange("venueLatitude", "");
      handleChange("venueLongitude", "");
      handleChange("cityId", suggestion.id);
      handleChange("cityName", suggestion.name);
      handleChange("latitude", suggestion.latitude);
      handleChange("longitude", suggestion.longitude);
      handleChange("stateId", suggestion.state?.id);
      handleChange("stateName", suggestion.state?.name);
      handleChange("countryId", suggestion.country.id);
      handleChange("countryCode", suggestion.country.iso);
      handleChange("countryName", suggestion.country.name);
    }

    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
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
            <span className="text-[#7d7d7d]">
              Enter {locationType === "CITY" ? "City" : "Venue"}
            </span>
          </div>
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="E.g. Bengaluru, Karnataka"
            value={formState.query}
            onValueChange={handleInputChange}
          />
          <CommandEmpty>
            {formState.query && isLoading ? (
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
                    // onSelect={() => handleSelect(prediction)}
                    onSelect={() => handleSuggestionClick(prediction)}
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
};
export default CitySelector;
