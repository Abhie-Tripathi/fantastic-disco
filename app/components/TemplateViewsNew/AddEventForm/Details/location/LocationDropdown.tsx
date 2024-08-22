import React, { useCallback, useEffect, useState } from 'react'
import styles from './locationdropdown.style.module.css'
import { baseUrl } from "@/constants";

interface LocationSuggestion {
    id: string;
    name: string;
    state?: string;
    countryName?: string;
}

interface Props {
    setCityName: (value: string) => void
    setCountryName: (value: string) => void
    setEventFormat: (value: string) => void;
    eventFormat: string;
    setLongitude: (value: number) => void;
    setLatitude: (value: number) => void;
}

const LocationDropdown = ({ setCityName, setCountryName, setEventFormat, eventFormat, setLongitude, setLatitude }: Props) => {
    const [query, setQuery] = useState<string>("");
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

    const handleSuggestionClick = async (suggestion: LocationSuggestion) => {
        setCityName(suggestion.name);
        if (suggestion.countryName) {
            setCountryName(suggestion.countryName);
        } else {
            setCountryName(suggestion.name);
        }
        setIsDropdownVisible(false);

        // Fetch latitude and longitude
        const locationName = suggestion.state ? `${suggestion.name}, ${suggestion.state}` : suggestion.name;
        const latLong = await getLatLong(locationName);

        if (latLong) {
            setLatitude(latLong.lat);
            setLongitude(latLong.lng);
        }
    }
    const getLatLong = async (address: string) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyA95UNMdJgIwc6swo_eM5YNE-uifyAn2a8`
            );
            const data = await response.json();

            if (data.status === "OK") {
                const location = data.results[0].geometry.location;
                return { lat: location.lat, lng: location.lng };
            } else {
                console.error("Geocoding API error:", data.status);
            }
        } catch (error) {
            console.error("Error fetching lat/long:", error);
        }
        return null;
    };
    const fetchSuggestions = async (query: string) => {
        try {
            const [locationResponse, countryResponse] = await Promise.all([
                fetch(`${baseUrl}/location/suggestion?q=${query}`),
                fetch(`${baseUrl}/location/country?name=${query}`)
            ]);

            const locationData = await locationResponse.json();
            const countryData = await countryResponse.json();

            const citySuggestions = locationData.data.city.map((city: any) => ({
                id: city.id,
                name: city.name,
                state: city.state,
                countryName: city.countryName
            }));
            const stateSuggestions = locationData.data.state.map((state: any) => ({
                id: state.id,
                name: state.name,
                countryName: state.countryName
            }));
            const countrySuggestions = countryData.data.map((country: any) => ({
                id: country.id,
                name: country.name,
                countryName: country.name
            }));
            setSuggestions([...citySuggestions, ...stateSuggestions, ...countrySuggestions]);
            setIsDropdownVisible(true);
        } catch (error) {
            console.error("Error fetching location suggestions:", error);
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

    return (
        <div className={styles.body}>
            <div className={styles.locationTypes}>
                <label className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={eventFormat === "In-person"}
                        onChange={() => setEventFormat("In-person")}
                    />
                    <span className={styles.customCheckbox}></span>
                    <span className={styles.checkboxLabel}>In-person</span>
                </label>
                <label className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={eventFormat === "Virtual"}
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
            {(eventFormat === "In-person" || eventFormat === "Hybrid") && <div className={styles.locationInputContainer}>
                <input type="text" placeholder='Enter Location' onChange={(e) => setQuery(e.target.value)} />
                <div className={styles.recentHeading}>Recent Locations</div>
                <div className={styles.recentLocation}>
                    <LocationIcon /> <span className={styles.state}>Bengaluru</span><span className={styles.country}>India</span>
                </div>
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
            {(eventFormat === "Virtual" || eventFormat === "Hybrid") &&
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