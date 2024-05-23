import React from 'react'
import styles from './listview.style.module.css'
import EventListCard from '../../../EventListCard';

const ListView = () => {
    return (
        <div className={styles.listView}>
            <EventListCard />
            <EventListCard />
            <EventListCard />
            <EventListCard />
        </div>
    )
}

export default ListView