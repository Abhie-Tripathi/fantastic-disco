"use client";
import React, { useState } from "react";
import styles from "./eventtable.style.module.css";
import ExpandAll from "/public/expand.svg";
import unSaveIcon from '/public/internal/unsave.svg'
import Filter from "/public/filter.svg";
import Image from "next/image";
import { useTheme } from "@/context";

const EventTable = ({ eventData }: { eventData: any }) => {
  const [showCheckBox, setShowCheckBox] = useState(false);
  // const [selectMode, setSelectMode] = useState(false);
  const { theme } = useTheme();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const iconClass = theme === "light" ? "icons_light" : "icon";

  const handleSelectItems = () => {
    setShowCheckBox((prev) => !prev);
    if (showCheckBox) {
      setSelectedIds([]);
    }
  };

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    eventId: string
  ) => {
    if (!selectedIds.includes(eventId)) {
      setSelectedIds([...selectedIds, eventId]);
    } else {
      setSelectedIds(selectedIds.filter((id) => id !== eventId));
    }
  };

  const removeSavedHanlder = () => {
    setShowCheckBox(false);
    setSelectedIds([]);
  };

  return (
    <div className={styles.table_container}>
      <div className={styles.table_header_title}>Recently added events</div>
      <div className={styles.table_header_button_container}>
        <div className={styles.secondary_button} onClick={handleSelectItems}>
          {showCheckBox ? "Clear Selection" : "Select Items"}
        </div>
        <div className={styles.right_buttons_container}>
          {selectedIds.length > 0 && (
            <div className={styles.secondary_button} onClick={removeSavedHanlder}>
              <Image src={unSaveIcon} alt="filter" className={iconClass} width={20} height={20} />
              <div>Unsave</div>
            </div>
          )}
          <div className={styles.secondary_button}>
            <Image src={Filter} alt="filter" className={iconClass} />
            <div>Filters</div>
          </div>
        </div>
      </div>
      <table className={styles.table}>
        <thead
          className={`${styles.table_head} ${theme === "light" ? styles.table_head_light : ""
            }`}
        >
          <tr className={styles.table_head_row}>
            {showCheckBox && <th></th>}
            <th>Event Name</th>
            <th>Event Date</th>
            <th>Location</th>
            <th>Category</th>
            <th>
              <div className={styles.table_head_title}>
                <div>Est.. Audience</div>
                <Image src={ExpandAll} alt="expandall" className={iconClass} />
              </div>
            </th>
            <th>
              <div className={styles.table_head_title}>
                <div>Intl.. Audience</div>
                <Image src={ExpandAll} alt="expandall" className={iconClass} />
              </div>
            </th>
          </tr>
        </thead>

        <tbody className={styles.table_body}>
          {eventData.map((event: any) => (
            <tr key={event.id}>
              {showCheckBox && (
                <td>
                  <input
                    type="checkbox"
                    onChange={(e) => handleCheckboxChange(e, event.id)}
                  />
                </td>
              )}
              <td>
                <div className={styles.event_title}>{event.title}</div>
                <div className={styles.event_organizer}>{event.organizer}</div>
              </td>
              <td>
                <div className={styles.event_date}>{event.startdate}</div>
                <div className={styles.event_date}>{event.enddate}</div>
              </td>
              <td>{event.location}</td>
              <td>{event.category}</td>
              <td>{event.est_audience}</td>
              <td>{event.intl_audience}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        className={`${styles.pagination_container} ${theme === "light" ? styles.pagination_container_light : ""
          }`}
      >
        <div
          className={`${styles.pagination_control_button} ${theme === "light" ? styles.pagination_control_button_light : ""
            }`}
        >
          Previous
        </div>

        <div
          className={`${styles.pagination_info_container} ${theme === "light" ? styles.pagination_info_container_light : ""
            }`}
        >
          <div>Showing</div>
          <Image src={ExpandAll} alt="expandall" className={iconClass} />
          <div
            className={`${styles.pagination_current_pageno} ${theme === "light" ? styles.pagination_current_pageno_light : ""
              }`}
          >
            1
          </div>
          <div>results/Page</div>
        </div>

        <div className={styles.pagination_page_control_container}>
          <div>Page</div>
          <div
            className={`${styles.pagination_current_pageno} ${theme === "light" ? styles.pagination_current_pageno_light : ""
              }`}
          >
            1
          </div>
          <div>of 10</div>
        </div>

        <div
          className={`${styles.pagination_control_button} ${theme === "light" ? styles.pagination_control_button_light : ""
            }`}
        >
          Next
        </div>
      </div>
    </div>
  );
};

export default EventTable;
