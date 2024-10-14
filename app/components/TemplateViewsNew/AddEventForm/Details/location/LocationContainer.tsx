'use client'
import React, { useState } from 'react'
import styles from './location.style.module.css'
import LocationDropdown from './LocationDropdown'
import useOutsideClick from '@/hooks/useOutsideClick'
import { FormState } from '@/types/Formstate'

interface Props{
    formTheme : string;
    formState: FormState;
    handleChange: (field: keyof FormState, value: any) => void;
    // setCityName: (value : string)=>void;
    // cityName : string;
    // setCountryName:(value : string)=>void;
    // countryName : string;
    // setEventFormat: (value : string)=>void;
    // eventFormat : string;
    // setLongitude : (value : number)=>void;
    // setLatitude : (value : number)=> void;
    theme? : string;
    // isEventFormatEmpty:boolean
    // query:string;
    // setQuery:(value : string)=>void;
    // setIsEventFormatEmpty:(value : boolean)=>void;
}

const LocationContainer = ({
    formTheme,
    formState,
    handleChange,
    // setCityName,
    // cityName,
    // setCountryName, 
    // countryName,
    // setEventFormat,
    // eventFormat,
    // setLongitude,
    // setLatitude,
    theme,
    // isEventFormatEmpty,
    // query,
    // setQuery,
    // setIsEventFormatEmpty
  }: Props) => {
    const [dropdown, setDropdown] = useState<boolean>(false)
    const dropdownRef = useOutsideClick(()=>setDropdown(false))
    return (
        <div className={`${styles.body} ${formState.isEventFormatEmpty ? styles.errorHighlight : ""} ${theme && theme === "dark" ? styles.darkBody : ""}`}>
            <div className={styles.locationContainer} onClick={()=>setDropdown(!dropdown)}>
                <LocationIcon color={formTheme === "light" ? "#7d7d7d" : "white"}/>
                <div className={styles.eventLocation}>
                    <div className={`${styles.eventLocationOne} ${formTheme === "dark" ? styles.darkEventLocation : styles.lightEventLocation} ${formState.cityName ? styles.activeLocation : ""}`}>{formState.cityName ? formState.cityName : "Add Event Location"}</div>
                    <div className={`${styles.eventLocationTwo} ${formTheme === "dark" ? styles.darkEventLocation : styles.lightEventLocation}`}>{formState.countryName ? formState.countryName : "Offline location or Virtual Link"}</div>
                </div>
            </div>
            {/* <Image className={styles.editIcon} src={EditIcon} alt='edit' onClick={()=>setDropdown(!dropdown)}/> */}
            {dropdown && <div ref={dropdownRef} className={styles.dropdown}><LocationDropdown formState={formState} handleChange={handleChange} theme={theme} 
            // setLatitude={setLatitude} setLongitude={setLongitude} eventFormat={eventFormat} setEventFormat={setEventFormat} 
            // setCityName = {setCityName}
            //  setCountryName={setCountryName} query={query} setQuery={setQuery} setIsEventFormatEmpty={setIsEventFormatEmpty} 
             /></div>}
        </div>
    )
}

export default LocationContainer

interface IconProps{
    color : string;
}
function LocationIcon({color} : IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" fill={color} /></svg>
    )
}