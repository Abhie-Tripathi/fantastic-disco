"use client";

import styles from "./index.style.module.css";
import uploadIcon from "/public/upload.svg";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
import { showToast } from "@/utils/showToast";
import { useAuthContext, useTheme } from "@/context";
import { UserResponse } from "@/types/user";

interface Profile {
  firstname: string;
  lastname: string;
  designation: string;
  file: any;
  profilePicture: string;
  fileType: string;
  email: string;
  phoneNumber: string;
  department: string;
}

const Profile = () => {
  const { user, setIsProfileUpdated, setProfilePic } = useAuthContext();
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [dept, setDept] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [picFile, setPicFile] = useState<any>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const fileInputRef = useRef<any>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false); // New loading state
  const { theme } = useTheme();
  const iconClass = theme === "dark" ? "icons_light" : "icon";

  const handleUploadClick = () => {
    const fileRef = fileInputRef.current as HTMLDivElement;
    fileRef.click();
  };

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
      setName(data.user.firstname + " " + data.user.lastname);
      setMobileNo(data.user.phoneNumber || "");
      setDept(data.user.department || "");
      setRole(data.user.designation || "");
      setProfilePicture(data.user.profilePicture || null);
      setProfilePic(data.user.profilePicture || null);
    }
  };

  const loginedUser = user;
  console.log(user);

  useEffect(() => {
    if (!profileData) {
      fetchData();
    }
  }, [profileData]);
  
  const saveDataHandler = async () => {
    const newErrors: Record<string, string> = {};

    if (name.length === 0) {
      newErrors.name = "Name cannot be empty";
    }
    const splitName = name.split(" ");

    if (!name.trim()) {
      newErrors.name = "Name cannot be empty";
    }
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
      // setProfilePic(data.user.profilePicture)
      showToast("success", "Data Saved Successfully");
      fetchData();

      console.log(loginedUser);

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

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setPicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
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
    if (!profilePicture) {
      showToast("error", "No Profile Pic Found");
      return;
    }
    const splitName = name.split(" ");
    const formData = new FormData();
    formData.append("firstname", splitName[0]);
    formData.append("lastname", splitName[1]);
    formData.append("phoneNumber", mobileNo);
    formData.append("designation", role);
    formData.append("department", dept);
    formData.append("removePicture", "true");
    const { data, error } = await myFetch(`${baseUrl}/auth/customer/profile`, {
      method: "PATCH",
      body: formData,
    });

    if (data) {
      console.log(data);
      setProfileData(data.user);
      setProfilePicture(null);
      setProfilePic(null);
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
                  {profilePicture === null ? (
                    <span className={styles.no_pic}>
                      {profileData.firstname[0]}
                      {profileData.lastname[0]}
                    </span>
                  ) : (
                    <Image
                      src={profilePicture}
                      alt="ProfilePic"
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
                        className={`${styles.image} ${iconClass}`}
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
                onChange={handleFileChange}
              />

              <div className={styles.account_details}>
                <div className={styles.input_container}>
                  <div className={styles.input_title}>Full Name</div>
                  <input
                    type="text"
                    className={`${styles.input} ${
                      errors.name && styles.error_boundary
                    }`}
                    onChange={(e) => setName(e.target.value)}
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
                      value={mobileNo}
                    />
                    {errors.mobileNo && (
                      <div className={styles.error}>{errors.mobileNo}</div>
                    )}
                  </span>
                </div>

                <div className={styles.dual_input_container}>
                  <span className={styles.input_container}>
                    <div className={styles.input_title}>Role</div>
                    <input
                      type="text"
                      className={`${styles.input} ${
                        errors.role && styles.error_boundary
                      }`}
                      onChange={(e) => setRole(e.target.value)}
                      value={role}
                    />
                    {errors.role && (
                      <div className={styles.error}>{errors.role}</div>
                    )}
                  </span>

                  <span className={styles.input_container}>
                    <div className={styles.input_title}>Department</div>
                    <input
                      type="text"
                      className={`${styles.input} ${
                        errors.dept && styles.error_boundary
                      }`}
                      onChange={(e) => setDept(e.target.value)}
                      value={dept}
                    />
                    {errors.dept && (
                      <div className={styles.error}>{errors.dept}</div>
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
