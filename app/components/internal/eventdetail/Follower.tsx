"use client";
import React, { useEffect, useState } from "react";
import styles from "./eventdesc.style.module.css";
import Image from "next/image";
import PeopleIcon from "/public/people.svg";
import PlaceHolder from "/public/speaker1.jpeg";
import { useAuthContext, useTheme } from "@/context";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
import { showToast } from "@/utils/showToast";
import downArrowIcon from "/public/arrow_down.svg";
import UserProfile from "../../userProfile/UserProfile";
import { UserPlus } from "lucide-react";

const Follower = ({
  eventId,
  enquiryId,
}: {
  eventId: string;
  enquiryId: string;
}) => {
  const { user } = useAuthContext();
  const [followerData, setFollowerData] = useState([]);
  const [accordianToggle, setAccordianToggle] = useState(false);
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";
  const [followStatus, setFollowStatus] = useState(false);
  const fetchData = async () => {
    const { data, error } = await myFetch(
      `${baseUrl}/event-follow/${enquiryId}`
    );

    if (data) {
      console.log("FollowerData", data);
      setFollowerData(data.users);
      const isFollowing = data.users.some(
        (followUser: any) => followUser.id === user!.id
      );
      setFollowStatus(isFollowing);
    }

    if (error) {
      console.log(error);
      showToast("error", error.message);
      return;
    }
  };

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const handleFollow = async () => {
    const { data, error } = await myFetch(
      `${baseUrl}/event-follow/${enquiryId}`,
      {
        method: "POST",
      }
    );

    if (data) {
      console.log(enquiryId);
      console.log("FollowerData", data);
      fetchData();
    }

    if (error) {
      console.log(error);
      showToast("error", error.message);
      return;
    }
  };

  return (
    <div>
      <div
        className={`${styles.container} card`}
      >
        <div
          className={styles.header}
          onClick={() => setAccordianToggle(!accordianToggle)}
        >
          {/* <Image src={PeopleIcon} alt="page" className={iconClass} /> */}
          <UserPlus width="24px" height="24px"/>
          <div className={styles.eventDetail_header}>
            Followers
            <span className={styles.image_container}>
              <Image
                src={downArrowIcon}
                alt="dropdown"
                width={15}
                height={15}
              />
            </span>
          </div>
        </div>
        {accordianToggle && (
          <div className={styles.followerAccordian}>
            {followerData.length > 0 ? (
              followerData.map((follower: any) => (
                <div className={styles.followerContainer} key={follower.id}>
                  
                  {follower.profilePicture === null ?
                  <UserProfile name={follower.name} width={60} height={60} borderRadius="50%"/>:
                  <Image
                  src={
                     follower.profilePicture
                  }
                  alt="banner"
                  width={60}
                  height={60}
                  className={styles.followerProfilePhoto}
                />
                  }
                  <div className={styles.followerDetails}>
                    <div className={styles.followerName}>
                      {follower.name}
                      {/* <span className={styles.username}>{item.username}</span> */}
                    </div>
                    <div className={styles.followerPosition}>{follower?.designation}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noData_text}> No Followers Yet </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                marginTop: "10px",
              }}
            >
              <span className={styles.addFollow_action} onClick={handleFollow}>
                {followStatus ? "Unfollow" : "Follow"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Follower;
