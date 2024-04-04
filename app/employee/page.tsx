"use client"
import React, { useState } from 'react';
import styles from './page.module.css';
import EmployeeNavbar from '../components/employee/EmployeeNavbar';
import ListView from '../components/employee/listView/ListView'
import ViewBtns from '../components/employee/viewBtns/ViewBtns';
import Map from '../components/employee/mapview/Map';
import CalendarContainer from '../components/employee/calendarcontainer/CalendarContainer';

const EmployeePage: React.FC = () => {
    const [selectedView, setSelectedView] = useState<string>('list');
    const [isAddeventOpen, setIsAddEventOpen] = useState<boolean>(false);

    const handleAddEvent = () => {
        setIsAddEventOpen(!isAddeventOpen);
    };

    const handleSelectedData = (view: string) => {
        setSelectedView(view);
    };

    return (
        <div className={styles.body}>
            <div className={`${styles.eventsBody}`}>
                <EmployeeNavbar handleAddEvent={handleAddEvent} />
                <ViewBtns handleSelectedData={handleSelectedData} />
                {selectedView === 'list' && <ListView />}
                {selectedView === 'map' && <Map />}
                {selectedView === 'calendar' && <CalendarContainer />}
            </div>
            {isAddeventOpen && <div className={styles.modal}>{/* <AddEventModal /> */}</div>}
        </div>
    );
};

export default EmployeePage;
