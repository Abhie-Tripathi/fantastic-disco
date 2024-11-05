import React from "react";
import styles from "../trackerUser/trackerUser.style.module.css";
import Person1 from "/public/person1.svg";
import Image from "next/image";
type AdminData = {
  name: string;
  email: string;
};

type TrackerOwnerProps = {
  adminData: AdminData[];
};

const TrackerOwner: React.FC<TrackerOwnerProps> = ({ adminData }) => {
  console.log(adminData);

  const userHandle = (name: string): string => {
    const last = name.substring(1, name.length).split(' ').map(item => item.toLowerCase()).join("");
    const formattedName = `@${name.charAt(0)}${last}`;
    return formattedName;
  };

  const abbreviation = (name: string): string => {
    return name?.split(' ').map(word => word[0]?.toUpperCase()).join('') ?? '';  
  };

  return (
    <div className="flex w-[100%] p-5 flex-col gap-3 border border-[var(--border-color)] rounded-[12px]">
      <div className="flex w-[100%] justify-between items-center">
        <div className="text-[var(--secondary-text-color)] font-medium">Tracker Owners</div>
        {/* <div className={styles.add}>Add owners</div> */}
      </div>
      <div className={styles.bar}></div>
      <div className={styles.profiles}>
        {adminData &&
          adminData.map((item, index) => (
            <div className={styles.profile} key={index}>
              <div className={styles.profileInner}>
                {/* <div className={styles.square}>-</div> */}
                <div>
                  <div className={styles.profileCircle}>{abbreviation(item.name)}</div>
                  {/* <Image src={Person1} alt="person1" /> */}
                </div>
                <div>
                  <div className={styles.name}>
                    {item.name}{" "}
                    
                  </div>
                  <span className={styles.tag}>{userHandle(item.name)}</span>
                  {/* <div className={styles.email}>{item?.email}</div> */}
                </div>
              </div>
              <div className={styles.add} style={{ textDecoration: "none" }}>
                Super Admin
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TrackerOwner;
