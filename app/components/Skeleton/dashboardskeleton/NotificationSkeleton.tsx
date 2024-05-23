import React from "react";
import styles from "./notification.module.css";
import { Skeleton } from "@mui/material";
const NotificationSkeleton = () => {
  return (
    <div className={styles.card_skeleton_container}>
      <div className={styles.innerContainer}>
        <Skeleton
          animation="wave"
          variant="rectangular"
          width={250}
          height={30}
        />
        <Skeleton
          animation="wave"
          variant="rectangular"
          width={250}
          height={30}
        />
        <Skeleton
          animation="wave"
          variant="rectangular"
          width={250}
          height={30}
        />
      </div>
    </div>
  );
};

export default NotificationSkeleton;
