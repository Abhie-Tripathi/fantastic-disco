import React, { useCallback, useEffect, useState } from 'react'
import styles from './locationdropdown.style.module.css'
import { baseUrl } from "@/constants";

interface LocationSuggestion {
    id: string;
    name: string;
    state: string;
    countryName: string;
    lat: string;
    long: string;
}

interface Props {
    setCityName: (value: string) => void
    setCountryName: (value: string) => void
    setEventFormat: (value: string) => void;
    eventFormat: string;
    setLongitude: (value: number) => void;
    setLatitude: (value: number) => void;
    theme?: string;
    setQuery:(value: string) => void;
    query:string;
    setIsEventFormatEmpty:(value: boolean) => void;
}
// const libraries: Libraries = ['places'];

const LocationDropdown = ({ setCityName, setCountryName, setEventFormat, eventFormat, setLongitude, setLatitude, theme, query, setQuery,setIsEventFormatEmpty }: Props) => {
    // const { isLoaded } = useLoadScript({
    //     googleMapsApiKey: "AIzaSyA95UNMdJgIwc6swo_eM5YNE-uifyAn2a8",
    //     libraries,
    // });

    // const [query, setQuery] = useState<string>("");
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

    const handleSuggestionClick = async (suggestion: LocationSuggestion) => {
        setCityName(suggestion.name);
        setCountryName(suggestion.countryName)
        setLatitude(Number(suggestion.lat));
        setLongitude(Number(suggestion.long));

        setIsDropdownVisible(false);

    }

    const shortenName = (name: string) => {
        return name.substring(0, 40);
    }

    const fetchSuggestions = async (query: string) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1`
            );
            const data = await response.json();
            const newSuggestions = data.map((location: any): LocationSuggestion => {
                const { place_id: id, display_name: name, lat, lon: long } = location;
                const { country: countryName, state } = location.address || {};

                const shortName = shortenName(name)
                return {
                    id,
                    name: shortName,
                    state,
                    countryName,
                    lat,
                    long,
                };
            });
            setSuggestions(newSuggestions);
            setIsDropdownVisible(true);
        } catch (error) {
            console.log(error)
        }
    }
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

    // Create a debounced version of the fetchSuggestions function
    const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 500), []);

    useEffect(() => {
        if (query.length > 0) {
            debouncedFetchSuggestions(query);
        } else {
            setSuggestions([]);
            setIsDropdownVisible(false);
        }
    }, [query, debouncedFetchSuggestions]);
    // if (!isLoaded) return <div>Loading...</div>;
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setIsEventFormatEmpty(false)
    }
    return (
        <div className={`${styles.body} ${theme && theme === "dark" ? styles.darkBody : ""}`}>
            <div className={styles.locationTypes}>
                <label className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={eventFormat === "In-person" || eventFormat === "OFFLINE"}
                        onChange={() => setEventFormat("In-person")}
                    />
                    <span className={styles.customCheckbox}></span>
                    <span className={styles.checkboxLabel}>In-person</span>
                </label>
                <label className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={eventFormat === "Virtual" || eventFormat === "ONLINE"}
                        onChange={() => setEventFormat("Virtual")}
                    />
                    <span className={styles.customCheckbox}></span>
                    <span className={styles.checkboxLabel}>Virtual</span>
                </label>
                <label className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={eventFormat === "Hybrid"}
                        onChange={() => setEventFormat("Hybrid")}
                    />
                    <span className={styles.customCheckbox}></span>
                    <span className={styles.checkboxLabel}>Hybrid</span>
                </label>
            </div>
            {(eventFormat === "In-person" || eventFormat === "Hybrid" || eventFormat === "OFFLINE") && <div className={styles.locationInputContainer}>
                <input type="text" placeholder='Enter Location' onChange={(e) => handleInputChange(e)} />
                {/* <div className={styles.recentHeading}>Recent Locations</div>
                <div className={styles.recentLocation}>
                    <LocationIcon /> <span className={styles.state}>Bengaluru</span><span className={styles.country}>India</span>
                </div> */}
                {isDropdownVisible && (
                    <div className={styles.locationDropdown}>
                        {suggestions.map(suggestion => (
                            <div
                                key={suggestion.id}
                                className={styles.suggestion}
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                <LocationIcon />
                                <span>{suggestion.name}</span>
                                {suggestion.state && <span>, {suggestion.state}</span>}
                                <span>, {suggestion.countryName}</span>
                            </div>
                        ))}
                    </div>
                )}

            </div>}
            {(eventFormat === "Virtual" || eventFormat === "Hybrid" || eventFormat === "ONLINE") &&
                <div className={styles.inputLinkContainer}>
                    <input type="text" placeholder='Enter Virtual Link' />
                    <div><span className={styles.infoBtn}>i</span><span className={styles.info}>If you have a virtual event link, you can enter or paste it above.</span></div>
                </div>}
        </div>
    )
}

export default LocationDropdown

function LocationIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" fill="#7D7D7D" /></svg>
    )
}