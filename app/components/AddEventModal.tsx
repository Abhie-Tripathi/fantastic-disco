'use client'
import React, { useState, useEffect } from 'react'
import EventData from '../../public/data/demoEvent.json'
import styles from './addeventmodal.style.module.css'
import RangePicker from './calendar/RangePicker';
import LocationIcon from '/public/location.svg'
import PeopleIcon from '/public/people.svg'
import DateIcon from '/public/calendar.svg'
import DescIcon from '/public/page.svg'
import usePosterGenerator from '../service/posterGenerator';
import Placeholder from '/public/placeholder.png'
import DescriptionModal from './DescriptionModal';
import SearchIcon from '/public/search.svg'
import EmployeeData from '../../public/data/employeeData.json'
import logo from '/public/googlelogo.png'

import Image from 'next/image';
import { useTheme } from '@/context';

interface ImageState {
    placeHolder: any;
    file: File | null;
}

const AddEventModal = () => {

    const [searchInput, setSearchInput] = useState<string>("");
    const [matchingEvents, setMatchingEvents] = useState<any[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
    const [isEventDropdownOpen, setIsEventDropdownOpen] = useState<boolean>(false);
    const [isFormDisabled, setIsFormDisabled] = useState<boolean>(true);
    const { isLoading, imageUrl, generatePrompt } = usePosterGenerator();
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [image, setImage] = useState<ImageState>({
        placeHolder: Placeholder,
        file: null
    });
    const [logoUrl, setLogoUrl] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [employeeMail, setEmployeeMail] = useState<string>("");
    const [matchingEmployees, setMatchingEmployees] = useState<any[]>([]);
    const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState<boolean>(false);
    const [addedEmployees, setAddedEmployees] = useState<any[]>([]);
    const {theme} = useTheme();
    const iconClass = theme === 'light' ? 'icons_light' : 'icon'


    // Will filter the events according to the search event input
    const filterEvents = (event: any) => {
        return event.tags.includes(searchInput.toLowerCase());
    };
    useEffect(() => {
        const matches = EventData.filter(filterEvents);
        setMatchingEvents(matches);
        setIsEventDropdownOpen(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput])


    const handleEventClick = (event: any) => {
        setIsEventDropdownOpen(false)
        setSelectedEvent(event);
    }
    // When the event will get updated, i.e when a event will be selected from the dropdown
    useEffect(() => {
        setSearchInput(selectedEvent?.name || '');
        setLocation(selectedEvent?.location || '')
        setDescription(selectedEvent?.description || '')
        setStartDate(selectedEvent?.startDate || '')
        setEndDate(selectedEvent?.endDate || '')
        setLogoUrl(selectedEvent?.logo || "")
    }, [selectedEvent]);

    const filterEmployees = (mail: any) => {
        return mail.id.includes(employeeMail.toLowerCase())
    }
    useEffect(() => {
        if (employeeMail.trim() !== '') {
            const matches = EmployeeData.filter(filterEmployees);
            setMatchingEmployees(matches);
            setIsEmployeeDropdownOpen(true)
        } else {
            setMatchingEmployees([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employeeMail])
    const handleEmployeeClick = (employee: any) => {
        setIsEmployeeDropdownOpen(false)
        // Check if the email already exists in the addedEmployees list
        const isDuplicate = addedEmployees.some(emp => emp.id === employee.id);
        if (!isDuplicate) {
            // Add the employee to the addedEmployees list
            setAddedEmployees(prevEmployees => [...prevEmployees, employee]);
        }
        // Clear the input field after selection
        setEmployeeMail('');
    }

    const handleModal = () => {
        if (!isFormDisabled) {
            setIsModalOpen(!isModalOpen)
        }
    }
    const handleDescription = (value: string) => {
        setDescription(value)
    }


    const handlePoster = () => {
        if (location && description) {
            generatePrompt(location, description)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (
                file.type === 'image/png' ||
                file.type === 'image/jpg' ||
                file.type === 'image/jpeg'
            ) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target && event.target.result) {
                        setImage({
                            placeHolder: event.target.result.toString(),
                            file: file
                        });
                    }
                };
                reader.readAsDataURL(file);
            } else {
                setImage({
                    placeHolder: Placeholder,
                    file: null
                });
            }
        }
    };

    useEffect(() => {
        // Update the image state when generatedImage change
        if (imageUrl) {
            setImage({ placeHolder: imageUrl, file: null });
        }
        console.log(imageUrl)
    }, [imageUrl]);

    useEffect(() => {
        if (location && description) {
            generatePrompt(location, description)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [description, location])
    return (
        <div className={styles.bodyContainer}>
            <form className={styles.form}>
                <div className={styles.formFieldsContainer}>
                    <div className={styles.search}>
                        <div className={styles.searchContainer}>
                            <Image src={SearchIcon} alt='search' className={iconClass} />
                            <input
                                type='text'
                                placeholder='Enter Event Url or Search for an Event'
                                onChange={(e) => setSearchInput(e.target.value)}
                                value={searchInput}
                                required
                            />
                        </div>
                        <button type='button' onClick={() => setIsFormDisabled(!isFormDisabled)} className={`${styles.btn} ${!isFormDisabled ? styles.activeBtn : ""}`}>Add Manually</button>
                        {isEventDropdownOpen && (
                            <div className={styles.dropdown}>
                                {matchingEvents.map(event => (
                                    <div key={event.id} className={styles.dropdownItem} onClick={() => handleEventClick(event)}>
                                        {event.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className={styles.dateContainer}>
                        <div className={styles.dateIconContainer}>
                            <Image src={DateIcon} alt='SearchIcon' className={iconClass} />
                            <span className={styles.heading}>Dates</span>
                        </div>
                        <div className={styles.input}><RangePicker startDate={startDate} endDate={endDate} disabled={isFormDisabled} /></div>
                    </div>
                    <div className={styles.locationContainer}>
                        <Image src={LocationIcon} alt='LocationIcon' className={iconClass}/>
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required placeholder='Location' disabled={isFormDisabled} />
                    </div>
                    <div className={styles.descContainer} onClick={handleModal}>
                        <Image src={DescIcon} alt='DescIcon' className={iconClass}/>
                        <div className={styles.headingContainer}>
                            <div className={styles.descHeading} >Description</div>
                            {description.length > 0 && <input className={styles.descPara} disabled={true} value={description} />}
                        </div>
                    </div>
                    <div className={styles.employeeContainer}>
                        <div className={styles.employeeIconContainer}>
                            <Image src={PeopleIcon} alt='SearchIcon' className={iconClass}/>
                            <input type="text" value={employeeMail} onChange={(e) => setEmployeeMail(e.target.value)} required placeholder='Add Employee mail' disabled={isFormDisabled} />
                        </div>
                        {isEmployeeDropdownOpen && (
                            <div className={styles.dropdown}>
                                {matchingEmployees.map(employee => (
                                    <div key={employee.id} className={styles.dropdownItem} onClick={() => handleEmployeeClick(employee)}>
                                        {employee.id}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className={styles.addedEmployees}>
                        {addedEmployees.map(employee => (
                            <div key={employee.id} className={styles.addedEmployee}>
                                <div>{employee.initials}</div>
                            </div>
                        ))}
                    </div>
                    <button className={styles.submitBtn} type='submit'>Add</button>
                </div>
                <div className={styles.formImgContainer}>
                    <div className={styles.btns}>
                        <label onClick={handlePoster}>AI Generate</label>
                        <label htmlFor='fileUpload'>Upload Image</label>
                        <input id='fileUpload' type="file" onChange={handleImageChange} disabled={isFormDisabled} />
                    </div>
                    <div className={styles.imageHolder}>
                        {isLoading ? (
                            <div className={styles.loader}>
                                <div></div>
                            </div>
                        ) : (
                            <div className={styles.imageBox}>
                                <Image src={image.placeHolder} alt="" width={400} height={400} />
                                <div className={styles.imageLocation}>{location}</div>
                                <Image src={logo} alt='logo' className={styles.logo}></Image>
                            </div>
                        )}
                    </div>
                </div>
            </form>
            <div className={`${styles.modal} ${isModalOpen ? styles.modalOpen : ""} `}>
                <DescriptionModal handleModal={handleModal} handleDescription={handleDescription} />
            </div>
        </div>
    )
}

export default AddEventModal