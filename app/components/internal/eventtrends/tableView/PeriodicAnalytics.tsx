import React from "react";
import styles from "./table.style.module.css";

const eventData = [
  {
    date: "01 Mar 2024",
    total: 236,
    community: 45,
    concerts: 23,
    conferences: 167,
    expos: 98,
    festivals: 54,
    performance: 32,
    sports: 18,
    events: "View All",
  },
];

const PeriodicAnalytics = () => {
  return (
    <>
    <div className="desktop_view tablet_view">
      <div className={styles.analytics_header}>
        <span style={{ fontWeight: 500, fontSize: "16px" }}>
          TOTAL FOR THE SELECTED TIME PERIODS (01 MAR 24 - 31 MAR 24)
        </span>
      </div>
      <div className={styles.table_container}>
        <table className={styles.table}>
          <thead className={styles.table_head}>
            <tr className={styles.table_head_row}>
              <th></th>
              <th>Total</th>
              <th>Community</th>
              <th>Concerts</th>
              <th>Conference</th>
              <th>Expos</th>
              <th>Festivals</th>
              <th>Performance</th>
              <th>Sports</th>
              <th></th>
            </tr>
          </thead>

          <tbody className={styles.table_body}>
            {eventData.map((event) => (
              <tr key={event.date}>
                <td>Predicted No of Events</td>
                <td>{event.total}</td>
                <td>{event.community}</td>
                <td>{event.concerts}</td>
                <td>{event.conferences}</td>
                <td>{event.expos}</td>
                <td>{event.festivals}</td>
                <td>{event.performance}</td>
                <td>{event.sports}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="mobile_view">
      <div className={styles.mobileTable_container}>
        <div className={styles.mobile_header}>
          <div style={{ fontWeight: 500, marginBottom:"10px" }}>
            TOTAL FOR THE SELECTED TIME PERIODS (01 MAR 24 - 31 MAR 24)
          </div>
          <div style={{ fontWeight: "700", marginBottom:"10px" }}>Predicted No of Events</div>
        </div>
        <table className={styles.mobile_table}>
          <tbody>
          {eventData.map((event, index) => (
            <React.Fragment key={index}>
              <tr>
                <th>Total</th>
                <td>{event.total}</td>
              </tr>
              <tr>
                <th>Community</th>
                <td>{event.community}</td>
              </tr>
              <tr>
                <th>Concerts</th>
                <td>{event.concerts}</td>
              </tr>
              <tr>
                <th>Conference</th>
                <td>{event.conferences}</td>
              </tr>
              <tr>
                <th>Expos</th>
                <td>{event.expos}</td>
              </tr>
              <tr>
                <th>Festivals</th>
                <td>{event.festivals}</td>
              </tr>
              <tr>
                <th>Performance</th>
                <td>{event.performance}</td>
              </tr>
              <tr>
                <th>Sports</th>
                <td>{event.sports}</td>
              </tr>
            </React.Fragment>
          ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default PeriodicAnalytics;