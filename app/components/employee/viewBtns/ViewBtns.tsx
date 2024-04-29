import React, { useState } from 'react';
import styles from './viewBtns.module.css';
import { useTheme } from '@/context';

interface Props {
    handleSelectedData: (view: string) => void;
}

const ViewBtns: React.FC<Props> = ({ handleSelectedData }) => {
    const [selectedView, setSelectedView] = useState<string>('list'); 
    const {theme} = useTheme();

    const handleButtonClick = (view: string): void => {
        setSelectedView(view);
        handleSelectedData(view);
    };

    return (
        <div className={`${styles.btns} ${theme === 'light' ? styles.light : ""}`}>
            <button onClick={() => handleButtonClick('list')} className={`${styles.listBtn} ${selectedView === 'list' ? styles.activeBtn : ''}`}>
                List
            </button>
            <button onClick={() => handleButtonClick('map')} className={`${styles.mapBtn} ${selectedView === 'map' ? styles.activeBtn : ''}`}>
                Map
            </button>
            <button onClick={() => handleButtonClick('calendar')} className={`${styles.calendarBtn} ${selectedView === 'calendar' ? styles.activeBtn : ''}`}>
                Calendar
            </button>
        </div>
    );
};

export default ViewBtns;
