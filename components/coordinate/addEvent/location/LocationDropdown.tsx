import React, { useCallback, useEffect, useState } from "react";
import styles from "./locationdropdown.style.module.css";
import { baseUrl } from "@/constants";
import { AddEventFormState } from "@/types/Formstate";
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
import CitySelector from "./CitySelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LocationSuggestion {
  id: string;
  name: string;
  state: string;
  city: string;
  countryName: string;
  lat: string;
  long: string;
}

interface Props {
  formState: AddEventFormState;
  handleChange: (field: keyof AddEventFormState, value: any) => void;
  // setCityName: (value: string) => void
  // setCountryName: (value: string) => void
  // setEventFormat: (value: string) => void;
  // eventFormat: string;
  // setLongitude: (value: number) => void;
  // setLatitude: (value: number) => void;
  theme?: string;
  // setQuery:(value: string) => void;
  // query:string;
  // setIsEventFormatEmpty:(value: boolean) => void;
}
// const libraries: Libraries = ['places'];

const LocationDropdown = ({
  theme,
  formState,
  handleChange,
}: //  setCountryName, setEventFormat, eventFormat, setLongitude, setLatitude, theme, query, setQuery,setIsEventFormatEmpty
Props) => {
  // const { isLoaded } = useLoadScript({
  //     googleMapsApiKey: "AIzaSyA95UNMdJgIwc6swo_eM5YNE-uifyAn2a8",
  //     libraries,
  // });

  // const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

  const [open, setOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("city");

  //   const handleSuggestionClick = async (suggestion: LocationSuggestion) => {
  //     const locationParts = [];
  //     // Add 'name' only if it is different from 'city', 'state', and 'country'
  //     if (
  //       suggestion.name &&
  //       suggestion.name !== suggestion.city &&
  //       suggestion.name !== suggestion.state &&
  //       suggestion.name !== suggestion.countryName
  //     ) {
  //       locationParts.push(suggestion.name);
  //     }

  //     // Always add 'city' and 'state' if they are present
  //     if (suggestion.city) {
  //       locationParts.push(suggestion.city);
  //     }
  //     if (suggestion.state) {
  //       locationParts.push(suggestion.state);
  //     }
  //     handleChange("cityName", locationParts.join(", "));

  //     handleChange("countryName", suggestion.countryName);
  //     handleChange("latitude", Number(suggestion.lat));
  //     handleChange("longitude", Number(suggestion.long));
  //     // setCountryName(suggestion.countryName)
  //     // setLatitude(Number(suggestion.lat));
  //     // setLongitude(Number(suggestion.long));

  //     setIsDropdownVisible(false);
  //   };

  const shortenName = (name: string) => {
    return name.substring(0, 40);
  };

  const fetchSuggestions = async (query: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1`
      );
      const data = await response.json();
      const newSuggestions = data.map((location: any): LocationSuggestion => {
        const { place_id: id, name: name, lat, lon: long } = location;
        const { city, country: countryName, state } = location.address || {};

        const shortName = shortenName(name);
        return {
          id,
          name: shortName,
          state,
          countryName,
          city,
          lat,
          long,
        };
      });
      setSuggestions(newSuggestions);
      setIsDropdownVisible(true);
    } catch (error) {
      console.log(error);
    }
  };
  // Debounce the fetchSuggestions function
  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const databaseLocationResult = useDatabaseLocationcomplete(
    formState.query,
    "CITY"
  );

  const { predictions, isLoading, isError } = databaseLocationResult;
  // console.log("dbResult", dbResult);

  // Create a debounced version of the fetchSuggestions function
  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 500),
    []
  );

  useEffect(() => {
    if (formState.query.length > 0) {
      debouncedFetchSuggestions(formState.query);
    } else {
      setSuggestions([]);
      setIsDropdownVisible(false);
    }
  }, [formState.query, debouncedFetchSuggestions]);
  // if (!isLoaded) return <div>Loading...</div>;
  const handleInputChange = (val: string) => {
    handleChange("query", val);
    // handleChange("virtualLink",e.target.value)
    handleChange("isEventFormatEmpty", false);
    // setQuery(e.target.value);
    // setIsEventFormatEmpty(false)
  };
  const handleVirtualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange("virtualLink", e.target.value);
    handleChange("isEventFormatEmpty", false);
    // setQuery(e.target.value);
    // setIsEventFormatEmpty(false)
  };
  return (
    <div
      className={`${styles.body} ${
        theme && theme === "dark" ? styles.darkBody : ""
      }`}
    >
      <div className={styles.locationTypes}>
        <label className={styles.checkboxContainer}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={
              formState.eventFormat === "In-person" ||
              formState.eventFormat === "OFFLINE"
            }
            onChange={() => handleChange("eventFormat", "In-person")}
          />
          <span className={styles.customCheckbox}></span>
          <span className={styles.checkboxLabel}>In-person</span>
        </label>
        <label className={styles.checkboxContainer}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={
              formState.eventFormat === "Virtual" ||
              formState.eventFormat === "ONLINE"
            }
            onChange={() => handleChange("eventFormat", "Virtual")}
          />
          <span className={styles.customCheckbox}></span>
          <span className={styles.checkboxLabel}>Virtual</span>
        </label>
        <label className={styles.checkboxContainer}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={formState.eventFormat === "Hybrid"}
            onChange={() => handleChange("eventFormat", "Hybrid")}
          />
          <span className={styles.customCheckbox}></span>
          <span className={styles.checkboxLabel}>Hybrid</span>
        </label>
      </div>
      {(formState.eventFormat === "In-person" ||
        formState.eventFormat === "Hybrid" ||
        formState.eventFormat === "OFFLINE") && (
        // <div className="flex flex-col gap-2 pt-4">
        //   <CitySelector
        //   key={"city"}
        //     formState={formState}
        //     handleChange={handleChange}
        //     locationType={"VENUE"}
        //   />

        //   <span className="text-center text-xs text-[var(--tertiary-text-color)]">
        //     OR
        //   </span>

        //   <CitySelector
        //   key={"venue"}
        //     formState={formState}
        //     handleChange={handleChange}
        //     locationType={"CITY"}
        //   />
        // </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full pt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="city">Search by City</TabsTrigger>
            <TabsTrigger value="venue">Search by Venue</TabsTrigger>
          </TabsList>
          <TabsContent value="venue" className="py-1">
            <CitySelector
              formState={formState}
              handleChange={handleChange}
              locationType={"VENUE"}
            />
          </TabsContent>
          <TabsContent value="city" className="py-1">
            <CitySelector
              formState={formState}
              handleChange={handleChange}
              locationType={"CITY"}
            />
          </TabsContent>
        </Tabs>
      )}

      {(formState.eventFormat === "Virtual" ||
        formState.eventFormat === "Hybrid" ||
        formState.eventFormat === "ONLINE") && (
        <div className={styles.inputLinkContainer}>
          <input
            type="text"
            placeholder="Enter Virtual Link"
            onChange={(e) => handleVirtualInputChange(e)}
          />
          <div>
            <span className={styles.infoBtn}>i</span>
            <span className={styles.info}>
              If you have a virtual event link, you can enter or paste it above
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationDropdown;
