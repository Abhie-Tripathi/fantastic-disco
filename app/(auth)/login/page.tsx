"use client";
import { LoadingPage } from "@/components/auth/loadingPage";
import { useAuthContext } from "@/context";
import { useTrackerServices } from "@/services/trackerServices";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { signUpSSO10times } = useAuthContext();
  const { verifyAccess } = useTrackerServices();

  // Get query params safely
  const email = searchParams.get("email") || "";
  const otp = searchParams.get("otp") || "";
  const target = searchParams.get("target") || "";
  const targetId = searchParams.get("targetId") || "";
  const token = searchParams.get("hash") || "";
  const userId = Number(searchParams.get("uid") || "");
  const redirectPath = searchParams.get("redirect") || "";

  useEffect(() => {
    const verify = async () => {
      try {
        const formData = { email, otp, target, targetId };
        const result = await verifyAccess(formData);

        if (result) {
          router.push("/internal/trackers?tab=allTrackers&skip=0");
        }
      } catch (error) {
        console.error("Verification failed:", error);
        router.push("https://whr.ai/gtm");
      }
    };

    if (token && userId) {
      signUpSSO10times(token, userId, redirectPath);
    }
    else if (email && otp && target && targetId) {
      verify();
    }
    else {
      router.push("https://whr.ai/gtm");
    }
  }, [email, otp, target, targetId, router]);

  return <LoadingPage />;
}
