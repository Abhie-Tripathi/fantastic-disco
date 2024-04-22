"use client"
import React, { Suspense, useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import EmployeeNavbar from '../../components/employee/EmployeeNavbar';
import ListView from '../../components/employee/listView/ListView'
import ViewBtns from '../../components/employee/viewBtns/ViewBtns';
import Preloader from "@/public/preloader.svg"
// import Map from '../../components/employee/mapview/Map';
import CalendarContainer from '../../components/employee/calendarcontainer/CalendarContainer';
import AddEventModal from '../../components/AddEventModal';
const Map=React.lazy(()=>import('../../components/employee/mapview/Map'))
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
        <div className={isAddeventOpen ? styles.body : ''}>
            <div className={`${styles.eventsBody}`}>
                <EmployeeNavbar handleAddEvent={handleAddEvent} />
                <ViewBtns handleSelectedData={handleSelectedData} />
                {selectedView === 'list' && <ListView />}
                <Suspense fallback={<div><Image src={Preloader} alt="preloader" height="50"/></div>}>
                {selectedView === 'map' && <Map />}
                </Suspense>
                {selectedView === 'calendar' && <CalendarContainer />}
            </div>
            {isAddeventOpen && 
    <div className={styles.modal} onClick={(e) => { 
        console.log(e);
        const targetElement = e.target as HTMLElement;
        if (targetElement.classList.contains(styles.modal)||targetElement.classList.contains(styles.bodyContainer)) handleAddEvent();
    }}>
        <AddEventModal />
    </div>
}
        </div>
    );
};

export default EmployeePage;
