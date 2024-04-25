import React, { useEffect, useState } from "react";
import styles from "./table.module.css";
import ExpandAll from "/public/expandAll.svg";
import saveIcon from "/public/save.svg";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/components/UI/Loading";

const Table = ({
    eventData
}: {
    eventData: any;
}) => {
    const [currPage, setCurrPage] = useState(1);
    const [eventPerPage, setEventPerPage] = useState([]);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(eventData.length / itemsPerPage);

    useEffect(() => {
        const startInd = (currPage - 1) * itemsPerPage;
        const endInd = startInd + itemsPerPage;
        setEventPerPage(eventData.slice(startInd, endInd));
    }, [currPage]);

    if (eventPerPage.length === 0) {
        return <Loading />;
    }

    return (
        <div className={styles.table_container}>
            <div className={styles.table_wrapper}>
                <table className={styles.table}>
                    <thead className={styles.table_head}>
                        <tr className={styles.table_head_row}>
                            <th className={styles.table_firstColumn}>Event</th>
                            <th>Date</th>
                            <th>Venue</th>
                            <th>City</th>
                            <th>Country</th>
                            <th>Category</th>
                            <th>Rank</th>
                            <th>Growth</th>
                            <th>Rept. Sentiment</th>
                            <th>Repeat Sentiment</th>
                            <th>Event Size</th>
                            <th>Est. Exhibitor</th>
                            <th>Global</th>
                            <th
                                className={`${styles.table_actionColumn} ${styles.table_actionColumn_header}`}
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className={styles.table_body}>
                        {eventPerPage.map((event: any) => (
                            <tr key={event.title}>
                                <td>
                                    <div className={styles.event_title}>
                                        <Link
                                            href={`/event-analytics/${event.event}`}
                                            style={{ textDecoration: "none", color: "#6750A4" }}
                                        >
                                            {event.eventDetail.name.length > 80
                                                ? event.eventDetail.name.slice(0, 80) + "..."
                                                : event.eventDetail.name}
                                        </Link>
                                    </div>
                                    <div className={styles.event_organizer}>
                                        {event.eventDetail.organizer}
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.event_date}>
                                        {event.eventDetail.startDate}
                                    </div>
                                    <div className={styles.event_date}>
                                        {event.eventDetail.endDate}
                                    </div>
                                </td>
                                <td>The World Bank</td>
                                <td>{event.eventDetail.city_name}</td>
                                <td>{event.eventDetail.country_name}</td>
                                <td>Finance & Banking</td>
                                <td>Rank</td>
                               <td>Growth</td>
                                <td>Reputation Sentiment</td>
                                <td>Repeat Sentiment</td>
                                <td>Event Size</td>
                                <td>Estimated Exhibitor</td>
                               <td>Global</td>
                                <td className={styles.table_actionColumn}>
                                    <div className={styles.save_image_container}>
                                        {/* <Image src={saveIcon} alt="Save" width={30} height={30} /> */}
                                        <div className={styles.saveBtn}>Save</div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={styles.pagination_container}>
                <div
                    className={`${styles.pagination_control_button} ${currPage === 1 ? styles.disabled : ""
                        }`}
                    onClick={() => setCurrPage((page) => page - 1)}
                >
                    Previous
                </div>

                <div className={styles.pagination_info_container}>
                    <div>Showing</div>
                    <Image src={ExpandAll} alt="expandall" />
                    <div className={styles.pagination_current_pageno}>
                        <select name="" id="" className={styles.pagination_noOfPage}>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                        </select>
                    </div>
                    <div>results/Page</div>
                </div>

                <div className={styles.pagination_page_control_container}>
                    <div>Page</div>
                    <div className={styles.pagination_current_page}>{currPage}</div>
                    <div>of {totalPages}</div>
                </div>

                <div
                    className={`${styles.pagination_control_button} ${currPage === totalPages ? styles.disabled : ""
                        }`}
                    onClick={() => setCurrPage((page) => page + 1)}
                >
                    Next
                </div>
            </div>
        </div>
    );
};

export default Table;