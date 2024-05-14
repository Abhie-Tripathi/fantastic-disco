import React, { useRef } from "react";
import styles from "./recentSearches.module.css";
import useClickOutside from "@/hooks/useClickOutside";
import { useTheme } from "@/context";

const RecentSearches = ({setShowRecentSearches}:{setShowRecentSearches:(string: boolean)=>void}) => {
  const menuNode = useRef(null)
  useClickOutside(menuNode, ()=>setShowRecentSearches(false))
  const {theme} = useTheme();

  return (
    <div className={`${styles.container} ${theme === 'light' && styles.container_light}`} ref={menuNode}>
      <div className={styles.searchitem_container}>
        <div className={styles.searchitem}>&quot;india&quot; • All categories</div>
        <div className={styles.searchhistory}>a few seconds ago</div>
      </div>
      <div className={styles.searchitem_container}>
        <div className={styles.searchitem}>&quot;india&quot; • All categories</div>
        <div className={styles.searchhistory}>a few seconds ago</div>
      </div>
      <div className={styles.searchitem_container}>
        <div className={styles.searchitem}>&quot;india&quot; • All categories</div>
        <div className={styles.searchhistory}>a few seconds ago</div>
      </div>
      <div className={styles.searchitem_container}>
        <div className={styles.searchitem}>&quot;india&quot; • All categories</div>
        <div className={styles.searchhistory}>a few seconds ago</div>
      </div>
    </div>
  );
};

export default RecentSearches;