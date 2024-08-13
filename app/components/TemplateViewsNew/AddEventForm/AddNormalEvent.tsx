import React, { useEffect, useRef, useState } from 'react'
import styles from './addnormal.style.module.css'
import DateTimeContainer from './Details/dateandtime/DateTimeContainer';
import LocationContainer from './Details/location/LocationContainer';
import DescriptionContainer from './Details/description/DescriptionContainer';
import DescriptionModal from './Details/description/DescriptionModal';
import { myFetch } from '@/utils/myFetch';
import { baseUrl } from '@/constants';

interface Props {
    setIsNormalEventModalOpen: (value: boolean) => void
    fetchEvents: () => Promise<void>;
}

const AddNormalEvent = ({ setIsNormalEventModalOpen,fetchEvents }: Props) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [eventName, setEventName] = useState<string>("");
    const [timeZone, setTimeZone] = useState<string>("GMT+05:30 Chennai")
    const [timeZoneKey, setTimeZoneKey] = useState<number>(18)
    const [startDate, setStartDate] = useState<string>("")
    const [endDate, setEndDate] = useState<string>("")
    const [startTime, setStartTime] = useState<string>("12:00 A.M")
    const [endTime, setEndTime] = useState<string>("12:00 A.M")
    const [description, setDescription] = useState<string>("")
    const [cityName, setCityName] = useState<string>("")
    const [countryName, setCountryName] = useState<string>("")
    const [eventFormat, setEventFormat] = useState<string>("In-person")
    const [textValue, setTextValue] = useState<string>(description)
    const [descriptionModal, setDescriptionModal] = useState<boolean>(false)

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
    return (
        <div className={styles.body}>
            <div className={styles.header}>
                <div className={styles.heading}>Add Event Form</div>
                <div className={styles.btnContainer}>
                    <button onClick={handleAddEvent}>Save</button>
                    <button onClick={() => setIsNormalEventModalOpen(false)}>Close</button>
                </div>
            </div>
            <div className={styles.line}></div>
            <div className={styles.form}>
                <textarea ref={textAreaRef} className={styles.eventName} maxLength={80} placeholder='Event Name' style={{ fontFamily: "arial" }} onChange={(e) => setEventName(e.target.value)} value={eventName} />

                <div className={styles.dateTimeContainer}><DateTimeContainer setEndDate={setEndDate} endDate={endDate} setStartDate={setStartDate} startDate={startDate} endTime={endTime} setEndTime={setEndTime} startTime={startTime} setStartTime={setStartTime} timeZone={timeZone} setTimeZone={setTimeZone} timeZoneKey={timeZoneKey} setTimeZoneKey={setTimeZoneKey} /></div>

                <div className={styles.locationContainer}><LocationContainer eventFormat={eventFormat} setEventFormat={setEventFormat} setCityName={setCityName} cityName={cityName} setCountryName={setCountryName} countryName={countryName} /></div>


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