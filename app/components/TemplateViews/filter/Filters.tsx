import React, { useState } from 'react'
import styles from './filters.style.module.css'
import { useTheme } from "@/context";
import AddEventModal from '../../AddEventModal';
import YourEvent from './yourevents/YourEvent';
import SelectEvents from './selectevents/SelectEvents';

interface FilterProps {
    promotedEventOn: boolean;
    promotedEventLimit: number;
}

const Filters = ({ promotedEventOn, promotedEventLimit }: FilterProps) => {
    const { theme } = useTheme();
    const [activeNavItem, setActiveNavItem] = useState<string>("yourevents");

    const handleNavItemClick = (item: string) => {
        setActiveNavItem(item);
    };

    return (
        <div className={styles.body}>
            <div className={styles.nav}>
                <div className={`${styles.navItem} ${activeNavItem === "yourevents" ? styles.activeNavItem : ""}`} onClick={() => handleNavItemClick("yourevents")}>Your Events</div>
                <div className={`${styles.navItem} ${activeNavItem === "select" ? styles.activeNavItem : ""}`} onClick={() => handleNavItemClick("select")}>Select Events</div>
                <div className={`${styles.navItem} ${activeNavItem === "add" ? styles.activeNavItem : ""}`} onClick={() => handleNavItemClick("add")}>Add Event</div>
            </div>
            <div className={styles.activeWindow}>
                {activeNavItem === "add" && <AddEventModal style='column' />}
                {activeNavItem === "select" && <SelectEvents promotedEventLimit={promotedEventLimit} promotedEventOn={promotedEventOn} />}
                {activeNavItem === "yourevents" && <YourEvent />}
            </div>
        </div>
    );
}

export default Filters