import React from 'react'
import styles from './datepicker.style.module.css'
import { Button, Calendar, CalendarCell, CalendarGrid, DateInput, DatePicker, DateSegment, Dialog, Group, Heading, Label, Popover } from 'react-aria-components';

const DatePickerComp = () => {
  return (
    <DatePicker className={styles.reactAriaDatePicker}>
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
  )
}

export default DatePickerComp