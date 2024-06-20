import React from 'react'
import styles from './widgetoptions.style.module.css'
import WidgetCard from './WidgetCard'

interface Props {
    setWidgetSelected: (value: string) => void
    widgetSelected: string;
}

const WidgetOptions = ({ setWidgetSelected, widgetSelected }: Props) => {
    return (
        <div className={styles.body}>
            <div className={styles.headingContainer}>
                <div className={styles.heading}>Select Your Widget Type</div>
                <div className={styles.subheading}>Customize Your Website's Functionality with the widget that perfectly fit your style!</div>
            </div>
            <div className={styles.widgetOptions}>
                <WidgetCard widgetType="Page" setWidgetSelected={setWidgetSelected} widgetSelected={widgetSelected}/>
                <WidgetCard widgetType="Section" setWidgetSelected={setWidgetSelected} widgetSelected={widgetSelected}/>
                <WidgetCard widgetType="Sticky" setWidgetSelected={setWidgetSelected} widgetSelected={widgetSelected} />
                <WidgetCard widgetType="Popup" setWidgetSelected={setWidgetSelected} widgetSelected={widgetSelected} />
            </div>
        </div>
    )
}


export default WidgetOptions