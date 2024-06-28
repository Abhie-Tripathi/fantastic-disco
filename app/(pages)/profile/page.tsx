"use client";

import styles from "./page.style.module.css";
import uploadIcon from "/public/upload.svg";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
import { showToast } from "@/utils/showToast";
import { useAuthContext } from "@/context";
import { UserResponse } from "@/types/user";

interface Profile {
  firstname: string;
  lastname: string;
  designation: string;
  file: any;
  profilePicture: string;
  fileType: string;
  email: string;
}

const Profile = () => {
  const { user, setIsProfileUpdated } = useAuthContext();
  const [profileData, setProfileData] = useState<Profile>();
  const [name, setname] = useState("");
  const [role, setRole] = useState("");
  const [dept, setDept] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [picFile, setPicFile] = useState<any>(null);
  const fileInputRef = useRef<any>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false); // New loading state

  const handleUploadClick = () => {
    const fileRef = fileInputRef.current as HTMLDivElement;
    fileRef.click();
  };

  const loginedUser = user;
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
    if (
      name.length === 0 &&
      mobileNo.length === 0 &&
      role.length === 0 &&
      dept.length === 0 &&
      picFile === null
    ) {
      showToast("error", "Please fill the data to change");
      return;
    }

    const newErrors: Record<string, string> = {};
    const splitName = name.split(" ");

    if (name.length !== 0 && !splitName[1]) {
      newErrors.name = "Please Enter Full Name";
    }
    if (
      mobileNo.length !== 0 &&
      (mobileNo.length !== 10 || mobileNo.startsWith("+"))
    ) {
      newErrors.mobileNo = "Enter 10 digit mobile number only";
    }
    if (dept.length !== 0 && !dept) {
      newErrors.dept = "Please Enter the Department";
    }
    if (role.length !== 0 && !role) {
      newErrors.role = "Please Enter Your Role";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const formData = new FormData();
    formData.append("firstname", splitName[0]);
    formData.append("lastname", splitName[1]);
    formData.append("phoneNumber", mobileNo);
    formData.append("designation", role);
    formData.append("department", dept);
    if (picFile !== null) {
      formData.append("file", picFile);
    }

    setIsSaving(true);
    const { data, error } = await myFetch(`${baseUrl}/auth/customer/profile`, {
      method: "PATCH",
      body: formData,
    });

    setIsSaving(false);

    if (data) {
      console.log(data);
      setProfileData(data.user);
      showToast("success", "Data Saved Successfully");
      setname("");
      setRole("");
      setMobileNo("");
      setDept("");
      setPicFile("");

      const newUser = {
        user: {
          ...loginedUser,
          firstname: data.user.firstname || loginedUser!.firstname,
          lastname: data.user.lastname || loginedUser!.lastname,
        },
      };
      window.localStorage.setItem("user", JSON.stringify(newUser));
      setIsProfileUpdated(true);
    }

    if (error) {
      console.log(error);
      showToast("error", error.message);
      return;
    }
  };

  const handleResetPassword = async (event: any) => {
    event?.preventDefault();
    const dataToSend = {
      email: profileData?.email,
    };
    const { data, error } = await myFetch(
      `${baseUrl}/auth/customer/forgot-password`,
      {
        method: "POST",
        body: JSON.stringify(dataToSend),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (data) {
      console.log(data);
      showToast("success", data.message);
    }

    if (error) {
      console.log(error);
      showToast("error", error.message);
      return;
    }
  };

  const handleRemove = async () => {
    const formData = new FormData();
    formData.append("removePicture", "true");
    const { data, error } = await myFetch(`${baseUrl}/auth/customer/profile`, {
      method: "PATCH",
      body: formData,
    });

    if (data) {
      console.log(data);
      setProfileData(data);
    }

    if (error) {
      console.log(error);
      showToast("error", error.message);
      return;
    }
  };

  return (
    <div className={styles.container}>
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
                <div className={styles.account_basicInfo_pic}>
                  {profileData.profilePicture === null ? (
                    <span className={styles.no_pic}>
                      {profileData.firstname[0]}
                      {profileData.lastname[0]}
                    </span>
                  ) : (
                    <Image
                      src={profileData.profilePicture}
                      alt="ProfilPic"
                      width={76}
                      height={76}
                    />
                  )}
                </div>
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
                    <span
                      className={styles.action_remove}
                      onClick={handleRemove}
                    >
                      Remove
                    </span>
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
                    value={name}
                  />
                  {errors.name && (
                    <div className={styles.error}>{errors.name}</div>
                  )}
                </div>

                <div className={styles.dual_input_container}>
                  <span className={styles.input_container}>
                    <div className={styles.input_title}>Email</div>
                    <input
                      type="email"
                      className={styles.input}
                      value={profileData.email}
                      disabled
                      style={{ cursor: "not-allowed" }}
                    />
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

                <div
                  className={styles.action_button}
                  onClick={isSaving ? undefined : saveDataHandler}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </div>

                <div
                  className={styles.action_reset}
                  onClick={handleResetPassword}
                >
                  Reset Password
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
