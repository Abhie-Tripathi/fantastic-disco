import React from "react";
import { Skeleton, Card, CardContent } from "@mui/material";
import styles from "./tracker.module.css";

const TrackerSkeleton = () => {
  return (
    <div>
      <div className={styles.skelton_eventCard}>
        <Skeleton
          animation="wave"
          variant="rectangular"
          width="100%"
          height={100}
        />
      </div>

      {/* {Array.from({ length: 3 }).map((_, index) => (
        <>
          <div key={index}>
            <Skeleton
              animation="wave"
              variant="rectangular"
              width="100%"
              height={100}
            />
          </div>
        </>
      ))} */}

      {/* <div className={styles.tracker_skeleton}>
        <Skeleton
          animation="wave"
          variant="circular"
          width={100}
          height={100}
        />
      </div> */}
    </div>
  );
};

export default TrackerSkeleton;
