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

interface Props {
    setIsNormalEventModalOpen: (value: boolean) => void
    fetchEvents: () => Promise<void>;
    prefilledGlobalEvent?: GolbalEventType
    prefilledNormalEvent?: AllEventsType
    theme: string;
}

const AddNormalEvent = ({ setIsNormalEventModalOpen, fetchEvents, prefilledGlobalEvent, prefilledNormalEvent, theme }: Props) => {
    // const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [eventName, setEventName] = useState<string>(prefilledGlobalEvent?.name || prefilledNormalEvent?.name || "");
    const [timeZone, setTimeZone] = useState<string>(prefilledNormalEvent?.gmtZone || "GMT+05:30 Chennai")
    const [timeZoneKey, setTimeZoneKey] = useState<number>(18)
    const [startDate, setStartDate] = useState<string>(prefilledGlobalEvent?.startDate || prefilledNormalEvent?.startDate || "")
    const [endDate, setEndDate] = useState<string>(prefilledGlobalEvent?.endDate || prefilledNormalEvent?.endDate || "")
    const [startTime, setStartTime] = useState<string>(prefilledNormalEvent?.startTime || "12:00 A.M")
    const [endTime, setEndTime] = useState<string>(prefilledNormalEvent?.endTime || "12:00 A.M")
    const [description, setDescription] = useState<string>(prefilledGlobalEvent?.description || prefilledNormalEvent?.description || "")
    const [cityName, setCityName] = useState<string>(prefilledGlobalEvent?.cityName || prefilledNormalEvent?.cityName || "")
    const [countryName, setCountryName] = useState<string>(prefilledGlobalEvent?.countryName || prefilledNormalEvent?.countryName || "")
    const [eventFormat, setEventFormat] = useState<string>("In-person")
    const [textValue, setTextValue] = useState<string>("")
    const [descriptionModal, setDescriptionModal] = useState<boolean>(false)
    const [latitude, setLatitude] = useState(Number(prefilledGlobalEvent?.latitude) || 37.7749)
    const [longitude, setLongitude] = useState(Number(prefilledGlobalEvent?.longitude) || -122.4194)
    const [participationMessage, setParticipationMessage] = useState<string>("")
    const [participationType, setParticipationType] = useState<string>(prefilledNormalEvent?.participationType || "")

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
            fetchEvents()
        }
        if (error) {
            console.log(error)
        }
    }
    const handleAddEvent = async () => {
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
            event_type: "Tradeshow"
        };
        const formData = new FormData()
        formData.append("name", eventName)
        formData.append("data", JSON.stringify(eventData))

        // Bottom 3 fields are for temporary purposes because there are mandatory in backend right now
        formData.append("interest", "SPEAKER")
        // formData.append("source", "eventgeni/widget/event")
        // formData.append("sourceId", "1234")

        const { data, error } = await myFetch(`${baseUrl}/event`, {
            method: 'POST',
            body: formData
        })
        if (data) {
            console.log(data)
            setIsNormalEventModalOpen(false)
            fetchEvents()
        }
        if (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        setTextValue(description)
    }, [description])
    return (
        <div className={`${styles.body} ${theme && theme === "dark" ? styles.darkBody : ""}`}>
            <div className={styles.header}>
                <div className={styles.heading}>Add Event Form</div>
                <div className={styles.btnContainer}>
                    <button className={styles.closeBtn} onClick={() => setIsNormalEventModalOpen(false)}>Close</button>
                    <button className={styles.saveBtn} onClick={() => handleAddUpdateEvent(prefilledNormalEvent ? "update" : "add")}>Save</button>
                </div>
            </div>
            <div className={styles.line}></div>
            <div className={styles.form}>
                <div className={styles.participationContainer}><ParticipationContainer type='normal' theme={theme} size="small" participationMessage={participationMessage} setParticipationMessage={setParticipationMessage} setParticipationType={setParticipationType} participationType={participationType} /></div>
                <textarea className={styles.eventName} maxLength={80} placeholder='Event Name' style={{ fontFamily: "arial" }} onChange={(e) => setEventName(e.target.value)} value={eventName} />

                <div className={styles.dateTimeContainer}><DateTimeContainer theme={theme} setEndDate={setEndDate} endDate={endDate} setStartDate={setStartDate} startDate={startDate} endTime={endTime} setEndTime={setEndTime} startTime={startTime} setStartTime={setStartTime} timeZone={timeZone} setTimeZone={setTimeZone} timeZoneKey={timeZoneKey} setTimeZoneKey={setTimeZoneKey} /></div>

                <div className={styles.locationContainer}><LocationContainer theme={theme} setLatitude={setLatitude} setLongitude={setLongitude} eventFormat={eventFormat} setEventFormat={setEventFormat} setCityName={setCityName} cityName={cityName} setCountryName={setCountryName} countryName={countryName} /></div>

                <div className={styles.descriptionContainer} ><DescriptionContainer theme={theme} setDescriptionModal={setDescriptionModal} description={description} /></div>
            </div>
            {
                descriptionModal && <div className={styles.descriptionModalFill}>
                    <DescriptionModal setDescriptionModal={setDescriptionModal} textValue={textValue} setTextValue={setTextValue} handleDescClick={handleDescClick} />
                </div>
            }
        </div >
    )
}

export default AddNormalEvent