import React from 'react'
import styles from './listandgrid.style.module.css'
import EventListCard from '../../listcardsstyles/EventListCard1'

const ListAndGridView = () => {
    return (
        <div className={styles.list_gridView}>
            <EventListCard />
            <EventListCard />
            <EventListCard />
            <EventListCard />
            <EventListCard />
            <EventListCard />
        </div>
    )
}

export default ListAndGridView