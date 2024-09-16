import React from "react";
import styles from "./table.style.module.css";

interface Event {
  slug: string;
  attendance: number;
  categoryName: string;
}

interface GroupingByDate {
  [date: string]: Event[];
}

const calculateTotal = (data: any) => {
  let total = 0;
  for (const key in data) {
    total += data[key];
  }
  return formatCount(total);
};
const formatCount = (count: number) => {
  if (count >= 1000) {
    const value = count / 1000;
    const decimalPart = value - Math.floor(value);
      return `${Math.floor(value)}k`;
  }
  return count;
};
function capitalizeEachWord(str: string) {
  const words = str.split("-");

  const capitalizedWords = words.map((word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return capitalizedWords.join(" ");
}

const PeriodicAnalytics = ({ predictedData, activeChip }: any) => {
  const total = calculateTotal(predictedData);
  const filteredData = Object.entries(predictedData).filter(
    ([key, value]) => value !== null
  );
  return (
    <>
      <div className="desktop_view tablet_view">
        <div className={styles.analytics_header}>
          <span style={{ fontWeight: 500, fontSize: "16px" }}>
            TOTAL FOR THE SELECTED TIME PERIODS
          </span>
        </div>
        <div className={styles.table_container}>
          <table className={styles.table}>
            <thead className={styles.table_head}>
              <tr className={styles.table_head_row}>
                <th style={{ width: "250px" }}></th>
                <th>Total</th>
                {filteredData.map(([key]) => (
                  <th key={key}>{capitalizeEachWord(key)}</th>
                ))}
                <th></th>
              </tr>
            </thead>

            <tbody className={styles.table_body}>
              <tr>
                <td>
                  <div style={{ width: "200px" }}>
                    {activeChip === "Predicted Attendance"
                      ? "Predicted No. of Attendace"
                      : "Predicted No. of Events"}
                  </div>
                </td>
                <td>{total}</td>
                {filteredData.map(([key, value]: [string, any]) => (
                  <td key={key}>{formatCount(value)}</td>
                ))}
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mobile_view">
        <div className={styles.mobileTable_container}>
          <div className={styles.mobile_header}>
            <div style={{ fontWeight: 500, marginBottom: "10px" }}>
              TOTAL FOR THE SELECTED TIME PERIODS (01 MAR 24 - 31 MAR 24)
            </div>
            <div style={{ fontWeight: "700", marginBottom: "10px" }}>
              Predicted No of Events
            </div>
          </div>
          <table className={styles.mobile_table}>
            <tbody>
              <tr>
                <th>Total</th>
                <td>{total}</td>
              </tr>
              {Object.entries(predictedData).map(
                ([key, value]: [string, any]) => (
                  <tr key={key}>
                    <th>{key}</th>
                    <td>{value}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PeriodicAnalytics;