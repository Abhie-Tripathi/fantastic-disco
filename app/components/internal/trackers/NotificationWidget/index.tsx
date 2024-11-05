import UserProfile from '@/app/components/userProfile/UserProfile';
import Reply from '@/public/reply.svg'
import Image from 'next/image';
import styles from './notificationWidget.style.module.css'
import React,{useState,useEffect} from 'react';
// Define the type for the note prop

const NotificationWidget: React.FC = ({ }) => {
    // const [displayNote, setDisplayNote] = useState(note);

    // useEffect(() => {
    //   if (note !== undefined) {
    //     setDisplayNote(note);
    //   }
    // }, [note]);
    // console.log(displayNote[0]?.id);
    
  return (
    <div className="flex w-[100%] flex-col gap-2 border rounded-[12px] p-4 bg-[var(--primary-foreground)]" style={{ border: "1px solid var(--border-color)" }}>
      <div className='flex items-center gap-2'>
        <div className='font-semibold text-[var(--primary-color)]'>Notify me</div>
      </div>
      <div className='relative flex items-center justify-center text-sm text-[var(--secondary-text-color)]'>
      Quickly customise your notification preferences for instant updates
      </div>
      <div className='flex justify-between h-[40px] items-center'>
        <div>
        <span className='flex items-center'>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={true}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </span>
        </div>
        <div className='text-[var(--primary-color)] text-sm'>Configure</div>
      </div>
    </div>
  );
};

export default NotificationWidget;
