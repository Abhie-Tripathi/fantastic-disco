import React from 'react'
import styles from './selectevent.style.module.css'
import PromotedEvents from './PromotedEvents';
import NormalEvents from './NormalEvents';

interface SelectProps {
    promotedEventOn: boolean;
    promotedEventLimit : number;
}

const SelectEvents = ({promotedEventOn, promotedEventLimit} : SelectProps) => {

    return (
        <div className={styles.body}>
            <PromotedEvents promotedEventOn={promotedEventOn} promotedEventLimit={promotedEventLimit}  />
            <NormalEvents/>
        </div>
    )
}

export default SelectEvents