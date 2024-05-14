"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
const Page = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/settings/company");
  }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return <></>;
};

export default Page;
