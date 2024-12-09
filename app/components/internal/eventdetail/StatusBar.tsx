"use client";
import React from "react";
import styles from "./eventdesc.style.module.css";
import StatusIcon from "./icons/status";
import StatusIcon2 from "./icons/status2";

interface Props {
  status: number;
  handleStatusChange: any;
  configData: any;
  pipelineIndex: number;
}

const StatusBar = ({
  status,
  handleStatusChange,
  configData,
  pipelineIndex,
}: Props) => {
  return (
    <div className={styles.outreachStatusContainer}>
      {configData.map((item: any, index: number) => (
        <div
          className={styles.statusCard}
          onClick={() => handleStatusChange(item.status)}
        >
          {index === 0 ? (
            <StatusIcon
              fillColor={"var(--primary-color)"}
              borderColor={"var(--primary-color)"}
            />
          ) : index < pipelineIndex ? (
            <StatusIcon2 fillColor={"var(--primary-color)"} borderColor={""} />
          ) : index === pipelineIndex ? (
            <StatusIcon2
              fillColor={"var(--primary-color)"}
              borderColor={"var(--primary-color)"}
            />
          ) : (
            <StatusIcon2
              fillColor={"var(--heading-background-color)"}
              borderColor={""}
            />
          )}
          <div
            className={styles.statusText}
            style={{
              color:
                index <= pipelineIndex
                  ? "white"
                  : "var(--secondary-text-color)",
            }}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusBar;
