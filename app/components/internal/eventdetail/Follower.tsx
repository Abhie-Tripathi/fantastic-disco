"use client";
import React, { useEffect, useState } from "react";
import styles from "./eventdesc.style.module.css";
import Image from "next/image";
import { useAuthContext } from "@/context";
import downArrowIcon from "/public/arrow_down.svg";
import UserProfile from "../../userProfile/UserProfile";
import { UserPlus } from "lucide-react";
import { GAEvent } from "@/utils/GAEvent";
import { useCoordinateService } from "@/services/coordinateService";
import { Button } from "@/components/ui/button";

interface FollowerData {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  designation: string | null;
  department: string | null;
  followerIntendId: string; // Optional, if not always present
}

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
  const [followerData, setFollowerData] = useState<FollowerData[]>([]);
  const [accordianToggle, setAccordianToggle] = useState(false);
  const [myFollowIntentId, setMyFollowIntentId] = useState<string | null>(null);

  const coordinateService = useCoordinateService();

  const fetchData = async () => {
    const data: any = await coordinateService.getEnquiryFollowers(enquiryId);

    if (data) {
      setFollowerData(data.followers);
      const isFollowing = data.followers.filter(
        (followUser: any) => followUser.id === user!.id
      );
      setMyFollowIntentId(isFollowing?.[0]?.followerIntendId || null);
    }
  };

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const handleFollow = async (itentId: string | null) => {    
    try {
      if(itentId) {
        const deleteIntent: any = await coordinateService.deleteEnquiryActivityIntent(itentId);
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
              followerData.map((follower) => (
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
                  className="rounded-full h-12 w-12"
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
                onClick={()=>handleFollow(myFollowIntentId)}
                variant={"outline"}
                size={"sm"}
              >
                {myFollowIntentId ? "Unfollow" : "Follow"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Follower;
