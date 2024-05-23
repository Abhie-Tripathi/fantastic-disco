import React from "react";
import styles from "./coordinate.module.css";
import { Skeleton } from "@mui/material";
const CoordinateSkeleton = () => {
  return (
    <div className={styles.linkCard}>
      <Skeleton
        animation="wave"
        variant="rectangular"
        width={250}
        height={30}
      />
      <div>
        <Skeleton
          animation="wave"
          variant="rectangular"
          width={200}
          height={20}
        />
      </div>
      <div className={styles.inner_card_container}>
        <Skeleton
          animation="wave"
          variant="rounded"
          width={100}
          height={20}
        />
        <Skeleton
          animation="wave"
          variant="rounded"
          width={100}
          height={20}
        />
        <Skeleton
          animation="wave"
          variant="rounded"
          width={100}
          height={20}
        />
        <Skeleton
          animation="wave"
          variant="rounded"
          width={100}
          height={20}
        />
      </div>
    </div>
  );
};

export default CoordinateSkeleton;
