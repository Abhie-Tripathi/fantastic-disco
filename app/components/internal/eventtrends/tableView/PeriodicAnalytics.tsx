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
    </>
  );
};

export default PeriodicAnalytics;