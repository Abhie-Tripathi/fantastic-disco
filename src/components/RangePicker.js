import React, { useEffect, useState } from 'react'
import { Button, CalendarCell, CalendarGrid, DateInput, DateRangePicker, DateSegment, Dialog, Group, Heading, Label, Popover, RangeCalendar } from 'react-aria-components';
import styles from './rangepicker.style.module.css'
import { parseDate } from '@internationalized/date';

const RangePicker = ({ startDate, endDate, disabled }) => {
    const [startValue, setStartValue] = useState("2020-02-03");
    const [endValue, setEndValue] = useState("2020-02-03");
    const [value, setValue] = React.useState({
        start: parseDate(startValue),
        end: parseDate(endValue)
    });

    useEffect(() => {
        if (startDate) {
            const startDateParts = startDate.split('/');
            const formattedStartDate = `${startDateParts[2]}-${startDateParts[0]}-${startDateParts[1]}`;
            console.log(formattedStartDate)
            setStartValue(formattedStartDate);
        }

        if (endDate) {
            const endDateParts = endDate.split('/');
            const formattedEndDate = `${endDateParts[2]}-${endDateParts[0]}-${endDateParts[1]}`;
            setEndValue(formattedEndDate);
        }
    }, [startDate, endDate]);


    useEffect(() => {
        setValue({
            start: parseDate(startValue),
            end: parseDate(endValue)
        });
    }, [startValue, endValue]);
    return (
        <DateRangePicker className={styles.reactAriaDateRangePicker} value={value}
            onChange={setValue} >
            <Label></Label>
            <Group className={styles.reactAriaGroup}>
                <DateInput className={styles.reactAriaDateInput} slot="start">
                    {(segment) => <DateSegment segment={segment} />}    
                </DateInput>
                <span aria-hidden="true">–</span>
                <DateInput className={styles.reactAriaDateInput} slot="end">
                    {(segment) => <DateSegment segment={segment} />}
                </DateInput>
                <Button className={styles.reactAriaButton} isDisabled={disabled}>▼</Button>
            </Group>
            <Popover className={styles.reactAriaPopover}>
                <Dialog>
                    <RangeCalendar className={styles.reactAriaRangeCalendar}>
                        <header>
                            <Button className={styles.reactAriaButton} slot="previous">◀</Button>
                            <Heading className={styles.reactAriaHeading} />
                            <Button className={styles.reactAriaButton} slot="next">▶</Button>
                        </header>
                        <CalendarGrid>
                            {(date) => <CalendarCell date={date} className={styles.reactAriaCalendarCell} />}
                        </CalendarGrid>
                    </RangeCalendar>
                </Dialog>
            </Popover>
        </DateRangePicker>
    )
}

export default RangePicker