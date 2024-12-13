"use client";
import React, { useEffect, useState } from "react";
import styles from "./eventdesc.style.module.css";
// import tooltip from '@/app/components/trackers/sideNav/sideNav.style.module.css'
import Image from "next/image";
import PeopleIcon from "/public/user.svg";
// import PlaceHolder from "/public/speaker1.jpeg";
import downArrowIcon from "/public/arrow_down.svg";
import { useTheme } from "@/context";
// import { Envelope, Phone } from "geist-icons";
import { useCoordinateService } from "@/services/coordinateService";
import { pocDetail } from "@/types/coordinateEventType";
import Text from "@/components/new-ui/Text";
import { CircleSlash, MailIcon, PhoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  setExpandedTab: any;
}

const EventNotes = ({ setExpandedTab }: Props) => {
  const [accordianToggle, setAccordianToggle] = useState(open);
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";
  const [pocData, setPocData] = useState<pocDetail[]>([]);
  const coordinateService = useCoordinateService();

  return (
    <div className={`${styles.container} card`}>
      <div className={styles.header} onClick={() => setExpandedTab("notes")}>
        <Image src={PeopleIcon} alt="page" className={iconClass} />
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
