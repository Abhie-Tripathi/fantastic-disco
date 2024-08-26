'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/widget/list");
  }, [router]);

  return null; // Optionally return a loader or a blank div
};

export default Page;
