"use client";

import UserCard from "@/app/components/profile/UserCard";
import styles from "./page.style.module.css";
import uploadIcon from "/public/upload.svg";
import Image from "next/image";
import searchIcon from "/public/searchIcon.svg";
import { useEffect, useState } from "react";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
import { showToast } from "@/utils/showToast";

interface Profile {
  firstname: string;
  lastname: string;
  designation: string;
  filename: string;
  profilePicture: string;
  fileType: string;
}

const Profile = () => {
  const [profileData, setProfileData] = useState<Profile>();
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await myFetch(`${baseUrl}/auth/customer/profile`);

      if (error) {
        console.log(error);
        showToast("error", error);
        return;
      }

      if (data) {
        console.log(data);
        setProfileData(data.user);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      {/* <div className={styles.header}>User Profile</div> */}
      {profileData && (
        <div>
          <div className={styles.account}>
            <div className={styles.account_left}>
              <div className={styles.profile_header}>Your Profile</div>
              <div className={styles.input_title}>
                Here you can view and update your personal details, and manage
                your settings. Keep your information up-to-date for a seamless
                experience.
              </div>
            </div>
            <div className={styles.account_right}>
              <div className={styles.account_basicInfo}>
                <div className={styles.account_basicInfo_pic}></div>
                <div className={styles.account_basicInfo_picInfo}>
                  <span>
                    {profileData.firstname} {profileData.lastname}
                  </span>
                  <span className={styles.action_container}>
                    <span className={styles.action_upload}>
                      <Image
                        src={uploadIcon}
                        alt="upload"
                        className={styles.image}
                      />
                      <span>Upload Image</span>
                    </span>
                    <span className={styles.action_remove}>Remove</span>
                  </span>
                  <span className={styles.profile_hintText}>
                    We support PNGs, JPEGs and GIFs under 10MB
                  </span>
                </div>
              </div>

              <div className={styles.account_details}>
                <div className={styles.input_container}>
                  <div className={styles.input_title}>Full Name</div>
                  <input type="text" className={styles.input} />
                </div>

                <div className={styles.dual_input_container}>
                  <span className={styles.input_container}>
                    <div className={styles.input_title}>Email</div>
                    <input type="email" className={styles.input} />
                  </span>

                  <span className={styles.input_container}>
                    <div className={styles.input_title}>Mobile Number</div>
                    <input type="text" className={styles.input} />
                  </span>
                </div>

                <div className={styles.dual_input_container}>
                  <span className={styles.input_container}>
                    <div className={styles.input_title}>Department</div>
                    <input type="text" className={styles.input} />
                  </span>

                  <span className={styles.input_container}>
                    <div className={styles.input_title}>Role</div>
                    <input type="text" className={styles.input} />
                  </span>
                </div>

                <div className={styles.action_button}>Save Changes</div>

                <div className={styles.action_reset}>Reset Password</div>
              </div>
            </div>
          </div>

          <div className={styles.account}>
            <div className={styles.account_left}>
              <div className={styles.profile_header}>Your Organization</div>
              <div className={styles.input_title}>
                Here you can manage and update your organization’s details, view
                activity reports, and configure settings and manage users.
              </div>
            </div>
            <div className={styles.account_right}>
              <div className={styles.account_details}>
                <div className={styles.input_container}>
                  <div className={styles.input_title}>Organization name</div>
                  <input type="text" className={styles.input} />
                </div>

                <div className={styles.input_container}>
                  <div className={styles.input_title}>Industry</div>
                  <input type="text" className={styles.input} />
                </div>

                <div className={styles.input_container}>
                  <div className={styles.input_title}>Use Case</div>
                  <input type="text" className={styles.input} />
                </div>

                <div className={styles.input_container}>
                  <div className={styles.input_title}>Location</div>
                  <input type="text" className={styles.input} />
                </div>

                <div className={styles.action_button}>Save Changes</div>

                <div className={styles.action_reset}>
                  Delete My Organization
                </div>
              </div>
            </div>
          </div>

          <div className={styles.account}>
            <div className={styles.account_left}>
              <div className={styles.profile_header}>Admin (1)</div>
              <div className={styles.searchBar_container}>
                <span>
                  <Image
                    src={searchIcon}
                    alt=""
                    width={20}
                    height={20}
                    className={styles.search}
                  />
                </span>
                <input
                  type="text"
                  className={styles.input1}
                  placeholder="Search Members"
                />
              </div>
              <UserCard />
            </div>
            <div className={styles.account_right}>
              <div className={styles.profile_header}>Users (12)</div>
              <div className={styles.searchBar_container}>
                <span>
                  <Image
                    src={searchIcon}
                    alt=""
                    width={20}
                    height={20}
                    className={styles.search}
                  />
                </span>
                <input
                  type="text"
                  className={styles.input1}
                  placeholder="Search Members"
                />
                <span className={styles.action_invite}>Send Invite</span>
              </div>
              <UserCard />
              <UserCard />
              <UserCard />
              <UserCard />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
