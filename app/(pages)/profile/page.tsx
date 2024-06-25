"use client";

import UserCard from "@/app/components/profile/UserCard";
import styles from "./page.style.module.css";
import uploadIcon from "/public/upload.svg";
import Image from "next/image";
import searchIcon from "/public/searchIcon.svg";
import { useEffect, useRef, useState } from "react";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
import { showToast } from "@/utils/showToast";

interface Profile {
  firstname: string;
  lastname: string;
  designation: string;
  file: any;
  profilePicture: string;
  fileType: string;
}

const Profile = () => {
  const [profileData, setProfileData] = useState<Profile>();
  const [name, setname] = useState("");
  const [role, setRole] = useState("");
  const [dept, setDept] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [picFile, setPicFile] = useState<any>();
  const fileInputRef = useRef<any>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleUploadClick = () => {
    const fileRef = fileInputRef.current as HTMLDivElement;
    fileRef.click();
  };

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

  const saveDataHandler = async () => {
    const newErrors: Record<string, string> = {};
    const [firstname, lastname] = name.split(" ");

    if (!lastname) {
      newErrors.name = "Please Enter Full Name";
    }
    if (mobileNo.length !== 10 || mobileNo.startsWith("+")) {
      newErrors.mobileNo = "Enter 10 digit mobile number only";
    }
    if (!dept) {
      newErrors.dept = "Please Enter the Department";
    }
    if (!role) {
      newErrors.role = "Please Enter Your Role";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const formData = new FormData();
    formData.append("firstname", name[0]);
    formData.append("lastname", name[1]);
    formData.append("mobileNo", mobileNo);
    formData.append("designation", role);
    formData.append("file", picFile);

    const { data, error } = await myFetch(`${baseUrl}/auth/customer/profile`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (data) {
      console.log(data);
      showToast("success", "Data Saved Successfully");
      return;
    }

    if (error) {
      console.log(error);
      showToast("error", error.message);
      return;
    }
  };

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
                    <span
                      className={styles.action_upload}
                      onClick={handleUploadClick}
                    >
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
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/png, image/jpeg, image/gif"
                onChange={(e: any) => setPicFile(e.target.files[0])}
              />

              <div className={styles.account_details}>
                <div className={styles.input_container}>
                  <div className={styles.input_title}>Full Name</div>
                  <input
                    type="text"
                    className={`${styles.input} ${
                      errors.name && styles.error_boundary
                    }`}
                    onChange={(e) => setname(e.target.value)}
                  />
                  {errors.name && (
                    <div className={styles.error}>{errors.name}</div>
                  )}
                </div>

                <div className={styles.dual_input_container}>
                  <span className={styles.input_container}>
                    <div className={styles.input_title}>Email</div>
                    <input type="email" className={styles.input} />
                  </span>

                  <span className={styles.input_container}>
                    <div className={styles.input_title}>Mobile Number</div>
                    <input
                      type="text"
                      className={`${styles.input} ${
                        errors.mobileNo && styles.error_boundary
                      }`}
                      onChange={(e) => setMobileNo(e.target.value)}
                    />
                    {errors.mobileNo && (
                      <div className={styles.error}>{errors.mobileNo}</div>
                    )}
                  </span>
                </div>

                <div className={styles.dual_input_container}>
                  <span className={styles.input_container}>
                    <div className={styles.input_title}>Department</div>
                    <input
                      type="text"
                      className={`${styles.input} ${
                        errors.dept && styles.error_boundary
                      }`}
                      onChange={(e) => setDept(e.target.value)}
                    />
                    {errors.dept && (
                      <div className={styles.error}>{errors.dept}</div>
                    )}
                  </span>

                  <span className={styles.input_container}>
                    <div className={styles.input_title}>Role</div>
                    <input
                      type="text"
                      className={`${styles.input} ${
                        errors.role && styles.error_boundary
                      }`}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    {errors.role && (
                      <div className={styles.error}>{errors.role}</div>
                    )}
                  </span>
                </div>

                <div className={styles.action_button} onClick={saveDataHandler}>
                  Save Changes
                </div>

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
