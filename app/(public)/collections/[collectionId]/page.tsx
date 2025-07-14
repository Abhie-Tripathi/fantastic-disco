// app/collections/[collectionId]/page.tsx
"use client"
import NotFound from '@/app/not-found';
import { useTrackerServices } from '@/services/trackerServices';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function CollectionPage() {
  const params = useParams();
  const collectionId = params.collectionId;
     const { presetData, createTracker } = useTrackerServices();
      const [isLoading, setIsLoading] = useState(false);
      const [presetTemplateData, setPresetTemplateData] = useState<PresetData>();
      const [fetchError,setFetchError] = useState(false);
      const fetchPresetJson = useCallback(async () => {
        if (isLoading) return;
    
        setIsLoading(true);
    
        try {
          const data = {
            presetId: collectionId
          };
    
          const result = await presetData(data);
          
          if (result) {
            setPresetTemplateData(result?.trackers[0]);
          }
          else {
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
      }, [presetData, isLoading]);
      useEffect(()=>{
        fetchPresetJson();
      },[])
      useEffect(()=>{
        const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  const orgName: string[] = [];
  const orgWebsite: string[] = [];

  presetTemplateData?.data?.organizations?.forEach((item:string) => {
    const value = item?.trim();
    if (!value) return;

    if (regex.test(value)) {
      orgWebsite.push(value);
    } else {
      orgName.push(value);
    }
  });
        const formData = {
    name: presetTemplateData?.name,
    searchByEntity: presetTemplateData?.trackerType[0]==="T_COMPETITOR"? "company": undefined,
    view:"list",
    trackerEventStatus:"active",
    filterValues: {
      ...(presetTemplateData?.data?.includeKeywords?.length > 0 && {
        includeKeywords: presetTemplateData.data.includeKeywords.join(","),
      }),
      ...(presetTemplateData?.data?.excludeKeywords?.length > 0 && {
        excludeKeywords: presetTemplateData.data.excludeKeywords.join(","),
      }),
      ...(presetTemplateData?.data?.userName?.length > 0 && {
        userName: presetTemplateData.data.userName.join(","),
      }),
      ...(presetTemplateData?.data?.userOrgWebsite?.length > 0 && {
        userOrgWebsite: presetTemplateData.data.userOrgWebsite.join(","),
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
  
      },[presetTemplateData])
  return <div>Collection ID: {collectionId}</div>;
}