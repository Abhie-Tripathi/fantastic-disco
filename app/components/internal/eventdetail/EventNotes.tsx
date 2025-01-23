"use client";
import React from "react";
import styles from "./eventdesc.style.module.css";
import Image from "next/image";
import PeopleIcon from "/public/user.svg";
import downArrowIcon from "/public/arrow_down.svg";
import { useTheme } from "@/context";
import { MessageSquareMore } from "lucide-react";

interface Props {
  setExpandedTab: any;
}

const EventNotes = ({ setExpandedTab }: Props) => {
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";

  return (
    <div className={`${styles.container} card`}>
      <div className={styles.header} onClick={() => setExpandedTab("notes")}>
        {/* <Image src={PeopleIcon} alt="page" className={iconClass} /> */}
        <MessageSquareMore width="24px" height="24px"/>
        <div className={styles.eventDetail_header}>
          Notes
          <span className={styles.image_container}>
            <Image
              src={downArrowIcon}
              alt="dropdown"
              width={15}
              height={15}
              style={{ transform: "rotate(-90deg)" }}
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventNotes;
