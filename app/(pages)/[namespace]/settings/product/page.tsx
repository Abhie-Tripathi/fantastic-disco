"use client";

import GeniProductPage from "@/components/settings/genisettings/Product";
import GTMProductPage from "@/components/settings/gtmsettings/Product";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
const Page = ({ params }: any) => {
  const { namespace } = params;
  const router = useRouter();

  return (
    <>
      {namespace === "internal" ? (
        <>
          <GTMProductPage />
        </>
      ) : (
        <>
          <GeniProductPage />
          {/* {
            router.push(`profile`)
          } */}
        </>
      )}
    </>
  );
};

export default Page;
