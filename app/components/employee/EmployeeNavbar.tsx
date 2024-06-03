import React from 'react';
import styles from './employeeNavbar.module.css';
import swapIcon from '/public/swap.svg';
import addIcon from '/public/Add.svg';
import CalendarIcon from '/public/calendar.svg';
import Image from 'next/image';
import { useTheme } from '@/context';

interface Props {
  handleAddEvent: () => void;
}

const EmployeeNavbar: React.FC<Props> = ({ handleAddEvent }) => {
  const { theme } = useTheme();
  const iconClass = theme === 'light' ? 'icons_light' : 'icon'
  return (
    <div className={`${styles.navbar} ${theme === 'light' ? styles.light : ""}`}>
      <div className={styles.heading}>
        <Image src={CalendarIcon} alt="calendarIcon" className={iconClass} />
        <div>Upcoming Events</div>
      </div>
      <div className={styles.btns}>
        <div className={styles.sort}>
          <Image alt="swapIcon" src={swapIcon} className={iconClass} />
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
