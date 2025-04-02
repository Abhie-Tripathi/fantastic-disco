"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Search, Upload } from "lucide-react";
import SendInvite from "@/components/ui/SendInvite";
import { useAuthContext, useTheme } from "@/context";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
import { showToast } from "@/utils/showToast";
import { useProfileServices } from "@/services/profileService";
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

const UserCard = ({
  name,
  role,
  email,
}: {
  name: string;
  role: string;
  email: string;
}) => {
  return (
    <Card className="flex items-center gap-4">
      <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
        <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h4 className="font-medium text-foreground">{name}</h4>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
      <span className="text-sm text-foreground">{email}</span>
    </Card>
  );
};

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
  const [isSaving, setIsSaving] = useState(false);
  const [isProfileInfoChange, setIsProfileInfoChange] = useState(false);
  const [isOtherInfoChange, setIsOtherInfoChange] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const { getMyProfileData, updateMyProfileData, error } = useProfileServices();
  const fetchData = async () => {
    // const { data, error } = await myFetch(`${baseUrl}/auth/customer/profile`);
    const data: any = await getMyProfileData();
    if (error) {
      console.log(error);
      showToast("error", error.message);
      return;
    }

    if (data) {
      setProfileData(data);
      if(data.lastname !==null){
        setName(data.firstname + " " + data.lastname);
      }else{
        setName(data.firstname);
      }
      setMobileNo(data.phoneNumber || "");
      setDept(data.department || "");
      setRole(data.designation || "");
      setProfilePicture(data.imageUrl || null);
      setProfilePic(data.imageUrl || null);
    }
  };

  useEffect(() => {
    if (!profileData) {
      fetchData();
    }
  }, [profileData]);

  const handleProfileInputChange = (
    setter: any,
    value: any,
    originalValue: any
  ) => {
    setter(value);
    setIsProfileInfoChange(value !== originalValue);
  };
  const handleAdditionalInfoInputChange = (
    setter: any,
    value: any,
    originalValue: any
  ) => {
    setter(value);
    setIsOtherInfoChange(value !== originalValue);
  };

  const saveDataHandler = async () => {
    try {
      // Validation
      if (!name.trim()) {
        showToast("error", "Name cannot be empty");
        return;
      }

      // const splitName = name.split(" ");
      // if (!splitName[1]) {
      //   showToast("error", "Please enter your full name");
      //   return;
      // }
      const splitName = name.trim().split(/\s+/); // Split by spaces (including multiple spaces)
      // if (splitName.length < 2) {
      //   showToast("error", "Please enter your full name");
      //   return;
      // }

      // if (mobileNo && (mobileNo.length !== 10 || mobileNo.startsWith("+"))) {
      //   showToast("error", "Enter a 10-digit mobile number only");
      //   return;
      // }
      if (
        (mobileNo && !(mobileNo.length === 10 || mobileNo.length === 15)) ||
        (mobileNo.startsWith("+") && mobileNo.length !== 15)
      ) {
        showToast("error", "Please enter a valid mobile number");
        return;
      }

      // if (!dept) {
      //   showToast("error", "Please enter the department");
      //   return;
      // }

      // if (!role) {
      //   showToast("error", "Please enter your role");
      //   return;
      // }

      // Prepare form data
      const formData = new FormData();

      formData.append("firstname", splitName[0]);
      if (splitName[1]) {
        formData.append("lastname", splitName.slice(1).join(" "));
      }else{
        formData.append("lastname", "");
      }
      if(mobileNo.length !== 0){
        formData.append("phoneNumber", mobileNo);
      }
      // formData.append("designation", role);
      // formData.append("department", dept);
      if (picFile !== null) {
        formData.append("file", picFile);
      }

      // Save data
      setIsSaving(true);
      const data: any = await updateMyProfileData({ formData });
      if (data) {
        showToast("success", "Data saved successfully");
        setProfileData(data.user);
        // setProfilePicture(data.user.imageUrl)
        // fetchData();

        const newUser = {
          ...user,
          firstname: data.user.firstname || "",
          lastname: data.user.lastname || "",
          imageUrl:data.user.imageUrl || null

        };
        window.localStorage.setItem("user", JSON.stringify(newUser));
        setIsProfileUpdated(true);
        setIsProfileInfoChange(false);
      }
    } catch (error: any) {
      console.error("Error saving data:", error);
      showToast(
        "error",
        error.message || "An error occurred while saving data"
      );
    } finally {
      setIsSaving(false);
    }
  };
  const handleUploadClick = () => {
    const fileRef = fileInputRef.current as HTMLDivElement;
    fileRef.click();
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const sizeInMB = file.size / (1024 * 1024);
      if (sizeInMB > 1) {
        showToast("error", "Image size should be less than 1 MB");
        return;
      }

      setPicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
        setIsProfileInfoChange(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
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
    // formData.append("designation", role);
    // formData.append("department", dept);
    formData.append("removePicture", "true");
    const data: any = await updateMyProfileData({ formData });
    if (data) {
      const newUser = {
        ...user,
        imageUrl:null

      };
      window.localStorage.setItem("user", JSON.stringify(newUser));
      setIsProfileUpdated(true);
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
    <div className="p-6 pt-0">
      {profileData && (
        <>
          <section className="border-border">
            <div className="flex flex-col lg:flex-row justify-between pb-6">
              <div className="w-full lg:w-[40%] mb-6 lg:mb-0">
                <h3 className="mb-2 text-lg font-semibold">Your Profile</h3>
                <p className="text-sm text-muted-foreground">
                  Here you can view and update your personal details, and manage
                  your settings. Keep your information up-to-date for a seamless
                  experience.
                </p>
              </div>
              <form
                className="flex w-full lg:w-[50%] flex-col gap-6"
                onSubmit={handleFormSubmit}
              >
                <div className="flex sm:flex-row items-center gap-4">
                  <Avatar className="h-20 w-20 text-3xl">
                    <AvatarFallback>
                      {profilePicture === null ? (
                        <span>
                          {profileData.firstname[0]}
                          {profileData.lastname &&
                          profileData.lastname.trim() !== ""
                            ? profileData.lastname[0]
                            : ""}
                        </span>
                      ) : (
                        <Image
                          src={profilePicture}
                          alt="ProfilePic"
                          width={76}
                          height={76}
                        />
                      )}
                    </AvatarFallback>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      accept="image/png, image/jpeg, image/gif"
                      onChange={handleFileChange}
                    />
                  </Avatar>
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleUploadClick();
                        }}
                        // disabled
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemove}
                        // disabled
                      >
                        Remove
                      </Button>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      We support PNGs, JPEGs and GIFs under 1MB
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={name}
                    onChange={(e) =>
                      handleProfileInputChange(
                        setName,
                        e.target.value,
                        // profileData?.firstname,
                        profileData?.firstname&&profileData.lastname
                      )
                    }
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      style={{ cursor: "not-allowed" }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      type="text"
                      value={mobileNo}
                      onChange={(e) => {
                        const value = e.target.value;

                        if (/^\d*$/.test(value)) {
                          handleProfileInputChange(
                            setMobileNo,
                            value,
                            profileData?.phoneNumber
                          );
                        }
                      }}
                    />
                  </div>
                </div>

                {/* <div className="grid gap-4 sm:grid-cols-2"> */}
                {/* <div className=" w-100 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      onValueChange={(value) => {
                        setDept(value);
                        setIsProfileInfoChange(true);
                      }}
                    >
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      onValueChange={(value) => {
                        setRole(value);
                        setIsProfileInfoChange(true);
                      }}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={user?.role ?? "CUSTOMER"}>
                          {user?.role}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div> */}

                {/* <Button>Save Changes</Button> */}
                <Button
                  onClick={isSaving ? undefined : saveDataHandler}
                  className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-ring ${
                    !isProfileInfoChange || isSaving
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:bg-primary"
                  }`}
                  disabled={!isProfileInfoChange || isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>

                {/* <Link
                  href="/reset-password"
                  className="text-primary hover:underline"
                >
                  Reset Password
                </Link> */}
              </form>
            </div>
          </section>

          {/* <section className="border-b border-border py-8">
            <div className="flex flex-col md:flex-row md:justify-between gap-8">
              <div className="w-full md:w-[40%]">
                <h3 className="mb-2 text-lg font-semibold">Organization</h3>
                <p className="text-sm text-muted-foreground">
                  Here you can manage and update your organization&apos;s
                  details, view activity reports, and configure settings and
                  manage users.
                </p>
              </div>
              <form className="flex flex-col gap-6 w-full md:w-[50%]">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={dept}
                    onChange={(e) =>
                      handleAdditionalInfoInputChange(
                        setDept,
                        e.target.value,
                        profileData?.department
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  
                  <Label htmlFor="industry">Industry</Label>
                  <Select>
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select industries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="useCase">Use Case</Label>
                  <Select>
                    <SelectTrigger id="useCase">
                      <SelectValue placeholder="Select usecases" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" />
                </div>
                <Button
                  onClick={isSaving ? undefined : saveDataHandler}
                  className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-ring ${
                    !isOtherInfoChange || isSaving
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                  disabled={!isOtherInfoChange || isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" className="text-destructive">
                  Delete My Organization
                </Button>
              </form>
            </div>
          </section>

          <section className="py-8">
            <div className="flex flex-col md:flex-row md:justify-between gap-8">
              <div className="w-full md:w-[40%] space-y-4">
                <h3 className="text-lg font-semibold">Admin (1)</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-10" placeholder="Search Members" />
                </div>
                <div className="space-y-4">
                  <UserCard
                    name="10 Times"
                    role="Manager of Operations"
                    email="10times@10times.com"
                  />
                  <UserCard
                    name="10 Times"
                    role="Manager of Operations"
                    email="10times@10times.com"
                  />
                  <UserCard
                    name="10 Times"
                    role="Manager of Operations"
                    email="10times@10times.com"
                  />
                </div>
              </div>

              <div className="w-full md:w-[50%] space-y-4">
                <h3 className="text-lg font-semibold">Users (1)</h3>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input className="pl-10" placeholder="Search Members" />
                  </div>
                  <SendInvite />
                </div>
                <div className="space-y-4">
                  <UserCard
                    name="10 Times"
                    role="Manager of Operations"
                    email="10times@10times.com"
                  />
                </div>
              </div>
            </div>
          </section> */}
        </>
      )}
    </div>
  );
};

export default Profile;
