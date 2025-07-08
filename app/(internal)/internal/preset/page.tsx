"use client"
import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import TrackerPublic from "@/public/trackerPublic.jpg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTrackerServices } from "@/services/trackerServices";
import { isEventeli } from "@/config";
import Loading from "@/components/ui/Loading";

const Preset = () => {
  const searchParams = useSearchParams();
  const trackerType = searchParams.get("type");
  const presetId = searchParams.get("presetId");
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");
  const router = useRouter()
    console.log("params", searchParams.toString);
  const { presetData, createTracker } = useTrackerServices();
  const [isLoading, setIsLoading] = useState(false);
  const [presetTemplateData, setPresetTemplateData] = useState();

  const fetchPresetJson = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const data = {
        trackerType,
        offset,
        limit,
      };

      const result = await presetData(data);
      if (result) {
        setPresetTemplateData(result?.trackers);
        createTrackerHandler(result?.trackers[0]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [trackerType, offset, limit, presetData, isLoading]);
  useEffect(()=>{
    fetchPresetJson();
  },[])
  const redirectUrl = encodeURIComponent(
    `presetId=${presetId}&limit=${limit}&offset=${offset}&type=${trackerType}`
  );
  const createTrackerHandler=async (presetData)=>{
      const formData = {
      name: presetData?.name,
      // ...(type && type.length > 0 && {
        type: trackerType,
      // }),
      // accessLevel: editData?.tracker?.accessLevel,
      filterValues:{
        includeKeywords: presetData?.data?.includeKeywords?.join(','),
        excludeKeywords: presetData?.data?.excludeKeywords?.join(','),
        userName: presetData?.data?.userName?.join(','),
        userOrgWebsite: presetData?.data?.userOrgWebsite?.join(','),
      }
    };
    console.log("formData", formData);
    try{
    const result = await createTracker(formData)
    if(result){
        router.replace(`/internal/trackers/${result?.id}/trackedEvents?type=${trackerType}&eventType=${isEventeli?"social":"active"}&view=table`);
      }
    }catch(error){

    }
  }
  console.log("presetData", presetTemplateData);
  
  return (
    <div className="relative h-screen w-full">
      <Loading/>
    </div>
  );
};

export default Preset;

// http://localhost:3000/signup?redirect=%2Fpreset%3FpresetId%3D1d619e5d-c620-464e-abfd-44a59ccbb34b0%26limit%3D1%26offset%3D13%26type%3DT_PRODUCT_KEYWORDS
