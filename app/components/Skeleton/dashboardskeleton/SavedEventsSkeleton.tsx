import React from "react";
import { Skeleton } from "@mui/material";
import styles from "./savedevents.module.css";
const SavedEventsSkeleton = () => {
  return (
    <div className={styles.savedEventsData}>
      {Array.from({ length: 5 }).map((_, index) => (
        <div className={styles.savedEvent} key={index}>
          <Skeleton
            animation="wave"
            variant="rectangular"
            width="100%"
            height={30}
          />
        </div>
      ))}
    </div>
  );
};

export default SavedEventsSkeleton;
