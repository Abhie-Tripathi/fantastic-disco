'use client'
import React, { useEffect, useRef, useState } from 'react'
import styles from './addnormal.style.module.css'
import DateTimeContainer from './Details/dateandtime/DateTimeContainer';
import LocationContainer from './Details/location/LocationContainer';
import DescriptionContainer from './Details/description/DescriptionContainer';
import DescriptionModal from './Details/description/DescriptionModal';
import { myFetch } from '@/utils/myFetch';
import { baseUrl } from '@/constants';
import { GolbalEventType } from '@/types/globaleventtype';
import ParticipationContainer from './Details/participation/ParticipationContainer'
import { AllEventsType } from '@/types/alleventtype';
import { showToast } from "@/utils/showToast";
import { AddedEventsType } from '@/types/addedeventtype';

interface Props {
    setIsNormalEventModalOpen: (value: boolean) => void
    fetchEvents: (page : number, type? : string) => Promise<void>;
    prefilledGlobalEvent?: GolbalEventType
    prefilledNormalEvent?: AllEventsType
    theme: string;
    fetchAddedEvents?: ()=> Promise<void>;
}

const AddNormalEvent = ({ setIsNormalEventModalOpen, fetchEvents, prefilledGlobalEvent, prefilledNormalEvent, theme,fetchAddedEvents }: Props) => {
    // const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [eventName, setEventName] = useState<string>(prefilledGlobalEvent?.name || prefilledNormalEvent?.name || "");
    const [timeZone, setTimeZone] = useState<string>(prefilledNormalEvent?.gmtZone || "GMT+05:30 Chennai")
    const [timeZoneKey, setTimeZoneKey] = useState<number>(18)
    const [startDate, setStartDate] = useState<string>(prefilledGlobalEvent?.startDate || prefilledNormalEvent?.startDate || "")
    const [endDate, setEndDate] = useState<string>(prefilledGlobalEvent?.endDate || prefilledNormalEvent?.endDate || "")
    const [startTime, setStartTime] = useState<string>(prefilledNormalEvent?.startTime || "")
    const [endTime, setEndTime] = useState<string>(prefilledNormalEvent?.endTime || "")
    const [description, setDescription] = useState<string>(prefilledGlobalEvent?.description || prefilledNormalEvent?.description || "")
    const [cityName, setCityName] = useState<string>(prefilledGlobalEvent?.cityName || prefilledNormalEvent?.cityName || "")
    const [countryName, setCountryName] = useState<string>(prefilledGlobalEvent?.countryName || prefilledNormalEvent?.countryName || "")
    const [eventFormat, setEventFormat] = useState<string>("In-person")
    const [textValue, setTextValue] = useState<string>("")
    const [descriptionModal, setDescriptionModal] = useState<boolean>(false)
    const [latitude, setLatitude] = useState(Number(prefilledGlobalEvent?.latitude) ||Number(prefilledNormalEvent?.latitude) ||  37.7749)
    const [longitude, setLongitude] = useState(Number(prefilledGlobalEvent?.longitude) ||Number(prefilledNormalEvent?.longitude) || -122.4194)
    const [participationMessage, setParticipationMessage] = useState<string>("")
    const [participationType, setParticipationType] = useState<string>(prefilledNormalEvent?.participationType || "")
    const [isEventNameEmpty, setIsEventNameEmpty] = useState(false);
    const [isEventFormatEmpty, setIsEventFormatEmpty] = useState(false);
    const [isEventDescriptionEmpty, setIsEventDescriptionEmpty] = useState(false);
    const [isEventParticipationEmpty, setIsEventParticipationEmpty] = useState(false);
    const [isParticipationMessageEmpty, setIsParticipationMessageEmpty] = useState<boolean>(false)
    const [isTextValueMessageEmpty, setIsTextValueMessageEmpty] = useState<boolean>(false)
    const [query, setQuery] = useState("")
    const handleDescClick = () => {
        setDescription(textValue)
        setDescriptionModal(false)
    }

    const handleAddUpdateEvent = (type: string) => {
        if (type === "update") {
            handleSaveEvent()
        } else {
            handleAddEvent()
        }
    }
    const handleSaveEvent = async () => {
        if (!eventName || eventName ==="") {
            setIsEventNameEmpty(true)
        }else{
            setIsEventNameEmpty(false)
        }

        if(!participationType){
            setIsEventParticipationEmpty(true)
        }else{
            setIsEventParticipationEmpty(false)
        }
        if(!description){
            setIsEventDescriptionEmpty(true)
        }else{
            setIsEventDescriptionEmpty(false)
        }
        if(!query && !latitude || !longitude){
            setIsEventFormatEmpty(true)
        }else{
            setIsEventFormatEmpty(false)
        }
        if(!textValue.trim()){
            setIsTextValueMessageEmpty(true)
          }
        if (!eventName.trim() || !eventFormat || !startTime || !endTime || !startDate || !endDate || !description.trim() || !cityName || !countryName || !timeZone || !latitude || !longitude || !participationType) {
            showToast("error","Please fill in all the fields");
            return; // Exit the function if any field is missing
        }
        const eventData = {
            format: eventFormat,
            start_time: startTime,
            end_time: endTime,
            end_date: endDate,
            start_date: startDate,
            description,
            location_city: cityName,
            location_country: countryName,
            gmt_time: timeZone,
            latitude,
            longitude,
            participationType
        };
        const formData = new FormData()
        formData.append("name", eventName)
        formData.append("data", JSON.stringify(eventData))
        formData.append("id", prefilledNormalEvent?.eventId || "")

        const { data, error } = await myFetch(`${baseUrl}/event`, {
            method: 'PATCH',
            body: formData
        })
        if (data) {
            console.log(data)
            setIsNormalEventModalOpen(false)
            fetchEvents(0,"update")
            if(fetchAddedEvents){
                fetchAddedEvents()
            }
            
        }
        if (error) {
            console.log(error)
        }
    }
    const handleAddEvent = async () => {
        if (!eventName || eventName ==="") {
            setIsEventNameEmpty(true)
        }else{
            setIsEventNameEmpty(false)
        }

        if(!participationType){
            setIsEventParticipationEmpty(true)
        }else{
            setIsEventParticipationEmpty(false)
        }
        if(!description){
            setIsEventDescriptionEmpty(true)
        }else{
            setIsEventDescriptionEmpty(false)
        }
        if(!query){
            setIsEventFormatEmpty(true)
        }else{
            setIsEventFormatEmpty(false)
        }
        if(!textValue){
            setIsTextValueMessageEmpty(true)
          }
        
        if (!eventName.trim() || !eventFormat || !startTime || !endTime || !startDate || !endDate || !description.trim() || !cityName || !countryName || !timeZone || !latitude || !longitude || !participationType) {
            showToast("error","Please fill in all the fields");
            return; // Exit the function if any field is missing
        }
        const eventData = {
            format: eventFormat,
            start_time: startTime,
            end_time: endTime,
            end_date: endDate,
            start_date: startDate,
            description,
            location_city: cityName,
            location_country: countryName,
            gmt_time: timeZone,
            latitude,
            longitude,
            participationType,
            event_type: "Tradeshow",
        };
        const formData = new FormData()
        formData.append("name", eventName)
        formData.append("data", JSON.stringify(eventData))
        formData.append("type", "MAIN")
        // Bottom 3 fields are for temporary purposes because there are mandatory in backend right now
        // formData.append("interest", "SPEAKER")
        // formData.append("source", "eventgeni/widget/event")
        // formData.append("sourceId", "1234")

        const { data, error } = await myFetch(`${baseUrl}/event`, {
            method: 'POST',
            body: formData
        })
        if (data) {
            console.log(data)
            setIsNormalEventModalOpen(false)
            fetchEvents(0, "update")
        }
        if (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        setTextValue(description)
    }, [description])

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        let value = e.target.value;
        
        const specialCharRegex = /[@#$%^&*"|<>]/g;
    
        if (specialCharRegex.test(value)) {
            showToast("error","Please check, input should not contain any special character");
        } else {
            setEventName(value); 
            if (value.trim() === "") {
                setIsEventNameEmpty(true);
            }
        }
      };
    return (
        <div className={`${styles.body} ${theme && theme === "dark" ? styles.darkBody : ""}`}>
            {/* <div className={styles.header}>
                <div className={styles.heading}>Add Event Form</div>
                <div className={styles.btnContainer}>
                    <button className={styles.closeBtn} onClick={() => setIsNormalEventModalOpen(false)}>Close</button>
                    <button className={styles.saveBtn} onClick={() => handleAddUpdateEvent(prefilledNormalEvent ? "update" : "add")}>Save</button>
                </div>
            </div>
            <div className={styles.line}></div>
            <div className={styles.form}>
                <div>
                    <div className={styles.participationContainer}><ParticipationContainer type='normal' theme={theme} size="small" participationMessage={participationMessage} setParticipationMessage={setParticipationMessage} setParticipationType={setParticipationType} participationType={participationType} isEventParticipationEmpty={isEventParticipationEmpty} setIsEventParticipationEmpty={setIsEventParticipationEmpty}  isParticipationMessageEmpty={isParticipationMessageEmpty} setIsParticipationMessageEmpty={setIsParticipationMessageEmpty}/></div>
                    {isEventParticipationEmpty && <p className={styles.errorMessage}>Please select any mode of participation.</p>}
                </div>

                <div>
                    <textarea className={`${styles.eventName} ${isEventNameEmpty ? styles.errorBackground : ""}`} maxLength={80} placeholder='Event Name' style={{ fontFamily: "arial" }} onChange={(e) => {handleInputChange(e)}} value={eventName} />
                    {isEventNameEmpty && <p className={styles.errorMessage}>Event name is required.</p>}
                </div>
                <div className={styles.dateTimeContainer}><DateTimeContainer theme={theme} setEndDate={setEndDate} endDate={endDate} setStartDate={setStartDate} startDate={startDate} endTime={endTime} setEndTime={setEndTime} startTime={startTime} setStartTime={setStartTime} timeZone={timeZone} setTimeZone={setTimeZone} timeZoneKey={timeZoneKey} setTimeZoneKey={setTimeZoneKey} /></div>
                <div>
                <div className={styles.locationContainer}><LocationContainer theme={theme} setLatitude={setLatitude} setLongitude={setLongitude} eventFormat={eventFormat} setEventFormat={setEventFormat} setCityName={setCityName} cityName={cityName} setCountryName={setCountryName} countryName={countryName} isEventFormatEmpty={isEventFormatEmpty} query={query} setQuery={setQuery} setIsEventFormatEmpty={setIsEventFormatEmpty}/></div>
                    {isEventFormatEmpty && <span className={styles.errorMessage}>Event location is required.</span>}
                </div>
                <div>
                    <div className={styles.descriptionContainer} ><DescriptionContainer theme={theme} setDescriptionModal={setDescriptionModal} description={description} isEventDescriptionEmpty={isEventDescriptionEmpty} setIsEventDescriptionEmpty={setIsEventDescriptionEmpty}/></div>
                    {isTextValueMessageEmpty&&isEventDescriptionEmpty && <span className={styles.errorMessage}>Event description is required.</span>}
                </div>
            </div>
            {
                descriptionModal && <div className={styles.descriptionModalFill}>
                    <DescriptionModal setDescriptionModal={setDescriptionModal} textValue={textValue} setTextValue={setTextValue} handleDescClick={handleDescClick} />
                </div>
            } */}
        </div >
    )
}

export default AddNormalEvent