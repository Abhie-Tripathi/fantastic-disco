// import React from "react";
// import { Skeleton } from "@mui/material";
// import styles from "./cardSkeleton.module.css";
// const CardsSkeleton = () => {
//   return (
//     <div className={styles.card_skeleton_container}>
//       <div className={styles.innerContainer}>
//         <Skeleton
//           animation="wave"
//           variant="rectangular"
//           width={200}
//           height={40}
//         />
//         <Skeleton
//           animation="wave"
//           variant="rectangular"
//           width={200}
//           height={40}
//         />
//         <Skeleton
//           animation="wave"
//           variant="rectangular"
//           width={200}
//           height={40}
//         />
//       </div>
//       <div className={styles.innerContainer}>
//         <Skeleton
//           animation="wave"
//           variant="rectangular"
//           width={200}
//           height={40}
//         />
//         <Skeleton
//           animation="wave"
//           variant="rectangular"
//           width={200}
//           height={40}
//         />
//         <Skeleton
//           animation="wave"
//           variant="rectangular"
//           width={200}
//           height={40}
//         />
//       </div>
//       <div className={styles.innerContainer}>
//         <Skeleton
//           animation="wave"
//           variant="rectangular"
//           width={200}
//           height={40}
//         />
//         <Skeleton
//           animation="wave"
//           variant="rectangular"
//           width={200}
//           height={40}
//         />
//         <Skeleton
//           animation="wave"
//           variant="rectangular"
//           width={200}
//           height={40}
//         />
//       </div>
//     </div>
//   );
// };

// export default CardsSkeleton;


// import React from "react";
// import { Skeleton } from "@mui/material";
// import styles from "./cardSkeleton.module.css";

// const CardsSkeleton = () => {
//   return (
//     <div className={styles.card_skeleton_container}>
//       <div className={styles.innerContainer}>
//         <Skeleton
//           animation="wave"
//           variant="rectangular"
//           className={styles.skeletonItem}
//         />
//         <Skeleton
//           animation="wave"
//           variant="rectangular"
//           className={styles.skeletonItem}
//         />
//         <Skeleton
//           animation="wave"
//           variant="rectangular"
//           className={styles.skeletonItem}
//         />
//       </div>
//       <div className={styles.innerContainer}>
//         <Skeleton
//           animation="wave"
//           variant="rectangular"
//           className={styles.skeletonItem}
//         />
//         <Skeleton
//           animation="wave"
//           variant="rectangular"
//           className={styles.skeletonItem}
//         />
//         <Skeleton
//           animation="wave"
//           variant="rectangular"
//           className={styles.skeletonItem}
//         />
//       </div>
//       <div className={styles.innerContainer}>
//         <Skeleton
//           animation="wave"
//           variant="rectangular"
//           className={styles.skeletonItem}
//         />
//         <Skeleton
//           animation="wave"
//           variant="rectangular"
//           className={styles.skeletonItem}
//         />
//         <Skeleton
//           animation="wave"
//           variant="rectangular"
//           className={styles.skeletonItem}
//         />
//       </div>
//     </div>
//   );
// };

// export default CardsSkeleton;



// import React from "react";
// import { Skeleton } from "@mui/material";
// import styles from "./cardSkeleton.module.css";

// const CardsSkeleton = () => {
//   return (
//     <div className={styles.card_skeleton_container}>
//       <div className={styles.innerContainer}>
//         <Skeleton
//           animation="wave"
//           variant="rectangular"
//           className={styles.skeletonItem}
//         />
//         <Skeleton
//           animation="wave"
//           variant="rectangular"
//           className={styles.skeletonItem}
//         />
//         <Skeleton
//           animation="wave"
//           variant="rectangular"
//           className={styles.skeletonItem}
//         />
//       </div>
//       <div className={styles.innerContainer}>
//         <Skeleton
//           animation="wave"
//           variant="rectangular"
//           className={styles.skeletonItem}
//         />
//         <Skeleton
//           animation="wave"
//           variant="rectangular"
//           className={styles.skeletonItem}
//         />
//         <Skeleton
//           animation="wave"
//           variant="rectangular"
//           className={styles.skeletonItem}
//         />
//       </div>
//       <div className={styles.innerContainer}>
//         <Skeleton
//           animation="wave"
//           variant="rectangular"
//           className={styles.skeletonItem}
//         />
//         <Skeleton
//           animation="wave"
//           variant="rectangular"
//           className={styles.skeletonItem}
//         />
//         <Skeleton
//           animation="wave"
//           variant="rectangular"
//           className={styles.skeletonItem}
//         />
//       </div>
//     </div>
//   );
// };

// export default CardsSkeleton;



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
