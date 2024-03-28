import React, { useEffect, useState } from 'react'
import { Button, CalendarCell, CalendarGrid, DateInput, DateRangePicker, DateSegment, Dialog, Group, Heading, Label, Popover, RangeCalendar } from 'react-aria-components';
import Down from "../../icons/downArrow.svg";
import  Styles from './rangePicker.style.module.css'
import { parseDate } from '@internationalized/date';

const RangePicker = ({ demoEvent,startDate, endDate, disabled }) => {
    const [startValue, setStartValue] = useState("2020-02-03");
    const [endValue, setEndValue] = useState("2020-02-03");
    const [value, setValue] = React.useState({
        start: parseDate(startValue),
        end: parseDate(endValue)
    });
    const result = demoEvent.filter((item) => (
        parseInt(item.startDate.substring(3, 5)) >= value.start.day &&
    parseInt(item.startDate.substring(0, 2)) >= value.start.month &&
    parseInt(item.startDate.substring(6, 10)) >= value.start.year &&
    parseInt(item.endDate.substring(3, 5)) <= value.end.day &&
    parseInt(item.endDate.substring(0, 2)) <= value.end.month &&
    parseInt(item.endDate.substring(6, 10)) <= value.end.year
      ));
      console.log(demoEvent[0].endDate.substring(3, 5) <= value.end.day)
      console.log(result);
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
        <><div>Event Date</div>
        <DateRangePicker className={Styles.reactAriaDateRangePicker} value={value}
            onChange={setValue} >
                
            <Label></Label>
            <Group className={Styles.reactAriaGroup}>
                <DateInput className={Styles.reactAriaDateInput} slot="start">
                    {(segment) => <DateSegment segment={segment} />}
                </DateInput>
                <span aria-hidden="true">–</span>
                <DateInput className={Styles.reactAriaDateInput} slot="end">
                    {(segment) => <DateSegment segment={segment} />}
                </DateInput>
                <Button className={Styles.dropBtn} isDisabled={disabled}><img src={Down} alt="down"/></Button>
            </Group>
            <Popover className={Styles.reactAriaPopover}>
                <Dialog>
                    <RangeCalendar className={Styles.reactAriaRangeCalendar}>
                        <header>
                            <Button className={Styles.reactAriaButton} slot="previous">◀</Button>
                            <Heading className={Styles.reactAriaHeading} />
                            <Button className={Styles.reactAriaButton} slot="next">▶</Button>
                        </header>
                        <CalendarGrid>
                            {(date) => <CalendarCell date={date} className={Styles.reactAriaCalendarCell} />}
                        </CalendarGrid>
                    </RangeCalendar>
                </Dialog>
            </Popover>
        </DateRangePicker>
        </>
    )
}

export default RangePicker