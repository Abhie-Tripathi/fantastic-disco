"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import styles from "./page.style.module.css";
import Image from "next/image";
import MoreIcon from "/public/dots.svg";
import TrackerDetails from "@/app/components/internal/trackers/TrackerDetails/TrackerDetails";
import { useTheme } from "@/context";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
import Loading from "@/app/components/UI/Loading";

const TrackerPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [trackerDetail, setTrackerDetail] = useState<any>();
  const pathName = usePathname();
  const trackerParams = pathName.split("/");
  const trackerId = trackerParams[trackerParams.length - 1];

  const editTrackerHandler = () => {
    const params = new URLSearchParams(searchParams);
    params.set("edit", "true")
    router.push(`/internal/trackers/create?${params.toString()}`);
  };

  const { theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await myFetch(`${baseUrl}/tracker/${trackerId}`);
      if (error) {
        console.log(error);
        return;
      }

      if (data) {
        setTrackerDetail(data.tracker);
        console.log(data);
      }
    };
    fetchData();
  }, [trackerId]);

  return (
    <>
      {trackerDetail ? (
        <div>
          <div className={styles.trackers_container}>
            <div
              className={`${styles.trackers_header} ${
                theme === "light" ? styles.trackers_header_light : ""
              }`}
            >
              <div className={styles.trackers_header_title}>
                {trackerDetail.name}
              </div>
              <div className={styles.trackers_header_more_button}>
                <Image src={MoreIcon} alt="moreicon" />
              </div>
              <button
                onClick={editTrackerHandler}
                className={styles.trackers_header_newtracker_button}
              >
                <div>Edit Tracker</div>
              </button>
            </div>
          </div>
          <div className={styles.trackerDetailsContainer}>
            <TrackerDetails trackerDetail={trackerDetail} />
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default TrackerPage;
