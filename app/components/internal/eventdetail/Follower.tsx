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
import { GAEvent } from "@/utils/GAEvent";
import { useCoordinateService } from "@/services/coordinateService";
import { Button } from "@/components/ui/button";

const Follower = ({
  eventId,
  enquiryId,
  myActivity,
}: {
  eventId: string;
  enquiryId: string;
  myActivity: any;
}) => {
  console.log('myActivity', myActivity);
  
  const { user } = useAuthContext();
  const [followerData, setFollowerData] = useState([]);
  const [accordianToggle, setAccordianToggle] = useState(false);
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";
  const [followStatus, setFollowStatus] = useState(false);

  const coordinateService = useCoordinateService();

  const fetchData = async () => {
    const data: any = await coordinateService.getEnquiryFollowers(enquiryId);

    if (data) {
      setFollowerData(data.followers);
      const isFollowing = data.followers.some(
        (followUser: any) => followUser.id === user!.id
      );
      setFollowStatus(isFollowing);
    }
  };

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const handleFollow = async () => {
    try {
      if(followStatus && myActivity?.[0]?.id) {
        const deleteIntent: any = await coordinateService.deleteEnquiryActivityIntent(myActivity?.[0]?.id);
      } else {
        const createIntent: any = await coordinateService.setEnquiryFollowers(enquiryId);
      }
    } catch (err) {
      console.log(err);
    } finally {
      fetchData();
    }
  };

  return (
    <div>
      <div
        className={`${styles.container} card`}
      >
        <div
          className={styles.header}
          onClick={() => {
            setAccordianToggle(!accordianToggle);
            !accordianToggle && GAEvent("Coordinate", "Enquiry Detail", "Followers", "Expanded");
          }}
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
                  
                  {follower.profileImage === null ?
                  <UserProfile name={follower.name} width={60} height={60} borderRadius="50%"/>:
                  <Image
                  src={
                     follower.profileImage
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
              {/* <span className={styles.addFollow_action} onClick={handleFollow}>
                {followStatus ? "Unfollow" : "Follow"}
              </span> */}
              <Button
                onClick={handleFollow}
                variant={"outline"}
                size={"sm"}
              >
                {followStatus ? "Unfollow" : "Follow"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Follower;
