import React from "react";
import { Skeleton, Card, CardContent } from "@mui/material";
import styles from "./tracker.module.css";

const TrackerSkeleton = () => {
  return (
    <div className={styles.tracker_outer_card}>
      <Skeleton
        animation="wave"
        variant="rectangular"
        width={"50%"}
        height={25}
      />
      <div className={styles.outer_container}>
        <div className={styles.inner_container}>
          <div>
            <Skeleton
              animation="wave"
              variant="rectangular"
              width={100}
              height={100}
            />
          </div>
          <div>
            <Skeleton
              animation="wave"
              variant="rectangular"
              width={100}
              height={100}
            />
          </div>
          <div>
            <Skeleton
              animation="wave"
              variant="rectangular"
              width={100}
              height={100}
            />
          </div>
        </div>
        <div className={styles.item_container_for_mobile}>
          <Skeleton animation="wave" variant="rounded" width={80} height={30} />
          <Skeleton animation="wave" variant="rounded" width={80} height={30} />
          <Skeleton animation="wave" variant="rounded" width={80} height={30} />
        </div>

        <div>
          <Skeleton
            animation="wave"
            variant="circular"
            width={100}
            height={100}
          />
        </div>
      </div>
    </div>
  );
};

export default TrackerSkeleton;
