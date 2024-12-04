"use client";

import styles from "./page.module.css";
import uploadIcon from "/public/upload.svg";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
import { showToast } from "@/utils/showToast";
import { useAuthContext, useTheme } from "@/context";
import { UserResponse } from "@/types/user";
import ProductSettings from "./productsettings/ProductSettings";

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
  const [location, setLocation] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [picFile, setPicFile] = useState<any>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const fileInputRef = useRef<any>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false); // New loading state
  const { theme } = useTheme();
  const iconClass = theme === "dark" ? "icons_light" : "icon";
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [isUseCaseOpen, setIsUseCaseOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [hasDeptChanges, setHasDeptChanges] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState("Select department");
  const [selectedRole, setSelectedRole] = useState("Select Role");
  const [selectedIndustry, setSelectedIndustry] = useState("Select industry");
  const [selectedUseCase, setSelectedUseCase] = useState("Select usecase");

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
      const sizeInMB = file.size / (1024 * 1024);
      if (sizeInMB > 2) {
        showToast("error", "Image size should be less than 2mb");
        return;
      }

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

  const userList = [
    {
      userName: "Helen Kaur",
      designation: "Manager of Operations",
      email: "10times@10times.com",
    },
    {
      userName: "Helen Kaur",
      designation: "Manager of Operations",
      email: "10times@10times.com",
    },
    {
      userName: "Helen Kaur",
      designation: "Manager of Operations",
      email: "10times@10times.com",
    },
  ];

  const toggleDepartmentDropdown = () => setIsDepartmentOpen(!isDepartmentOpen);
  const toggleRoleDropdown = () => setIsRoleOpen(!isRoleOpen);
  const toggleIndustriesDropdown = () => setIsIndustryOpen(!isIndustryOpen);
  const toggleUsesCasesDropdown = () => setIsUseCaseOpen(!isUseCaseOpen);

  const handleSelectedDepartment = (value: any) => {
    setSelectedDepartment(value);
    setIsDepartmentOpen(false);
  };
  const handleSelectedRole = (value: any) => {
    setSelectedRole(value);
    setIsRoleOpen(false);
  };

  const handleSelectedUsecase = (value: any) => {
    setSelectedUseCase(value);
    setIsUseCaseOpen(false);
  };
  const handleSelectedIndustries = (value: any) => {
    setSelectedIndustry(value);
    setIsIndustryOpen(false);
  };

  const handleInputChange = (setter: any, value: any, originalValue: any) => {
    setter(value);
    setHasChanges(value !== originalValue);
  };
  const handleDeptInputChange = (
    setter: any,
    value: any,
    originalValue: any
  ) => {
    setter(value);
    setHasDeptChanges(value !== originalValue);
  };

  const [activeTab, setActiveTab] = useState("profile");

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.container}>
      <div className={styles.stickyHeader}>
        <div
          className={`${styles.tab} ${
            activeTab === "profile" ? styles.active : ""
          }`}
          onClick={() => handleTabChange("profile")}
        >
          Your Profile
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === "settings" ? styles.active : ""
          }`}
          onClick={() => handleTabChange("settings")}
        >
          Product Settings
        </div>
      </div>

      <div className={styles.content}>
        {activeTab === "profile" && (
          <div className={styles.profileSection}>
            {profileData && (
              <div>
                <div className={styles.account}>
                  <div className={styles.account_left}>
                    <div className={styles.profile_header}>Your Profile</div>
                    <div className={styles.input_title}>
                      Here you can view and update your personal details, and
                      manage your settings. Keep your information up-to-date for
                      a seamless experience.
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

                        <div className={styles.upload_container}>
                          <div
                            className={styles.action_upload}
                            onClick={handleUploadClick}
                          >
                            <Image
                              src={uploadIcon}
                              alt="upload"
                              className={`${styles.image} ${iconClass}`}
                            />
                            <div>Upload Image</div>
                          </div>
                          <div
                            className={styles.action_remove}
                            onClick={handleRemove}
                          >
                            Remove
                          </div>
                        </div>
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
                          // onChange={(e) => setName(e.target.value)}
                          onChange={(e) =>
                            handleInputChange(
                              setName,
                              e.target.value,
                              profileData?.firstname
                            )
                          }
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
                          <div className={styles.input_title}>
                            Mobile Number
                          </div>
                          <input
                            type="text"
                            className={`${styles.input} ${
                              errors.mobileNo && styles.error_boundary
                            }`}
                            onChange={(e) => setMobileNo(e.target.value)}
                            value={mobileNo}
                          />
                          {errors.mobileNo && (
                            <div className={styles.error}>
                              {errors.mobileNo}
                            </div>
                          )}
                        </span>
                      </div>

                      <div className={styles.dual_input_container}>
                        <span className={styles.input_container}>
                          <div className={styles.input_title}>Department</div>
                          <div className={styles.dropdown}>
                            <button
                              className={styles.dropdown_trigger}
                              onClick={toggleDepartmentDropdown}
                              aria-expanded={isDepartmentOpen}
                            >
                              {selectedDepartment}
                              <span className={styles.dropdown_icon}>
                                <DownIcon />
                              </span>
                            </button>
                            {isDepartmentOpen && (
                              <ul className={styles.dropdown_content}>
                                <li
                                  onClick={() =>
                                    handleSelectedDepartment("Marketing")
                                  }
                                >
                                  Marketing
                                </li>
                                <li
                                  onClick={() =>
                                    handleSelectedDepartment("Sales")
                                  }
                                >
                                  Sales
                                </li>
                                <li
                                  onClick={() =>
                                    handleSelectedDepartment("Engineering")
                                  }
                                >
                                  Engineering
                                </li>
                              </ul>
                            )}
                          </div>
                          {errors.role && (
                            <div className={styles.error}>{errors.role}</div>
                          )}
                        </span>

                        <span className={styles.input_container}>
                          <div className={styles.input_title}>Role</div>
                          <div className={styles.dropdown}>
                            <button
                              className={styles.dropdown_trigger}
                              onClick={toggleRoleDropdown}
                              aria-expanded={isRoleOpen}
                            >
                              {selectedRole}
                              <span className={styles.dropdown_icon}>
                                <DownIcon />
                              </span>
                            </button>
                            {isRoleOpen && (
                              <ul className={styles.dropdown_content}>
                                <li
                                  onClick={() =>
                                    handleSelectedRole("Marketing")
                                  }
                                >
                                  Marketing
                                </li>
                                <li onClick={() => handleSelectedRole("Sales")}>
                                  Sales
                                </li>
                                <li
                                  onClick={() =>
                                    handleSelectedRole("Engineering")
                                  }
                                >
                                  Engineering
                                </li>
                              </ul>
                            )}
                          </div>
                          {errors.dept && (
                            <div className={styles.error}>{errors.dept}</div>
                          )}
                        </span>
                      </div>

                      <div
                        // className={styles.action_button}
                        className={`${styles.action_button} ${
                          !hasChanges && styles.disabled
                        }`}
                        onClick={isSaving ? undefined : saveDataHandler}
                        style={{
                          cursor: hasChanges ? "pointer" : "not-allowed",
                        }}
                      >
                        <span className={styles.savechanges_text}>
                          {isSaving ? "Saving..." : "Save Changes"}
                        </span>
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
                <div className={styles.line_divider}></div>
                <div className={styles.account_below_section}>
                  <div className={styles.account_left}>
                    <div className={styles.profile_header}>Organisation</div>
                    <div className={styles.input_title}>
                      Here you can manage and update your organization&apos;s
                      details, view activity reports, and configure settings and
                      manage users.
                    </div>
                  </div>
                  <div className={styles.account_right}>
                    <div className={styles.account_details_below_sec}>
                      <div className={styles.input_container_below_section}>
                        <div className={styles.input_title}>
                          Organisation name
                        </div>
                        <input
                          type="text"
                          className={`${styles.input} ${
                            errors.dept && styles.error_boundary
                          }`}
                          // onChange={(e) => setDept(e.target.value)}
                          onChange={(e) =>
                            handleDeptInputChange(setDept, e.target.value, dept)
                          }
                          value={dept}
                        />
                        {errors.dept && (
                          <div className={styles.error}>{errors.dept}</div>
                        )}
                      </div>

                      <div className={styles.input_container_below_section}>
                        {/* 
                  {errors.dept && (
                    <div className={styles.error}>{errors.dept}</div>
                  )} */}
                        <div className={styles.input_title}>Industry</div>
                        <div className={styles.dropdown}>
                          <button
                            className={styles.dropdown_trigger}
                            onClick={toggleIndustriesDropdown}
                            aria-expanded={isIndustryOpen}
                          >
                            {selectedIndustry}
                            <span className={styles.dropdown_icon}>
                              <DownIcon />
                            </span>
                          </button>
                          {isIndustryOpen && (
                            <ul className={styles.dropdown_content}>
                              <li
                                onClick={() =>
                                  handleSelectedIndustries("Marketing")
                                }
                              >
                                Marketing
                              </li>
                              <li
                                onClick={() =>
                                  handleSelectedIndustries("Sales")
                                }
                              >
                                Sales
                              </li>
                              <li
                                onClick={() =>
                                  handleSelectedIndustries("Engineering")
                                }
                              >
                                Engineering
                              </li>
                            </ul>
                          )}
                        </div>
                      </div>
                      <div className={styles.input_container_below_section}>
                        {/* 
                  {errors.dept && (
                    <div className={styles.error}>{errors.dept}</div>
                  )} */}
                        <div className={styles.input_title}>Use case</div>
                        <div className={styles.dropdown}>
                          <button
                            className={styles.dropdown_trigger}
                            onClick={toggleUsesCasesDropdown}
                            aria-expanded={isUseCaseOpen}
                          >
                            {selectedUseCase}
                            <span className={styles.dropdown_icon}>
                              <DownIcon />
                            </span>
                          </button>
                          {isUseCaseOpen && (
                            <ul className={styles.dropdown_content}>
                              <li
                                onClick={() =>
                                  handleSelectedUsecase("Marketing")
                                }
                              >
                                Marketing
                              </li>
                              <li
                                onClick={() => handleSelectedUsecase("Sales")}
                              >
                                Sales
                              </li>
                              <li
                                onClick={() =>
                                  handleSelectedUsecase("Engineering")
                                }
                              >
                                Engineering
                              </li>
                            </ul>
                          )}
                        </div>
                      </div>

                      <div className={styles.input_container_below_section}>
                        <div className={styles.input_title}>Location</div>
                        <input
                          type="text"
                          className={`${styles.input} ${
                            errors.dept && styles.error_boundary
                          }`}
                          onChange={(e) => setDept(e.target.value)}
                          value={location}
                        />
                        {errors.dept && (
                          <div className={styles.error}>{errors.dept}</div>
                        )}
                      </div>
                      <div
                        // className={styles.action_button}
                        // onClick={isSaving ? undefined : saveDataHandler}
                        className={`${styles.action_button} ${
                          !hasDeptChanges && styles.disabled
                        }`}
                        onClick={isSaving ? undefined : saveDataHandler}
                        style={{
                          cursor: hasDeptChanges ? "pointer" : "not-allowed",
                        }}
                      >
                        <span className={styles.savechanges_text}>
                          {isSaving ? "Saving..." : "Save Changes"}
                        </span>
                      </div>
                      <div
                        className={styles.action_delete_my_organization}
                        onClick={handleResetPassword}
                      >
                        Delete My Organization
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.line_divider}></div>
                <div className={styles.account_below_section}>
                  <div className={styles.account_left}>
                    <div className={styles.admin_container}>
                      <div className={styles.profile_header_admin}>
                        Super Admin (1)
                      </div>
                      <div className={styles.search_container}>
                        <div className={styles.search_box}>
                          <div className={styles.search_icon}>
                            <SearchIcon />
                          </div>
                          <input
                            className={`${styles.input} ${styles.search_input}`}
                            type="text"
                            placeholder="Search Members"
                          />
                        </div>
                      </div>
                      {userList.slice(0, 1).map((items, key) => {
                        return (
                          <div className={styles.user_list_container} key={key}>
                            <div className={styles.userPrifile_container}>
                              10
                            </div>
                            <div
                              className={
                                styles.UserNameAndDesignation_container
                              }
                            >
                              <div className={styles.userName}>
                                {items.userName}
                              </div>
                              <div className={styles.userDesignation}>
                                {items.designation}
                              </div>
                            </div>
                            <div className={styles.userEmail}>
                              {items.email}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className={styles.account_right}>
                    <div className={styles.user_container}>
                      <div className={styles.profile_header_user}>Users(3)</div>

                      <div className={styles.search_container}>
                        <div className={styles.search_box}>
                          <div className={styles.search_icon}>
                            <SearchIcon />
                          </div>
                          <input
                            className={`${styles.input} ${styles.search_input}`}
                            type="text"
                            placeholder="Search Members"
                          />
                        </div>
                        <button className={styles.invite_btn}>
                          Send Invite
                        </button>
                      </div>

                      {userList.map((items, key) => {
                        return (
                          <div className={styles.user_list_container} key={key}>
                            <div className={styles.userPrifile_container}>
                              10
                            </div>
                            <div
                              className={
                                styles.UserNameAndDesignation_container
                              }
                            >
                              <div className={styles.userName}>
                                {items.userName}
                              </div>
                              <div className={styles.userDesignation}>
                                {items.designation}
                              </div>
                            </div>
                            <div className={styles.userEmail}>
                              {items.email}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <>
            <ProductSettings />
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;

function DownIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 8 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.40811 0.842715L7.10976 1.14103L4.39671 3.85406C4.17705 4.07378 3.82089 4.07378 3.60122 3.85406L0.888154 1.14103L0.589844 0.842715L1.18647 0.246094L1.48478 0.544404L3.99897 3.05859L6.51318 0.544404L6.81147 0.246094L7.40811 0.842715Z"
        fill="#A8A8A8"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1.875 4.5C1.875 3.05025 3.05025 1.875 4.5 1.875C5.94975 1.875 7.125 3.05025 7.125 4.5C7.125 5.16346 6.87885 5.76942 6.47293 6.23157L6.23157 6.47293C5.76942 6.87885 5.16346 7.125 4.5 7.125C3.05025 7.125 1.875 5.94975 1.875 4.5ZM6.72408 7.51958C6.10183 7.97865 5.3326 8.25 4.5 8.25C2.42894 8.25 0.75 6.57106 0.75 4.5C0.75 2.42894 2.42894 0.75 4.5 0.75C6.57106 0.75 8.25 2.42894 8.25 4.5C8.25 5.3326 7.97865 6.10183 7.51958 6.72408L9.77273 8.97727L10.1705 9.375L9.375 10.1705L8.97727 9.77273L6.72408 7.51958Z"
        fill="#A8A8A8"
      />
    </svg>
  );
}
