"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
const Page = ({ params }: any) => {
  const { namespace } = params;
  const router = useRouter();
  useEffect(() => {
    router.push(`/${namespace}/settings/profile`);
  }, [router]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return <></>;
};

export default Page;
