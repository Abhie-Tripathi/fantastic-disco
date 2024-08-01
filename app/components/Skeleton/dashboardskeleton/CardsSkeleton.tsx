import React from "react";
import { Skeleton } from "@mui/material";
import styles from "./cardSkeleton.module.css";

const CardsSkeleton = () => {
  return (
    <div className={styles.linkCard_container}>
      <div className={styles.linkCard}>
        <Skeleton variant="rectangular" className={styles.skeletonContent} />
        <Skeleton variant="rectangular" className={styles.skeletonContent} />
        <Skeleton variant="rectangular" className={styles.skeletonContent} />
      </div>
      <div className={styles.linkCard}>
        <Skeleton variant="rectangular" className={styles.skeletonContent} />
        <Skeleton variant="rectangular" className={styles.skeletonContent} />
        <Skeleton variant="rectangular" className={styles.skeletonContent} />
      </div>
      <div className={styles.linkCard}>
        <Skeleton variant="rectangular" className={styles.skeletonContent} />
        <Skeleton variant="rectangular" className={styles.skeletonContent} />
        <Skeleton variant="rectangular" className={styles.skeletonContent} />
      </div>
    </div>
  );
};

export default CardsSkeleton;
