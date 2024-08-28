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

interface Props {
    setIsNormalEventModalOpen: (value: boolean) => void
    fetchEvents: () => Promise<void>;
    prefilledGlobalEvent?: GolbalEventType
}

const AddNormalEvent = ({ setIsNormalEventModalOpen, fetchEvents, prefilledGlobalEvent }: Props) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [eventName, setEventName] = useState<string>(prefilledGlobalEvent?.name || "");
    const [timeZone, setTimeZone] = useState<string>("GMT+05:30 Chennai")
    const [timeZoneKey, setTimeZoneKey] = useState<number>(18)
    const [startDate, setStartDate] = useState<string>(prefilledGlobalEvent?.startDate || "")
    const [endDate, setEndDate] = useState<string>(prefilledGlobalEvent?.endDate || "")
    const [startTime, setStartTime] = useState<string>("12:00 A.M")
    const [endTime, setEndTime] = useState<string>("12:00 A.M")
    const [description, setDescription] = useState<string>(prefilledGlobalEvent?.description || "")
    const [cityName, setCityName] = useState<string>(prefilledGlobalEvent?.cityName || "")
    const [countryName, setCountryName] = useState<string>(prefilledGlobalEvent?.countryName || "")
    const [eventFormat, setEventFormat] = useState<string>("In-person")
    const [textValue, setTextValue] = useState<string>(description)
    const [descriptionModal, setDescriptionModal] = useState<boolean>(false)

    const [latitude, setLatitude] = useState(37.7749)
    const [longitude, setLongitude] = useState(-122.4194)
    const [participationMessage, setParticipationMessage] = useState<string>("")
    const [participationType, setParticipationType] = useState<string>("Attendee")

    const handleDescClick = () => {
        setDescription(textValue)
        setDescriptionModal(false)
    }
    useEffect(() => {
        const adjustHeight = () => {
            const textArea = textAreaRef.current;
            if (textArea) {
                textArea.style.height = 'auto'; // Reset the height
                textArea.style.height = `${textArea.scrollHeight}px`; // Set the height to the scroll height
            }
        };

        const textArea = textAreaRef.current;
        if (textArea) {
            textArea.addEventListener('input', adjustHeight);
            adjustHeight(); // Initial adjustment
        }

        return () => {
            if (textArea) {
                textArea.removeEventListener('input', adjustHeight);
            }
        };
    }, []);

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
            
        };
        const formData = new FormData()
        formData.append("name", eventName)
        formData.append("data", JSON.stringify(eventData))

        // Bottom 3 fields are for temporary purposes because there are mandatory in backend right now
        formData.append("interest", "SPEAKER")
        formData.append("source", "eventgeni/widget/event")
        formData.append("sourceId", "1234")

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
        console.log("latitude :", latitude)
        console.log("longitude :", longitude)
    }, [latitude])
    return (
        <div className={styles.body}>
            <div className={styles.header}>
                <div className={styles.heading}>Add Event Form</div>
                <div className={styles.btnContainer}>
                    <button className={styles.closeBtn} onClick={() => setIsNormalEventModalOpen(false)}>Close</button>
                    <button className={styles.saveBtn} onClick={handleAddEvent}>Save</button>
                </div>
            </div>
            <div className={styles.line}></div>
            <div className={styles.form}>
                <textarea ref={textAreaRef} className={styles.eventName} maxLength={80} placeholder='Event Name' style={{ fontFamily: "arial" }} onChange={(e) => setEventName(e.target.value)} value={eventName} />

                <div className={styles.dateTimeContainer}><DateTimeContainer setEndDate={setEndDate} endDate={endDate} setStartDate={setStartDate} startDate={startDate} endTime={endTime} setEndTime={setEndTime} startTime={startTime} setStartTime={setStartTime} timeZone={timeZone} setTimeZone={setTimeZone} timeZoneKey={timeZoneKey} setTimeZoneKey={setTimeZoneKey} /></div>

                <div className={styles.locationContainer}><LocationContainer setLatitude={setLatitude} setLongitude={setLongitude} eventFormat={eventFormat} setEventFormat={setEventFormat} setCityName={setCityName} cityName={cityName} setCountryName={setCountryName} countryName={countryName} /></div>

                <div className={styles.participationContainer}><ParticipationContainer width="small" participationMessage={participationMessage} setParticipationMessage={setParticipationMessage} setParticipationType={setParticipationType} participationType={participationType} /></div>
                <div className={styles.descriptionContainer} ><DescriptionContainer setDescriptionModal={setDescriptionModal} description={description} /></div>
            </div>
            {
                descriptionModal && <div className={styles.descriptionModal}>
                    <DescriptionModal setDescriptionModal={setDescriptionModal} textValue={textValue} setTextValue={setTextValue} handleDescClick={handleDescClick} />
                </div>
            }
        </div >
    )
}

export default AddNormalEvent