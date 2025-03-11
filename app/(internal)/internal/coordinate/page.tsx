"use client";
import React from "react";
import styles from "./page.style.module.css";
import Internal from "@/app/components/internal/Internal";
import { useConfiguration } from "@/hooks/useConfiguration";
import Loading from "@/components/ui/Loading";
import AddEventModal from "@/components/coordinate/addEvent/AddEventModal";

const Page = () => {
  const {
    interestConfiguration,
    isLoading: isInterestConfigLoading,
  } = useConfiguration.interest();

  const {
    outreachConfiguration,
    isLoading: isOutreachConfigLoading,
  } = useConfiguration.outreach();

  return (
    <AddEventModal />
  );

  return (
    <div className={`${styles.container}`}>
      { (isInterestConfigLoading || isOutreachConfigLoading) ?
        <Loading className="p-12" /> :
        <Internal
          coordinateActions={interestConfiguration?.interest}
          pipelineConfig={outreachConfiguration?.outreach}
        />
      }
    </div>
  );
};

export default Page;
