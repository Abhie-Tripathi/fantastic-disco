import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCoordinateService } from "@/services/coordinateService";
import { Button } from "../ui/button";
import { useAuthContext } from "@/context";
import UserProfile from "@/app/components/userProfile/UserProfile";
import { ChevronDown } from "lucide-react";
import { GAEvent } from "@/utils/GAEvent";

interface FollowersPopupProps {
  eventId: string;
  enquiryId: string;
  enquiryOwner: any;
}

interface FollowerData {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  designation: string | null;
  department: string | null;
  followerIntendId: string;
}

interface UserType {
  id: string;
  name: string;
  // lastname: string;
  imageUrl: string;
}

const FollowersPopup = ({
  eventId,
  enquiryId,
  enquiryOwner,
}: FollowersPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOwnerListOpen, setOwnerListOpen] = useState(false);
  const coordinateService = useCoordinateService();

  const { user } = useAuthContext();

  const [userList, setUserList] = useState<any>([]);
  const [owner, setOwner] = useState<any>(enquiryOwner || null);
  const [followerData, setFollowerData] = useState<FollowerData[]>([]);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [myFollowIntentId, setMyFollowIntentId] = useState<string | null>(null);

  const fetchFollowersData = async () => {
    const data: any = await coordinateService.getEnquiryFollowers(enquiryId);

    if (data) {
      setFollowerData(data.followers);
      setFollowersCount(data.count);
      const isFollowing = data.followers.filter(
        (followUser: any) => followUser.id === user!.id
      );
      setMyFollowIntentId(isFollowing?.[0]?.followerIntendId || null);
    }
  };

  const fetchUsersList = async () => {
    const data: any = await coordinateService.getAllUsers();

    if (data) {
      setUserList(data);
    }
  };

  const handleChangeOwner = async (userId: string) => {
    setIsOpen(false);
    const dataToSend = {
      enquiryId: enquiryId,
      ownerId: userId,
    };
    const data: any = await coordinateService.setEnquiryOwner(dataToSend);
    if (data && data?.owner) {
      console.log("Owner changed successfully", data);
      setOwner(data.owner);
      // getOwnerDetails();
      // GAEvent("Assign Owner", "Enquiry Detail", `${pageSource} | Assign Owner`, "Assign Owner Changed");
    }
  };

  useEffect(() => {
    fetchFollowersData();
    fetchUsersList();
  }, [eventId]);

  const handleFollow = async (itentId: string | null) => {
    try {
      if (itentId) {
        const deleteIntent: any =
          await coordinateService.deleteEnquiryActivityIntent(itentId);
      } else {
        const createIntent: any = await coordinateService.setEnquiryFollowers(
          enquiryId
        );
      }
    } catch (err) {
      console.log(err);
    } finally {
      fetchFollowersData();
    }
  };

  return (
    <div className="flex gap-2">
      <img
        src="/defaultProfilePic.png"
        alt="user image"
        className="w-12 h-12 rounded-full"
      />
      <div className="py-1">
        <Popover open={isOwnerListOpen} onOpenChange={setOwnerListOpen}>
          <PopoverTrigger asChild>
            <div className="flex text-sm items-center gap-1 cursor-pointer">
              {owner ? owner.name : "Assign Owner"}
              <ChevronDown height={20} />
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="p-3 max-h-60 overflow-y-auto"
            align="start"
          >
            {userList.length > 0 && (
              <div className="flex flex-col gap-2">
                {userList.map((user: UserType) => (
                  <div
                    className="max-h-60 overflow-y-auto flex gap-4 items-center"
                    key={user.id}
                    onClick={() => handleChangeOwner(user.id)}
                  >
                    {user.imageUrl === null ? (
                      <UserProfile
                        name={user.name}
                        width={40}
                        height={40}
                        borderRadius="50%"
                      />
                    ) : (
                      <img
                        src={user.imageUrl}
                        alt="banner"
                        width={40}
                        height={40}
                        className="rounded-full h-10 w-10"
                      />
                    )}
                    <div className="flex flex-col">{user.name}</div>
                  </div>
                ))}
              </div>
            )}
          </PopoverContent>
        </Popover>
        <div className="">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <div className="mt-1 cursor-pointer text-xs text-[#7D7D7D]">
                {followersCount} Followers
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-3" align="start">
              {followerData.length > 0 ? (
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                  {followerData.map((follower) => (
                    <div className="flex gap-4 items-center" key={follower.id}>
                      {follower.profileImage === null ? (
                        <UserProfile
                          name={follower.name}
                          width={40}
                          height={40}
                          borderRadius="50%"
                        />
                      ) : (
                        <img
                          src={follower.profileImage}
                          alt="banner"
                          width={40}
                          height={40}
                          className="rounded-full h-10 w-10"
                        />
                      )}
                      <div className="flex flex-col">
                        <div className="">
                          {follower.name}
                          {/* <span className={styles.username}>{item.username}</span> */}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {follower?.designation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-center text-muted-foreground py-3">
                  {" "}
                  No Followers Yet{" "}
                </div>
              )}

              <div className="flex justify-center items-center mt-2">
                <Button
                  onClick={() => handleFollow(myFollowIntentId)}
                  variant="outline"
                  size="xs"
                  className="px-2"
                >
                  {myFollowIntentId ? "Unfollow" : "Follow"}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default FollowersPopup;
