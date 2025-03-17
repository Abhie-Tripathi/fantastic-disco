import React from "react";
import Image from "next/image";
import Calendar from "@/public/vector.svg";
import person1 from "@/public/person1.svg";
import person2 from "@/public/person2.svg";
import rightArrowIcon from "@/public/rightarrow.svg";
import styles from "./upcomingEvents.style.module.css";
import { useTheme } from "@/context";
const UpcomingEvents = () => {
  const { theme } = useTheme();
  const iconClass = theme === "light" ? styles.icons_light : styles.icon;

  return (
    <div className={`${styles.container} ${theme === 'light' && styles.container_light}`}>
      Upcoming Meetings
      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.card1}>
            <div className={styles.circles}>
              <div className={styles.circle} data-name="John Doe">
                <Image className={styles.image} src={person1} alt="person1" />
              </div>
              <div
                className={styles.circle}
                style={{ marginLeft: "-15px", width: "45px", height: "45px" }}
                data-name="Akash Jindal"
              >
                AJ
              </div>
            </div>
            <div className={styles.eventDetails}>
              <div className={styles.detailContainer}>
                <div>Meet</div>
                <Image
                  src={rightArrowIcon}
                  alt="rightArrowIcon"
                  width={30}
                  height={20}
                  className={iconClass}
                />
              </div>
            </div>
          </div>
          <div className={styles.card2}>
            Event Connect - Discussion with Alexia
          </div>
          <div className={`${styles.card3} ${theme === 'light' && styles.card3_light}`}>
            <Image src={Calendar} alt="Calendar" className={iconClass} />
            <div> 1st Apr 2024 2:30 PM</div>
          </div>
          <div className={styles.card4}>
            <div className={`${styles.hostBtn} ${theme === 'light' && styles.hostBtn_light}`}>HOST</div>
            <div style={{ color: "#8C8EA4", fontSize: "14px" }}>
              @Robslatexv,@alexia_cohade_1
            </div>
          </div>
          <div className={styles.card5}>
            <div style={{ fontSize: "10px", color: "#999999" }}>
              https:/eventgeni.com/event-dicussion14367a2e/joinmeet
            </div>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.card1}>
            <div className={styles.circles}>
              <div className={styles.circle} data-name="Jane Smith">
                <Image className={styles.image} src={person2} alt="person2" />
              </div>
              <div
                className={styles.circle}
                style={{ marginLeft: "-15px", width: "45px", height: "45px" }}
                data-name="Akash Jindal"
              >
                AJ
              </div>
            </div>
            <div className={styles.eventDetails}>
              <div className={styles.detailContainer}>
                <div>Meet</div>
                <Image
                  src={rightArrowIcon}
                  alt="rightArrowIcon"
                  width={30}
                  height={20}
                  className={iconClass}
                />
              </div>
            </div>
          </div>
          <div className={styles.card2}>
            Event Connect - Discussion with Alexia
          </div>
          <div className={`${styles.card3} ${theme === 'light' && styles.card3_light}`}>
            <Image src={Calendar} alt="Calendar" className={iconClass}/>
            <div> 1st Apr 2024 2:30 PM</div>
          </div>
          <div className={styles.card4}>
          <div className={`${styles.hostBtn} ${theme === 'light' && styles.hostBtn_light}`}>HOST</div>
            <div style={{ color: "#8C8EA4", fontSize: "14px" }}>
              @Robslatexv,@alexia_cohade_1
            </div>
          </div>
          <div className={styles.card5}>
            <div style={{ fontSize: "10px", color: "#999999" }}>
              https:/eventgeni.com/event-dicussion14367a2e/joinmeet
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents;
