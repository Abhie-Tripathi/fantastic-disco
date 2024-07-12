import dropdownIcon from "/public/internal/drop_down_angle.svg";
import Image from "next/image";
import userImg from "/public/person1.svg";
import styles from "./eventdesc.style.module.css";
import { useEffect, useState } from "react";
import ProfileIcon from "/public/profile_Image.jpg";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
import { showToast } from "@/utils/showToast";

interface PropType {
  label: string;
  eventId: number;
  enquiryId: string;
}
interface UserType {
  id: string;
  name: string;
  profilePicture: string;
}
const OwnerList: React.FC<PropType> = ({ enquiryId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("User name");
  const [userList, setUserList] = useState([]);

  const openDropDownHandler = () => {
    // setIsOpen((prev) => !prev);
    setIsOpen(false);
  };

  const fetchData = async () => {
    const { data, error } = await myFetch(`${baseUrl}/auth/users`);

    if (data) {
      console.log(data.users);
      setUserList(data.users);
    }

    if (error) {
      console.log(error);
      showToast("error", error.message);
      return;
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleChangeOwner = async (userId: string) => {
    setIsOpen(false);
    const dataToSend = {
      enquiryId: enquiryId,
      userId: userId,
    };
    const { data, error } = await myFetch(`${baseUrl}/enquiry/owner`, {
      method: "POST",
      body: JSON.stringify(dataToSend),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (data) {
      console.log(data);
      fetchData();
    }

    if (error) {
      console.log(error);
      showToast("error", error.message);
      return;
    }
  };

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
            <Image
              src={ProfileIcon}
              alt="user"
              className={styles["owner_img"]}
              width={48}
              height={48}
              referrerPolicy="no-referrer"
            />
            <div>
              <span
                style={{
                  fontSize: "14px",
                  textWrap: "nowrap",
                  marginRight: "0.5rem",
                }}
              >
                {value}&nbsp;
              </span>
              <br />
              <span style={{ fontSize: "10px" }}>OWNER&nbsp;</span>
            </div>
          </div>
          <Image width={14} height={14} src={dropdownIcon} alt="downarrow" />
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
                <Image
                  src={
                    user.profilePicture === null
                      ? ProfileIcon
                      : user.profilePicture
                  }
                  alt="user"
                  className={styles["owner_img"]}
                  width={48}
                  height={48}
                  referrerPolicy="no-referrer"
                />
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
