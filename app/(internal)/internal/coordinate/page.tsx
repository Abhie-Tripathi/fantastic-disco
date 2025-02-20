"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.style.module.css";
import Internal from "@/app/components/internal/Internal";
import { useCoordinateService } from "@/services/coordinateService";

const Page = () => {
  const coordinateService = useCoordinateService();

  const [coordinateActions, setCoordinateActions] = useState<any>([]);

  const [pipelineConfig, setPipelineConfig] = useState<any>([]);

  const getInterestConfig = async () => {
    try {
      const apiData: any = await coordinateService.getInterestConfig();
      setCoordinateActions(apiData?.interest?.slice(1));

      const pipelineData: any = await coordinateService.getPipelineConfig();
      setPipelineConfig(pipelineData.outreach);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getInterestConfig();
  }, []);

  return (
    <div className={`${styles.container}`}>
      <div>
        <Internal
          coordinateActions={coordinateActions}
          pipelineConfig={pipelineConfig}
        />
      </div>
    </div>
  );
};

export default Page;
