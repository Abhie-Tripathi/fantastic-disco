'use client'
import React, { useState, useEffect } from 'react'
import styles from './datepicker.style.module.css'
import { Button, Calendar, CalendarCell, CalendarGrid, DateInput, DatePicker, DateSegment, Dialog, Group, Heading, Label, Popover } from 'react-aria-components';
import { parseDate } from '@internationalized/date';

interface RangeProp {
    handleDate: (range: any) => void;
    date: string;
}

const DatePickerComp = ({ handleDate, date }: RangeProp) => {

    const [currDate, setCurrDate] = useState('2024-02-03')
    let [value, setValue] = React.useState(parseDate(currDate));

    useEffect(() => {
        if (date) {
            const extractedDate = date.split('T')[0];
            setCurrDate(extractedDate);
            setValue(parseDate(extractedDate));
        }
    }, [date]);


    const handleOnChange = (range: any) => {
        const currDate = `${range.year}-${range.month}-${range.day}`
        const finalDate = new Date(currDate.toString()).toISOString()
        setValue(range)
        handleDate(finalDate)
    }

    return (
        <>
            {date ? (
                <DatePicker
                    className={styles.reactAriaDatePicker}
                    onChange={handleOnChange}
                    value={value}
                >
                    <Label></Label>
                    <Group className={styles.reactAriaGroup}>
                        <DateInput className={styles.reactAriaDateInput}>
                            {(segment) => <DateSegment segment={segment} />}
                        </DateInput>
                        <Button className={styles.reactAriaButton}>▼</Button>
                    </Group>
                    <Popover className={styles.reactAriaPopover}>
                        <Dialog>
                            <Calendar className={styles.reactAriaCalendar}>
                                <header>
                                    <Button className={styles.reactAriaButton} slot="previous">◀</Button>
                                    <Heading className={styles.reactAriaHeading} />
                                    <Button className={styles.reactAriaButton} slot="next">▶</Button>
                                </header>
                                <CalendarGrid>
                                    {(date) => <CalendarCell date={date} className={styles.reactAriaCalendarCell} />}
                                </CalendarGrid>
                            </Calendar>
                        </Dialog>
                    </Popover>
                </DatePicker>
            ) : (
                <DatePicker
                    className={styles.reactAriaDatePicker}
                    onChange={handleOnChange}
                >
                    <Label></Label>
                    <Group className={styles.reactAriaGroup}>
                        <DateInput className={styles.reactAriaDateInput}>
                            {(segment) => <DateSegment segment={segment} />}
                        </DateInput>
                        <Button className={styles.reactAriaButton}>▼</Button>
                    </Group>
                    <Popover className={styles.reactAriaPopover}>
                        <Dialog>
                            <Calendar className={styles.reactAriaCalendar}>
                                <header>
                                    <Button className={styles.reactAriaButton} slot="previous">◀</Button>
                                    <Heading className={styles.reactAriaHeading} />
                                    <Button className={styles.reactAriaButton} slot="next">▶</Button>
                                </header>
                                <CalendarGrid>
                                    {(date) => <CalendarCell date={date} className={styles.reactAriaCalendarCell} />}
                                </CalendarGrid>
                            </Calendar>
                        </Dialog>
                    </Popover>
                </DatePicker>
            )}
        </>
    );

}

export default DatePickerComp