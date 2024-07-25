import React from 'react'
import styles from './calendar.style.module.css'
import { Button, Calendar, CalendarCell, CalendarGrid, Heading } from 'react-aria-components';
import { parseDate } from '@internationalized/date';

interface Props {
    setDate: (value: string) => void
    dateValue: string
}

const CalendarDropdown = ({ setDate, dateValue }: Props) => {

    const handleChange = (newDate: any) => {
        const formattedDate = newDate.toString(); // Assuming newDate is an instance of CalendarDate from @internationalized/date
        setDate(formattedDate);
    };

    return (
        <Calendar aria-label="Appointment date" className={styles.react_aria_Calendar} defaultValue={parseDate(dateValue)} onChange={handleChange}>
            <header>
                <Heading className={styles.react_aria_Heading} />
                <div>
                    <Button className={styles.react_aria_Button} slot="previous">◀</Button>
                    <Button className={styles.react_aria_Button} slot="next">▶</Button>
                </div>

            </header>
            <CalendarGrid>
                {(date) => <CalendarCell className={styles.react_aria_CalendarCell} date={date} />}
            </CalendarGrid>
        </Calendar>
    )
}

export default CalendarDropdown