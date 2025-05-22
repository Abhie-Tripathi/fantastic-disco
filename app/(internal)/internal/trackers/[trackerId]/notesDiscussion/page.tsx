"use client";
import React from "react";
import styles from "./notesDiscussion.style.module.css";
import { Notes } from "@/app/components/eventDetail/Notes";
// import SideNav from '@/app/components/trackers/sideNav';
const Trackers = React.lazy(
  () => import("@/app/components/internal/trackers/CommonTrackerCard")
);
const Page = () => {
  return (
    <div className="flex gap-5 px-0 md:px-8">
      <div className="hidden md:flex w-[30%]">
        {/* <SideNav/> */}
        <Trackers />
      </div>

      <div className="w-full md:w-[70%] md:h-[calc(100vh-164px)] h-[calc(100vh-210px)] px-4 md:px-0">
        <Notes />
      </div>
    </div>
  );
};

export default Page;
