import PrivatePresets from "@/app/components/internal/trackers/Filters/privatePreset";
import PublicPresets from "@/app/components/internal/trackers/Filters/publicPreset";
import { FilterProvider } from "@/context/filterContext";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import { isEventeli } from "@/config";

const CollectionsPage = () => {
  const cookieStore = cookies();
  const userToken = cookieStore.get(
    process.env.NEXT_COOKIE_PREFIX
      ? `${process.env.NEXT_COOKIE_PREFIX}-token`
      : "dev-token"
  );

  if (isEventeli) {
	if(userToken){
		redirect("/internal/trackers?showTemplates=true")
	}else
    redirect(`/signup?redirect=${encodeURIComponent(`/trackers?showTemplates=true`)}`);
  }

  return (
    <div className="h-full">
      {userToken ? (
        <FilterProvider>
          <PrivatePresets isPublic={false} isFull={true}/>
        </FilterProvider>
      ) : (
        <PublicPresets isPublic={true} />
      )}
    </div>
  );
};

export default CollectionsPage;