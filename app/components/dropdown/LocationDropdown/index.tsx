"use client";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import styles from "./locationDropdown.module.css";
// import { LocationType } from "@/types/location";
import Image from "next/image";
import SearchIcon from "/public/location_search.svg";
import AddIcon from "/public/add.svg";
import CloseIcon from "/public/close.svg";
// import MapPlaceId from "/public/map-placeid.png";
// import MapRadius from "/public/map-radius.png";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
import { useTheme } from "@/context";

const searchResults = [
  {
    location_title: "London",
    location_description: "United Kingdom (2mi radius)",
  },
  {
    location_title: "New York",
    location_description: "New York, United States, (1.34mi radius)",
  },
  {
    location_title: "Chicago",
    location_description: "USA (2mi radius)",
  },
];

interface SelectedLocation {
  [id: string]: string,
}

interface LocationDropdown {
  className?: string;
  dropdownRef?: React.MutableRefObject<null>;
  state: string[];
  setState: ([]: string[]) => void;
  onClose: () => void;
  selectedCity?: {[id: string]: string};
  setSelectedCity?: React.Dispatch<React.SetStateAction<SelectedLocation>>;
  selectedCountry?: {[id: string]: string};
  setSelectedCountry?: React.Dispatch<React.SetStateAction<SelectedLocation>>;
}

const LocationDropdown = ({
  className,
  state,
  setState,
  onClose,
  selectedCity,
  setSelectedCity,
  selectedCountry,
  setSelectedCountry,
}: LocationDropdown) => {
  const menuNode = useRef(null);
  const {theme} = useTheme()
  const [checkedValues, setCheckedValues] = useState<string[]>([]);
  // const [addLocationModal, setAddLocationModal] = useState(false);
  // const [locationType, setLocationType] = useState("");
  // const [activeTab, setActiveTab] = useState("Saved Location");
  const [cityData, setCityData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [countryData, setCountryData] = useState([]);

  const [inputText, setInputText] = useState("");
  const [selectedLocation, setSelectedLocations] = useState<string[]>(state);

  useEffect(() => {
    setState(selectedLocation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation]);

  const inputChangeHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputText(newValue);
  
    try {
      const [suggestionResponse, countryResponse] = await Promise.all([
        myFetch(`${baseUrl}/location/suggestion?q=${newValue}`),
        myFetch(`${baseUrl}/location/country?name=${newValue}`),
      ]);
  
      setCityData(suggestionResponse.data.city);
      setStateData(suggestionResponse.data.state);
      setCountryData(countryResponse.data);
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const locationSelectHandler = (arg1: string, arg2?: string) => {
    let name;

    if (arg2 === undefined) {
      name = arg1;
    } else {
      name = `${arg1}, ${arg2}`;
    }
    if (!selectedLocation.includes(name)) {
      setSelectedLocations((prev) => [...prev, name]);
    }
    setState(selectedLocation);
  };

  const removeSelectionHandler = (name: string) => {
    setSelectedLocations((prev) => prev.filter((item) => item !== name));
  };

  const addLocationHandler = (type: string, id: string, name: string) => {
    if (type === 'city' && setSelectedCity) {
      setSelectedCity((prev) => ({...prev, [id]: name }));  
    }
    else if(type === 'country' && setSelectedCountry) {
      setSelectedCountry((prev) => ({...prev, [id]: name }));
    }
  }

  const removeLocationHandler = (type: string, id: string) => {
    if(type === 'city' && setSelectedCity && selectedCity){
      const entries = Object.entries(selectedCity).filter(([key]) => key!== id);
      setSelectedCity(Object.fromEntries(entries));
    }
    else if(type === 'country' && setSelectedCountry && selectedCountry){
      const entries = Object.entries(selectedCountry).filter(([key]) => key!== id);
      setSelectedCountry(Object.fromEntries(entries));
    }
  };
console.log(selectedCity);
console.log(selectedCountry);

  return (
    <div>
      <div className={`${styles.container} ${className}`} style={{background: theme==="light"?"white":""}}>
        <div className={styles.keywords_container}>
          {/* {selectedLocation.length > 0 &&
            selectedLocation.map((data, index) => (
              <div className={styles.keyword_chip} key={0}>
                <span>{data}</span>
                <Image
                  src={CloseIcon}
                  width={20}
                  height={20}
                  alt="close"
                  className={styles.closeChip}
                  onClick={() => removeSelectionHandler(data)}
                />
              </div>
            ))} */}
            { (selectedCountry && Object.entries(selectedCountry).length > 0) &&
              Object.entries(selectedCountry).map(([id, name]) => (
                <div className={styles.keyword_chip} key={id}>
                  <span>{name}</span>
                  <Image
                    src={CloseIcon}
                    width={20}
                    height={20}
                    alt="close"
                    className={styles.closeChip}
                    onClick={() => {
                      removeLocationHandler('country', id)
                      removeSelectionHandler(name)
                    }}
                  />
                </div>
              ))
            }
            { (selectedCity && Object.entries(selectedCity).length > 0) &&
              Object.entries(selectedCity).map(([id, name]) => (
                <div className={styles.keyword_chip} key={id}>
                  <span>{name}</span>
                  <Image
                    src={CloseIcon}
                    width={20}
                    height={20}
                    alt="close"
                    className={styles.closeChip}
                    onClick={() => {
                      removeLocationHandler('city', id)
                      removeSelectionHandler(name)
                    }}
                  />
                </div>
              ))
            }
        </div>
        <div className={styles.header}>
          <div className={styles.header_title}>LOCATIONS</div>

          <div className={styles.header_button} onClick={() => onClose()}>
            Done
          </div>
        </div>

        {/* <div className={styles.tabs_container}>
          <div
            className={`${styles.tab} ${
              activeTab == "Saved Location" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("Saved Location")}
          >
            Saved Locations
          </div>
          <div
            className={`${styles.tab} ${
              activeTab == "City, State, Country, etc." ? styles.active : ""
            }`}
            onClick={() => setActiveTab("City, State, Country, etc.")}
          >
            City, State, Country, etc.
          </div>
          <div
            className={`${styles.tab} ${
              activeTab == "Center Point & Radius" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("Center Point & Radius")}
          >
            Center Point & Radius
          </div>
        </div> */}

        {/* {activeTab == "Saved Location" && (
          <div className={styles.saved_locations}>
            <div className={styles.slider_container}>
              <label className={styles.slider_label}>
                <input type="checkbox" />
                <span className={styles.slider}></span>
              </label>
              <div className={styles.slider_title}>Show my locations only</div>
            </div>

            <div className={styles.input_container}>
              <Image src={SearchIcon} alt="searchicon" />
              <input
                placeholder="Search location name or tags"
                className={styles.location_input}
              />
            </div>

            <div className={styles.searchResults_container}>
              {searchResults.map((result) => (
                <div
                  key={result.location_title}
                  className={`${styles.searchResult} ${
                    state.includes(result.location_title) ? styles.active : ""
                  }`}
                  onClick={(e) => selectLocationHandler(e, result)}
                >
                  <div className={styles.searchResults_location_title}>
                    {result.location_title}
                  </div>
                  <div className={styles.searchResults_location_description}>
                    {result.location_description}
                  </div>
                </div>
              ))}
            </div>

            <div
              className={styles.add_location_button}
              onClick={() => setAddLocationModal(true)}
            >
              <Image src={AddIcon} alt="add" width={24} height={24} />
              <div>Add Locations</div>
            </div>
          </div>
        )} */}

        {/* {activeTab == "City, State, Country, etc." && ( */}
        <div className={styles.location_search_input}>
          <div className={styles.input_container} style={{background: theme==="light"?"#F7F7F9":""}} >
            <Image src={SearchIcon} alt="searchicon" />
            <input
              placeholder="Search For a Location"
              className={styles.location_input}
              onChange={inputChangeHandler}
            />
          </div>
        </div>

        {cityData.map((data: any) => (
          <div
            className={`${styles.resultData_list} ${theme === 'light' ? styles.resultData_list_light : ""}`}
            onClick={() => {
              locationSelectHandler(data.name, data.state)
              addLocationHandler('city', data.id, `${data.name}, ${data.state}`)
            }}
            key={data.id}
          >
            {data?.name}, {data?.state}
          </div>
        ))}

        {stateData.map((data: any) => (
          <div
            className={`${styles.resultData_list} ${theme === 'light' ? styles.resultData_list_light : ""}`}
            onClick={() => locationSelectHandler(data.state, data.country)}
            key={data.id}
          >
            {data?.state}, {data?.country}
          </div>
        ))}

        {countryData.map((data: any) => (
          <div
            className={`${styles.resultData_list} ${theme === 'light' ? styles.resultData_list_light : ""}`}
            onClick={() => {
              locationSelectHandler(data.name)
              addLocationHandler('country', data.id, data.name)
            }}
            key={data.id}
          >
            {data?.name}
          </div>
        ))}

        {/* {activeTab == "Center Point & Radius" && (
          <div className={styles.point_radius_input_container}>
            <input placeholder="Radius" />
            <input placeholder="Latitude" />
            <input placeholder="Longitude" />
          </div>
        )} */}
      </div>
      {/* {addLocationModal && (
        <div className={styles.addLocationModal_container}>
          <div className={styles.addLocationModal}>
            <div className={styles.addLocationModal_header}>
              <div className={styles.addLocationModal_header_title}>
                Add Location
              </div>
              <Image
                src={CloseIcon}
                alt="closeicon"
                onClick={() => setAddLocationModal(false)}
                className={styles.closeIcon}
              />
            </div>

            <div className={styles.location_type_container}>
              <div className={styles.location_type_title}>Location Type</div>

              <div className={styles.addLocationModal_options_container}>
                <label className={styles.addLocationModal_option}>
                  <input
                    type="radio"
                    className={styles.radio_button}
                    onChange={() => setLocationType("radius")}
                    checked={locationType == "radius"}
                  />
                  <div>
                    <div className={styles.addLocationModal_option_title}>
                      Street Address & Radius
                    </div>
                    <div className={styles.addLocationModal_option_example}>
                      e.g., stores, hotels, restaurants, or offices
                    </div>
                    <Image src={MapPlaceId} alt="mapplaceid" width={160} />
                  </div>
                </label>

                <label className={styles.addLocationModal_option}>
                  <input
                    type="radio"
                    className={styles.radio_button}
                    onChange={() => setLocationType("entireLocation")}
                    checked={locationType == "entireLocation"}
                  />
                  <div>
                    <div className={styles.addLocationModal_option_title}>
                      Entire City, State, Country, etc.
                    </div>
                    <div className={styles.addLocationModal_option_example}>
                      e.g., Seattle, California or United States
                    </div>
                    <Image src={MapRadius} alt="mapplaceid" width={160} />
                  </div>
                </label>
              </div>
              {
                <div className={styles.radius_location_form}>
                  <div className={styles.address_input_container}>
                    <Image src={SearchIcon} alt="searchicon" />
                    <input placeholder="Address or Business - e.g. Hilton Times Square" />
                  </div>
                  <div className={styles.radius_lat_long_container}>
                    <div className={styles.radius_input_container}>
                      <input
                        placeholder="Radius"
                        className={styles.radius_input}
                      />
                    </div>

                    <div className={styles.unit_input_container}>
                      <input placeholder="Unit" />
                    </div>

                    <div className={styles.lat_input_container}>
                      <input placeholder="Latitude" />
                    </div>

                    <div className={styles.lat_input_container}>
                      <input placeholder="Longitude" />
                    </div>
                  </div>

                  <div className={styles.location_tag_container}>
                    <div className={styles.locationName_container}>
                      <input placeholder="Location Name" />
                    </div>
                    <div className={styles.tags_container}>
                      <input placeholder="eg. tag 1, tag 2" />
                    </div>
                  </div>
                </div>
              }

              <div className={styles.saveLocation_button}>Save Location</div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default LocationDropdown;