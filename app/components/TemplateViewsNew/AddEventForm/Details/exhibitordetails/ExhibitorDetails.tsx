import React, { useEffect } from "react";
import styles from "./exhibitordetails.styles.module.css";
import EditIcon from "/public/EditIcon.svg";
import Image from "next/image";
// import SpeakerCard from './SpeakerCard';
import { FormState } from "@/types/Formstate";
import ExhibitorCard from "./exhibitorcard/ExhibitorCard";

interface SpeakerProfileType {
  id: string;
  name: string;
  linkedin: string;
  designation: string;
  // profileImage: string | ArrayBuffer | null;
  profileImage: File | null;
}

interface Props {
  handleChange: (field: keyof FormState, value: any) => void;
  // setSpeakerModal: (value: boolean) => void
  exhibitorDetailsData: any[];
  handlePrefillExhibitorDetails: (value: any, key: number) => void;
  formTheme : string;
}
const ExhibitorDetails = ({
exhibitorDetailsData,
  handlePrefillExhibitorDetails,
  handleChange,formTheme
}: Props) => {
  useEffect(() => {
    console.log("exhibitor_are", exhibitorDetailsData);
  }, [exhibitorDetailsData]);
  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <div className={styles.header}>
          <ExhibitorIcon color={formTheme === "dark" ? "white" : "#7d7d7d"}/>
          <span className={formTheme === "light" ? "text-[var(--tertiary-text-color)]" : "text-[#ffffff]"}>Add Exhibitor details</span>
        </div>
        <Image
          onClick={() => handleChange("exhibitorModal", true)}
          src={EditIcon}
          alt="edit"
        />
      </div>
      {exhibitorDetailsData.length > 0 && (
        <div className={styles.speakerProfiles}>
          {exhibitorDetailsData.map((profile, key) => (
            <div onClick={() => handlePrefillExhibitorDetails(profile, key)} key={key}>
              <ExhibitorCard profileImage={profile.imageUrl} companyName={profile.data?.companyName} boothNumber={profile?.data.boothNumber}/>
              {/* <SpeakerCard linkedin={profile.data.linkedIn} profileImage={profile.imageUrl} designation={profile.data.designation} name={profile.data.name} key={key}/> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExhibitorDetails;

interface IconProps{
  color : string;
}

function ExhibitorIcon({color} : IconProps) {
  return (
    <svg
      width="20"
      height="17"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.66667 12.0827H13.3333V18.3327H6.66667V12.0827ZM5 1.66602H15V4.16602H5V1.66602Z"
        stroke={color}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6.66602 4.16602V12.0827M13.3327 4.16602V12.0827"
        stroke={color}
        stroke-width="1.66667"
        stroke-linecap="round"
      />
      <path
        d="M1.66602 18.332H18.3327"
        stroke={color}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
