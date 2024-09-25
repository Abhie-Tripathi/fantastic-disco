import React from 'react'
import styles from './listandgrid.style.module.css'
import EventListCard from '../../listcardsstyles/EventListCard1'
interface CardProps {
    demoBanner:string;
    demoEventName:string;
    demoDescription:string
    demoLocation:string
}
const ListAndGridView = ({ demoBanner, demoEventName, demoDescription, demoLocation}:CardProps) => {
    return (
        <div className={styles.list_gridView}>
            <EventListCard  demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation}/>
            <EventListCard  demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation}/>
            <EventListCard  demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation}/>
            <EventListCard  demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation}/>
            <EventListCard  demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation}/>
            <EventListCard  demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation}/>
        </div>
    )
}

export default ListAndGridView