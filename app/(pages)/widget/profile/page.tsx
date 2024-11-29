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
  console.log("sdfsdfsdf", name.trim());

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

      {/* Content Section */}
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
                  <div className={styles.account_right}>
                    <div className={styles.user_container}>
                      <div className={styles.profile_header_user}>
                        Users(11)
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
          <div className={styles.settingsSection}>
            <div className={styles.settings_container}>
              <div className={styles.settings_icon}>
                <SettingIcon className={iconClass} />
              </div>
              <div className={styles.settings_text}>
                <div className={styles.customise_text}>
                  Customise to your needs
                </div>
                <div className={styles.subText}>
                  Take Control of what others see, what modules can access and
                  how you receive updates and notify.{" "}
                </div>
              </div>
            </div>
            <div className={styles.settings_page_body}>
              <div className={styles.first_div}>
                <div className={styles.first_div_header}>
                  <div className={styles.text_outer}>
                    <div className={styles.research_text}>Research</div>
                    <div className={styles.field_value_text}>Field Values</div>
                  </div>
                </div>

                <div className={styles.first_div_body}>
                  <div className={styles.body_container}>
                    <div className={styles.body_left_section}>
                      Customise your event experience by adjusting your interest! Update them any time to match your needs or goals for the event. 
                    </div>
                    <div className={styles.body_right_section}>

                    </div>
                  </div>
                </div>
              </div>






              <div className={styles.second_div}>
                <div className={styles.second_div_header}>
                  <div className={styles.second_div_text_outer}>
                    <div className={styles.second_div_outreach_text}>
                      Outreach
                    </div>
                    <div className={styles.second_div_field_value_text}>
                     Kanban board
                    </div>
                  </div>
                </div>

                <div className={styles.second_div_body}>
                  <div className={styles.second_div_body_container}>
                    <div className={styles.second_div_body_left_section}>
                      ___________________outreach screen_________
                    </div>
                    <div className={styles.second_div_body_right_section}>
                      _______________kanban screen_________
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

function SettingIcon({ className }: any) {
  return (
    <svg
      className={className}
      width="16"
      height="18"
      viewBox="0 0 16 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8" cy="9" r="2" fill="#000" />
      <path
        d="M2.49936 3.89989L2.81186 3.35822C2.68917 3.28744 2.54607 3.26044 2.40602 3.28164C2.26597 3.30283 2.13728 3.37097 2.04103 3.47489L2.49936 3.89989ZM0.833527 6.78655L0.236027 6.60155C0.194229 6.73693 0.199667 6.88249 0.25145 7.01437C0.303232 7.14625 0.398287 7.25662 0.521027 7.32739L0.833527 6.78655ZM0.831861 11.2124L0.519361 10.6707C0.396594 10.7417 0.301593 10.8522 0.249955 10.9843C0.198318 11.1163 0.193112 11.262 0.235194 11.3974L0.831861 11.2124ZM2.49853 14.0991L2.04019 14.5241C2.13645 14.628 2.26514 14.6961 2.40519 14.7173C2.54524 14.7385 2.68833 14.7115 2.81103 14.6407L2.49853 14.0991ZM6.33186 16.3116H5.70686C5.70686 16.6032 5.90936 16.8557 6.19353 16.9207L6.33186 16.3116ZM9.66603 16.3132L9.80519 16.9232C9.94333 16.8917 10.0666 16.8141 10.1549 16.7033C10.2432 16.5925 10.2912 16.4549 10.291 16.3132H9.66603ZM13.5002 14.0999L13.1877 14.6416C13.3104 14.7123 13.4535 14.7393 13.5935 14.7181C13.7336 14.6969 13.8623 14.6288 13.9585 14.5249L13.5002 14.0999ZM15.1652 11.2116L15.7627 11.3966C15.8045 11.2612 15.7991 11.1156 15.7473 10.9837C15.6955 10.8519 15.6004 10.7415 15.4777 10.6707L15.1652 11.2116ZM15.1669 6.78572L15.4794 7.32739C15.6021 7.25646 15.6971 7.14589 15.7488 7.01384C15.8004 6.8818 15.8056 6.73612 15.7635 6.60072L15.1669 6.78572ZM13.5002 3.89822L13.9585 3.47406C13.8623 3.37014 13.7336 3.302 13.5935 3.2808C13.4535 3.25961 13.3104 3.28661 13.1877 3.35739L13.5002 3.89822ZM9.66686 1.68739H10.2919C10.2918 1.54584 10.2437 1.40849 10.1555 1.29783C10.0672 1.18717 9.94402 1.10974 9.80603 1.07822L9.66686 1.68739ZM6.33353 1.68572L6.19436 1.07572C6.05623 1.10727 5.93291 1.18482 5.84464 1.29566C5.75636 1.40649 5.70837 1.54403 5.70853 1.68572H6.33353ZM1.43103 6.97155C1.73433 5.98565 2.25585 5.08075 2.95686 4.32405L2.04019 3.47406C1.21181 4.3682 0.595452 5.43743 0.236861 6.60239L1.43103 6.97155ZM2.04603 12.4374C1.78877 11.9923 1.58194 11.52 1.42936 11.0291L0.236027 11.3982C0.415897 11.9783 0.659906 12.5364 0.963527 13.0624L2.04603 12.4374ZM2.95769 13.6757C2.60872 13.2981 2.30294 12.8828 2.04603 12.4374L0.963527 13.0624C1.26693 13.5884 1.62805 14.0781 2.04019 14.5241L2.95769 13.6757ZM9.52769 15.7049C8.52215 15.9337 7.47798 15.9332 6.47269 15.7032L6.19436 16.9216C7.38278 17.1936 8.61723 17.1945 9.80603 16.9241L9.52769 15.7049ZM14.5694 11.0282C14.2661 12.0141 13.7445 12.919 13.0435 13.6757L13.9602 14.5257C14.7886 13.6316 15.4049 12.5623 15.7635 11.3974L14.5694 11.0282ZM13.9544 5.56239C14.216 6.01961 14.4216 6.48905 14.571 6.97072L15.7644 6.60155C15.5845 6.02151 15.3405 5.46334 15.0369 4.93739L13.9544 5.56239ZM13.0419 4.32405C13.3835 4.69322 13.6902 5.10739 13.9535 5.56239L15.0369 4.93739C14.7332 4.41133 14.371 3.91997 13.9585 3.47406L13.0419 4.32405ZM6.47186 2.29489C7.4774 2.06603 8.52157 2.0666 9.52686 2.29656L9.80603 1.07822C8.6176 0.806153 7.38233 0.805298 6.19353 1.07572L6.47186 2.29489ZM6.95769 3.22656V1.68489H5.70769V3.22656H6.95769ZM4.14603 4.12822L2.81186 3.35822L2.18686 4.44072L3.52019 5.21072L4.14603 4.12822ZM1.85436 9.90239L0.520194 10.6724L1.14519 11.7549L2.47936 10.9849L1.85436 9.90239ZM2.47936 7.01489L1.14603 6.24572L0.521027 7.32905L1.85436 8.09822L2.47936 7.01489ZM6.95853 16.3124V14.7732H5.70853V16.3124H6.95853ZM3.52103 12.7891L2.18686 13.5591L2.81186 14.6424L4.14519 13.8716L3.52103 12.7891ZM13.8135 13.5591L12.4794 12.7891L11.8544 13.8716L13.1877 14.6416L13.8135 13.5591ZM10.2919 16.3141V14.7732H9.04186V16.3149L10.2919 16.3141ZM14.8552 6.24489L13.521 7.01489L14.146 8.09822L15.4794 7.32739L14.8552 6.24489ZM15.4785 10.6716L14.146 9.90156L13.521 10.9849L14.8544 11.7541L15.4785 10.6716ZM10.2919 3.22656V1.68739H9.04186V3.22656H10.2919ZM13.1885 3.35822L11.8544 4.12822L12.4794 5.21155L13.8135 4.44072L13.1885 3.35822ZM9.04186 3.22656C9.04186 4.99072 10.9519 6.09405 12.4794 5.21155L11.8544 4.12822C11.696 4.21963 11.5165 4.26776 11.3336 4.26778C11.1508 4.2678 10.9712 4.21971 10.8129 4.12833C10.6545 4.03696 10.523 3.90552 10.4316 3.74723C10.3401 3.58894 10.2919 3.40937 10.2919 3.22656H9.04186ZM13.521 7.01489C11.9935 7.89739 11.9935 10.1024 13.521 10.9849L14.146 9.90156C13.9877 9.81013 13.8562 9.67863 13.7648 9.52028C13.6734 9.36193 13.6252 9.18231 13.6252 8.99947C13.6252 8.81663 13.6734 8.63701 13.7648 8.47866C13.8562 8.32031 13.9877 8.18882 14.146 8.09739L13.521 7.01489ZM12.4794 12.7891C10.9519 11.9066 9.04186 13.0091 9.04186 14.7732H10.2919C10.2919 14.5904 10.3401 14.4108 10.4316 14.2525C10.523 14.0943 10.6545 13.9628 10.8129 13.8714C10.9712 13.7801 11.1508 13.732 11.3336 13.732C11.5165 13.732 11.696 13.7801 11.8544 13.8716L12.4794 12.7891ZM6.95853 14.7732C6.95853 13.0091 5.04853 11.9066 3.52103 12.7891L4.14519 13.8716C4.30351 13.7801 4.48394 13.732 4.66675 13.732C4.84956 13.732 5.02916 13.7801 5.1875 13.8714C5.34584 13.9628 5.47735 14.0943 5.5688 14.2525C5.66026 14.4108 5.70845 14.5904 5.70853 14.7732H6.95853ZM2.47936 10.9849C4.00686 10.1024 4.00686 7.89739 2.47936 7.01489L1.85436 8.09822C2.0127 8.18965 2.14419 8.32115 2.2356 8.47949C2.32702 8.63784 2.37515 8.81746 2.37515 9.00031C2.37515 9.18315 2.32702 9.36277 2.2356 9.52112C2.14419 9.67946 2.0127 9.81096 1.85436 9.90239L2.47936 10.9849ZM5.70853 3.22656C5.70845 3.40937 5.66026 3.58894 5.5688 3.74723C5.47735 3.90552 5.34584 4.03696 5.1875 4.12833C5.02916 4.21971 4.84956 4.2678 4.66675 4.26778C4.48394 4.26776 4.30435 4.21963 4.14603 4.12822L3.52103 5.21155C5.04853 6.09322 6.95853 4.99072 6.95853 3.22656H5.70853Z"
        fill="#000"
      />
    </svg>
  );
}
