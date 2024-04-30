import React from 'react';
import styles from './employeeNavbar.module.css';
import swapIcon from '/public/swap.svg';
import addIcon from '/public/add.svg';
import CalendarIcon from '/public/calendar.svg';
import Image from 'next/image';
import { useTheme } from '@/context';

interface Props {
  handleAddEvent: () => void;
}

const EmployeeNavbar: React.FC<Props> = ({ handleAddEvent }) => {
  const {theme} = useTheme();
  return (
    <div className={`${styles.navbar} ${theme === 'light' ? styles.light: ""}`}>
      <div className={styles.heading}>
        <Image src={CalendarIcon} alt="calendarIcon" />
        <div>Upcoming Events</div>
      </div>
      <div className={styles.btns}>
        <div className={styles.sort}>
          <Image alt="swapIcon" src={swapIcon} />
        </div>
        <div className={styles.add} onClick={handleAddEvent}>
          <Image src={addIcon} alt="addIcon" />
          New Event
        </div>
      </div>
    </div>
  );
};

export default EmployeeNavbar;
