'use client'
import React, { useEffect, useState } from "react";
import styles from "./page.style.module.css";
import TrackerCard from "@/app/components/internal/trackers/TrackerCard";
import { baseUrl } from "@/constants";
import { myFetch } from "@/utils/myFetch";
import Loading from "@/app/components/UI/Loading";

const Trackers = () => {
  const [trackers, setTrackers] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { data, error } = await myFetch(
        `${baseUrl}/tracker?limit=5&offset=${offset}`
      );
      console.log(data);
      if (error) {
        console.log(error);
        setIsLoading(false);
        return;
      }

      if (data) {
        setTrackers((prevTrackers) => [...prevTrackers, ...data.trackerData]);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [offset]);

  const handleShowMore = () => {
    setOffset((prevOffset) => prevOffset + 5);
  };

  return (
    <div className={styles.body}>
      <div className={styles.trackers_card_container}>
        {trackers.length > 0 ? (
          trackers.map((tracker) => <TrackerCard key={tracker.id} trackerData={tracker} />)
        ) : (
          isLoading ? (
            <Loading />
          ) : (
            <div>No data available</div>
          )
        )}
        {trackers.length > 0 && (
          <div className={styles.btn_showMore} onClick={handleShowMore}>
            Show More
          </div>
        )}
      </div>
    </div>
  );
};

export default Trackers;
