import dropdownIcon from "/public/internal/drop_down_angle.svg";
import Image from "next/image";
import styles from "./eventdesc.style.module.css";
import { useEffect, useState } from "react";
import ProfileIcon from "/public/profile_Image.jpg";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
import { showToast } from "@/utils/showToast";
import { useTheme } from "@/context";
import UserProfile from "../../userProfile/UserProfile";
import { useCoordinateService } from "@/services/coordinateService";
import { GAEvent } from "@/utils/GAEvent";
import { usePathname } from "next/navigation";

interface PropType {
  label: string;
  eventId: number;
  enquiryId: string;
}
interface UserType {
  id: string;
  name: string;
  // lastname: string;
  imageUrl: string;
}
const OwnerList: React.FC<PropType> = ({ enquiryId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userList, setUserList] = useState<any>([]);
  const [owner, setOwner] = useState<any>();
  const { theme } = useTheme();

  const iconClass = theme === "light" ? "icons_light" : "icon";

  const urlPath = usePathname().split("/")[2];
  const pageSource = urlPath.charAt(0).toUpperCase() + urlPath.slice(1);

  const coordinateService = useCoordinateService();

  const openDropDownHandler = () => {
    setIsOpen((prev) => !prev);
    // setIsOpen(false);
  };

  const fetchData = async () => {
    // const { data, error } = await myFetch(`${baseUrl}/auth/users?limit=100`);

    const data: any = await coordinateService.getAllUsers();

    if (data) {
      setUserList(data);
    }

    // if (error) {
    //   console.log(error);
    //   showToast("error", error.message);
    //   return;
    // }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleChangeOwner = async (userId: string) => {
    setIsOpen(false);
    const dataToSend = {
      enquiryId: enquiryId,
      ownerId: userId,
    };
    const data: any = await coordinateService.setEnquiryOwner(dataToSend);
    if (data) {
      getOwnerDetails();
      GAEvent("Assign Owner", "Enquiry Detail", `${pageSource} | Assign Owner`, "Assign Owner Changed");
    }
  };

  const getOwnerDetails = async () => {
    try {
      const data: any = await coordinateService.getEnquiryOwner(enquiryId);
      if (data) {
        setOwner(data?.owner);
      }
    } catch (error: any) {
      if(error?.statusCode === 404) {
        setOwner(null);
      }
    }
    
    
  };

  useEffect(() => {
    getOwnerDetails();
  }, [enquiryId]);

  return (
    <div className={styles.filter_container}>
      <div className={styles.filter}>
        <div
          className={styles.dropdown_container2}
          onClick={openDropDownHandler}
        >
          <div
            className={styles.dropdown_value}
            style={{ display: "flex", marginRight: "1rem" }}
          >
            {owner ? (
              owner?.profileImage === null ? (
                <UserProfile
                  name={owner.name}
                  width={48}
                  height={48}
                  borderRadius="50%"
                />
              ) : (
                <Image
                  src={owner?.profileImage}
                  alt="banner"
                  width={48}
                  height={48}
                  className={`${styles.followerProfilePhoto} h-[48px] w-[48px]`}
                />
              )
            ) : (
              <Image
                src={ProfileIcon}
                alt="user"
                className={`${styles["owner_img"]} h-[48px] w-[48px]`}
                width={48}
                height={48}
                referrerPolicy="no-referrer"
              />
            )}
            
            <div>
              <span
                style={{
                  fontSize: "14px",
                  textWrap: "nowrap",
                  marginRight: "0.5rem",
                }}
              >
                {owner ? owner.name : "Assign Owner"}
                &nbsp;
              </span>
              <br />
              <span style={{ fontSize: "10px" }}>OWNER&nbsp;</span>
            </div>
          </div>
          <Image
            width={14}
            height={14}
            src={dropdownIcon}
            alt="downarrow"
            className={iconClass}
          />
        </div>
      </div>
      {isOpen && (
        <div className={styles.dropdown}>
          {userList.length > 0 &&
            userList.map((user: UserType) => (
              <div
                className={styles.dropdown_content}
                onClick={() => handleChangeOwner(user.id)}
                key={user.id}
              >
                { user.imageUrl === null ? 
                <UserProfile name={`${user.name}`} width={48} height={48} borderRadius="50%"/>:
                <Image
                  src={
                   user.imageUrl
                  }
                  alt="user"
                  className={`${styles["owner_img"]} h-[48px] w-[48px]`}
                  width={48}
                  height={48}
                  referrerPolicy="no-referrer"
                />
                }
                &nbsp;
                <span
                  style={{
                    fontSize: "14px",
                    textWrap: "nowrap",
                    marginRight: "0.5rem",
                  }}
                >
                  {user.name}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
export default OwnerList;
