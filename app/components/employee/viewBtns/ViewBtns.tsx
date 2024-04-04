import React, { useState } from 'react';
import styles from './viewBtns.module.css';

interface Props {
    handleSelectedData: (view: string) => void;
}

const ViewBtns: React.FC<Props> = ({ handleSelectedData }) => {
    const [selectedView, setSelectedView] = useState<string>('list'); 

    const handleButtonClick = (view: string): void => {
        setSelectedView(view);
        handleSelectedData(view);
    };

    return (
        <div className={styles.btns}>
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
