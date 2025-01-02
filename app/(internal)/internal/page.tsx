"use client";
import CoordinateContainer from "@/app/components/internal/Dashboard/Coordinate/CoordinateContainer";
import ManageTeam from "@/app/components/internal/Dashboard/ManageTeam";
import ModuleSelection from "@/app/components/internal/Dashboard/Landing/ModuleSelection";
import RecentActivity from "@/app/components/internal/Dashboard/Recentactivity/RecentActivity";
import React, { useEffect, useRef, useState } from "react";
import styles from './page.style.module.css'
import Research from "@/app/components/internal/Dashboard/Research/Research";
import ModuleCard from "@/app/components/internal/Dashboard/Landing/ModuleCard";
import ProspectModule from '/public/internal/dashboard/ProspectModule.png'
import Prospect from "@/app/components/internal/Dashboard/Prospect";
import PromoteOne from "@/app/components/internal/Dashboard/Promote/PromoteOne";
import PromoteContainer from "@/app/components/internal/Dashboard/Promote/PromoteContainer";
import TrackerContainer from "@/app/components/internal/Dashboard/Tracker/TrackerContainer";
import Outreach from "@/app/components/internal/Dashboard/Outreach/Outreach";
import Trends from "@/app/components/internal/Dashboard/Trends/Trends";
const Dashboard = () => {

  let role = "sa"
  let value = "filled"

  return (
    <div className="flex p-3 min-h-[91vh] max-h-[91vh] gap-3.5">
      <div className="flex-1">
        {/* {(role === "sa" && value === "empty") ? <ModuleSelection value="admin" /> :
          (role === "user" && value === "empty") ? <ModuleSelection value="user" /> :
            (role === "sa" && value === "filled") ?
              <div className="flex flex-col">
                <Research />
                <div className="flex">
                  <TrackerContainer width="large" />
                </div>
              </div> : <></>
        } */}
        {/* <ModuleSelection value="admin" /> */}
        {/* <ModuleSelection value="user" /> */}
        <Research />
        {/* <CoordinateContainer height="small"/> */}
        {/* <CoordinateContainer height="large"/> */}
        {/* <Prospect/> */}
        {/* <PromoteContainer width="large"/> */}
        {/* <PromoteContainer width="small"/> */}
        {/* <TrackerContainer width="smaller"/> */}
        {/* <Outreach/> */}
        {/* <Trends container="small"/> */}
      </div>
      <div className="flex flex-col min-w-[20%] gap-2">
        <RecentActivity />
        <ManageTeam />
      </div>
    </div>
  );
};

export default Dashboard;
