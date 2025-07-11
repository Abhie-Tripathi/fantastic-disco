"use client"
import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import TrackerPublic from "@/public/trackerPublic.jpg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useTrackerServices } from "@/services/trackerServices";
import { isEventeli } from "@/config";
import Loading from "@/components/ui/Loading";
import { PresetData } from '@/types/trackers';
import NotFound from "@/app/not-found";
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
  const [presetTemplateData, setPresetTemplateData] = useState<PresetData>();
  const [fetchError,setFetchError] = useState(false);
  const fetchPresetJson = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const data = {
        presetId
      };

      const result = await presetData(data);
      console.log("result",);
      
      if (result) {
        setPresetTemplateData(result?.trackers[0]);
        createTrackerHandler(result?.trackers[0]);
      }
      else {
        console.log("error is error");
        
        return (
      <NotFound />
    );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setFetchError(true);
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
  const createTrackerHandler = async (presetData: PresetData) => {
  const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  const orgName: string[] = [];
  const orgWebsite: string[] = [];

  presetData?.data?.organizations?.forEach((item:string) => {
    const value = item?.trim();
    if (!value) return;

    if (regex.test(value)) {
      orgWebsite.push(value);
    } else {
      orgName.push(value);
    }
  });

  const formData = {
    name: presetData?.name,
    type: trackerType ?? undefined,
    source: "preset",
    filterValues: {
      ...(presetData?.data?.includeKeywords?.length > 0 && {
        includeKeywords: presetData.data.includeKeywords.join(","),
      }),
      ...(presetData?.data?.excludeKeywords?.length > 0 && {
        excludeKeywords: presetData.data.excludeKeywords.join(","),
      }),
      ...(presetData?.data?.userName?.length > 0 && {
        userName: presetData.data.userName.join(","),
      }),
      ...(presetData?.data?.userOrgWebsite?.length > 0 && {
        userOrgWebsite: presetData.data.userOrgWebsite.join(","),
      }),
      ...(orgWebsite.length > 0 && {
        orgWebsite: orgWebsite.join(","),
      }),
      ...(orgName.length > 0 && {
        orgName: orgName.join(","),
      }),
    },
  };

  console.log("formData", formData);

  // Optional: uncomment when needed
  try {
    const result = await createTracker(formData)as {id: string};
    if (result) {
      router.replace(`/internal/trackers/${result?.id}/trackedEvents?type=${trackerType}&eventType=${isEventeli ? "social" : "active"}&view=table`);
    }
  } catch (error) {
    console.error("Tracker creation failed", error);
  }
};

  console.log("presetData", presetTemplateData);
  
  return (
    <div className="relative h-screen w-full">
      {fetchError && <NotFound/>}
      <Loading/>
    </div>
  );
};

export default Preset;

// http://localhost:3000/signup?redirect=%2Fpreset%3FpresetId%3D1d619e5d-c620-464e-abfd-44a59ccbb34b0%26limit%3D1%26offset%3D13%26type%3DT_PRODUCT_KEYWORDS
