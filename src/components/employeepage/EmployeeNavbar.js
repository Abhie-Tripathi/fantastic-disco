import React from 'react'
import styles from './employeenavbar.style.module.css'
import swapIcon from '../../icons/swap.svg'
import addIcon from '../../icons/add.svg'
import CalendarIcon from '../../icons/calendar.svg'

const EmployeeNavbar = (props) => {

    const handleAddEvent = () => {
        props.handleAddEvent()
    }

    return (
        <div className={styles.navbar}>
            <div className={styles.heading}>
                <img src={CalendarIcon} />
                <div>Upcoming Events</div>
            </div>
            <div className={styles.btns}>
                <div className={styles.sort}><img src={swapIcon} /></div>
                <div className={styles.add} onClick={handleAddEvent}>
                    <img src={addIcon} />
                    New Event
                </div>
            </div>
        </div>
    )
}

export default EmployeeNavbar