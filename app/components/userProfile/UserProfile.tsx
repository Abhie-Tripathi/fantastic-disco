import React from 'react'
import styles from './userProfile.style.module.css'
interface UserProfileProps {
    name: string;
    width?: number; 
    height?: number; 
    borderRadius?: string;
}
const UserProfile: React.FC<UserProfileProps> = ({ name, width, height, borderRadius }) => {
    const getInetial = () => {
        const splitedName = name.split(" "); 
        if (splitedName.length === 1) {
           return splitedName[0].charAt(0).toUpperCase(); 
        } else {
            return splitedName[0].charAt(0).toUpperCase() + splitedName[1].charAt(0).toUpperCase(); 
        }
    };
    
  return (
    <div className={styles.container} style={{width: width, fontSize:"0.5rem", height: height, borderRadius: `${borderRadius}`}}>
      {getInetial()}
    </div>
  )
}

export default UserProfile
