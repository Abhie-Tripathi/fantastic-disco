import React, { useState } from 'react'
import styles from './employeepage.styles.module.css'
import AddEventModal from '../AddEventModal.js'
import EmployeeNavbar from './EmployeeNavbar.js'
import Navbar from '../Navbar.js'
import ListView from './listview/ListView.js'
import ViewBtns from './viewbtns/ViewBtns.js'
import Map from './mapview/Map.js'
import CalendarContainer from './calendarcontainer/CalendarContainer.js'

const EmployeePage = () => {

    const [selectedView, setSelectedView] = useState('list')
    const [isAddeventOpen, setIsAddEventOpen] = useState(false)

    const handleAddEvent = ()=>{
        setIsAddEventOpen(!isAddeventOpen)
    }

    const handleSelectedData = (view)=>{
        setSelectedView(view)
    }

    return (
        <div className={styles.body}>
            <Navbar />
            <div className={`${styles.eventsBody}`}>
                <EmployeeNavbar handleAddEvent={handleAddEvent}/>
                <ViewBtns handleSelectedData = {handleSelectedData} />
                {selectedView === 'list' && <ListView/>}
                {selectedView === 'map' && <Map/>}
                {selectedView === 'calendar' && <CalendarContainer/>}
            </div>
            {isAddeventOpen &&
                <div className={styles.modal}>
                    <AddEventModal />
                </div>}
        </div>
    )
}


export default EmployeePage