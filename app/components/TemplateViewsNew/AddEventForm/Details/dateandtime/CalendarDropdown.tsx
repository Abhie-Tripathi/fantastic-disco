import React from 'react'
import styles from './calendar.style.module.css'
import { Button, Calendar, CalendarCell, CalendarGrid, Heading } from 'react-aria-components';
import { parseDate } from '@internationalized/date';
import { FormState } from '@/types/Formstate';

interface Props {
    // setDate: (value: string) => void
    handleChange: (field: keyof FormState, value: any) => void;
    dateValue: string
    type : string;
    minDate?: string; 
    maxDate? : string;
}

const CalendarDropdown = ({ handleChange, dateValue,minDate,maxDate,type }: Props) => {

    const handleDateChange = (newDate: any) => {
        const formattedDate = newDate.toString(); // Assuming newDate is an instance of CalendarDate from @internationalized/date
        if(type === "start"){
            handleChange('startDate', formattedDate)
        }else{
            handleChange('endDate',formattedDate)
        }
        // setDate(formattedDate);
    };

    return (
        <Calendar aria-label="Appointment date" className={styles.react_aria_Calendar} defaultValue={parseDate(dateValue)} onChange={handleDateChange} minValue={minDate ? parseDate(minDate) : undefined} maxValue={maxDate ? parseDate(maxDate) : undefined}> 
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