"use client";
import CoordinateContainer from "@/app/components/internal/Dashboard/Coordinate/CoordinateContainer";
import ManageTeam from "@/app/components/internal/Dashboard/ManageTeam";
import ModuleSelection from "@/app/components/internal/Dashboard/Landing/ModuleSelection";
import RecentActivity from "@/app/components/internal/Dashboard/Recentactivity/RecentActivity";
import React, { useEffect, useRef, useState } from "react";
import styles from './page.style.module.css'
import Research from "@/app/components/internal/Dashboard/Research/Research";
const Dashboard = () => {

  return (
    <div className="flex p-3 min-h-[91vh] max-h-[91vh]">
      <div className="flex-1">
        {/* <ModuleSelection /> */}
        {/* <CoordinateContainer/> */}
        <Research/>

      </div>
      <div className="flex-none w-[20%]">
        {/* <RecentActivity/>
      <ManageTeam/> */}
      </div>
    </div>
  );
};

export default Dashboard;
